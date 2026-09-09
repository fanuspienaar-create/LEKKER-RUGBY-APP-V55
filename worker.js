const cors={"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"content-type,authorization","Access-Control-Allow-Methods":"GET,POST,OPTIONS"};
const json=(x,s=200,extra={})=>new Response(JSON.stringify(x),{status:s,headers:{"content-type":"application/json; charset=utf-8",...cors,...extra}});
async function sha256(text){const b=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(text));return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,"0")).join("")}
async function sign(text,secret){return sha256(text+"|"+secret)}
async function auth(req,env){const h=req.headers.get("authorization")||"";if(!h.startsWith("Bearer "))return false;const token=h.slice(7);const [ts,sig]=token.split(".");const secret=env.ADMIN_SECRET||"LEKKER-RUGBY-ADMIN-SECRET-CHANGE-ME";if(!ts||!sig)return false;if(Date.now()-Number(ts)>86400000)return false;return sig===await sign(ts,secret)}
let adminSchemaReady=false;
async function ensureAdminSchema(env){if(adminSchemaReady)return;try{await env.DB.batch([env.DB.prepare('CREATE TABLE IF NOT EXISTS voting_competitions (id INTEGER PRIMARY KEY AUTOINCREMENT, round_id TEXT NOT NULL UNIQUE, name TEXT NOT NULL, description TEXT, active INTEGER NOT NULL DEFAULT 0, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)'),env.DB.prepare('CREATE INDEX IF NOT EXISTS voting_competitions_active_idx ON voting_competitions(active)'),env.DB.prepare('CREATE TABLE IF NOT EXISTS app_settings (key TEXT PRIMARY KEY, value TEXT NOT NULL, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)')]);const round=env.ROUND_ID||'world-xv-2026';const hit=await env.DB.prepare('SELECT id FROM voting_competitions WHERE round_id=?').bind(round).first();if(!hit)await env.DB.prepare('INSERT INTO voting_competitions(round_id,name,description,active) VALUES(?,?,?,1)').bind(round,'LEKKER Rugby Wêreld XV 2026','Standaard LEKKER Rugby stemkompetisie.',1).run();adminSchemaReady=true}catch(e){}}
async function activeRound(env){await ensureAdminSchema(env);try{const r=await env.DB.prepare("SELECT round_id FROM voting_competitions WHERE active=1 ORDER BY id DESC LIMIT 1").first();if(r?.round_id)return String(r.round_id)}catch(e){}return env.ROUND_ID||'world-xv-2026'}
const positions=[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
const POINTS=[10,9,8,7,6,5,4,3,2,1];
function normalizeTop10(v){
  if(Array.isArray(v)) return [...new Set(v.map(x=>String(x).trim()).filter(Boolean))].slice(0,10);
  if(typeof v==='string' && v.trim()) return [v.trim()];
  return [];
}
function aggregateVotes(rows){
  const out={};
  for(const pos of positions){
    const score=new Map();
    for(const row of rows||[]){
      const arr=normalizeTop10(row['pos_'+pos]);
      arr.forEach((name,i)=>{
        if(!score.has(name)) score.set(name,{name,points:0,firstPlace:0,votes:0});
        const x=score.get(name); x.points+=POINTS[i]||0; x.votes++; if(i===0)x.firstPlace++;
      });
    }
    out[pos]=[...score.values()].sort((a,b)=>b.points-a.points||b.firstPlace-a.firstPlace||b.votes-a.votes||a.name.localeCompare(b.name)).slice(0,10);
  }
  return out;
}

async function cachedApiSports(url,env){
  const cache=await caches.open("lekker-rugby-api-v1");
  const key=new Request(url);
  const hit=await cache.match(key);
  if(hit){
    const age=Date.now()-Number(hit.headers.get("x-cache-time")||0);
    if(age<30000)return hit.json();
  }
  const r=await fetch(url,{headers:{"x-apisports-key":env.RUGBY_API_KEY}});
  const d=await r.json();
  if(!r.ok)throw new Error(`API-Sports status ${r.status}`);
  const out=new Response(JSON.stringify(d),{headers:{"content-type":"application/json","x-cache-time":String(Date.now()),"cache-control":"public,max-age=30"}});
  await cache.put(key,out.clone());
  return d;
}

async function playerPhoto(name,country=''){
  const clean=String(name||'').trim();if(!clean)return '';
  const cn=String(country||'').trim();
  const headers={'user-agent':'LEKKER-RUGBY-APP/1.0','accept':'text/html,application/json'};
  try{
    const q=encodeURIComponent(`${clean} rugby union ${cn}`.trim());
    const r=await fetch('https://www.wikidata.org/w/api.php?action=wbsearchentities&search='+q+'&language=en&format=json&origin=*&limit=8',{headers});
    if(r.ok){const d=await r.json();for(const hit of (d.search||[]).filter(x=>/rugby/i.test(String(x.description||'')))){
      const id=hit.id,ent=await fetch('https://www.wikidata.org/w/api.php?action=wbgetentities&ids='+encodeURIComponent(id)+'&props=labels|descriptions|claims&languages=en&format=json&origin=*',{headers});if(!ent.ok)continue;
      const ed=await ent.json(),qent=ed?.entities?.[id],desc=String(qent?.descriptions?.en?.value||'').toLowerCase();if(!qent||!desc.includes('rugby'))continue;
      const p18=qent?.claims?.P18?.[0]?.mainsnak?.datavalue?.value;if(p18)return 'https://commons.wikimedia.org/wiki/Special:Redirect/file/'+encodeURIComponent(String(p18).replace(/ /g,'_'))+'?width=900';
    }}
  }catch(e){}
  try{
    const slug=clean.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/['’]/g,'').replace(/[^a-zA-Z0-9]+/g,'-').replace(/^-|-$/g,'').toLowerCase();
    const r=await fetch('https://www.rugbypass.com/players/'+slug+'/',{headers});if(r.ok){const html=await r.text();const m=html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)||html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);if(m?.[1])return m[1].replace(/&amp;/g,'&');}
  }catch(e){}
  try{
    const q=encodeURIComponent(`"${clean}" rugby union ${cn}`.trim()),r=await fetch('https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch='+q+'&gsrnamespace=6&gsrlimit=80&prop=imageinfo|categories&iiprop=url|size&iiurlwidth=900&cllimit=50&format=json&origin=*',{headers});
    if(r.ok){const d=await r.json();const files=Object.values(d?.query?.pages||{}).map(p=>{const i=p.imageinfo?.[0]||{};const cats=(p.categories||[]).map(c=>String(c.title||'')).join(' ');return {t:String(p.title||''),c:cats,u:i.thumburl||i.url||'',w:+(i.thumbwidth||i.width||0),h:+(i.thumbheight||i.height||0)}}).filter(x=>x.u&&x.w&&x.h&&/rugby|union player/i.test(x.t+' '+x.c));const score=x=>{let z=0,r=x.w/x.h,t=x.t.toLowerCase();if(t.includes(clean.toLowerCase()))z+=220;if(x.h>=x.w*1.05)z+=90;if(r>.5&&r<.95)z+=35;if(/portrait|headshot|profile|player|rugby/.test(t))z+=40;if(/match|game|action|try|tackle|stadium|team|squad|group|cricket/.test(t))z-=70;z-=Math.abs(r-.72)*20;return z};files.sort((a,b)=>score(b)-score(a));if(files[0]&&score(files[0])>=150)return files[0].u;}
  }catch(e){}
  return '';
}

function parseSuperSportText(text){
  // SuperSport's server-rendered fixture page is used as a live refresh when
  // available. The structured snapshot remains the safe fallback.
  const clean=text.replace(/\s+/g,' ');
  const fixtures=[];
  const rx=/(Toyota Stadium, Bloemfontein|M&T Bank Stadium, Baltimore, USA|Windhoek Draught Park, TBC|Stadio Comunale di Monigo|The Sportsground|Kingspan Stadium|Ellis Park Stadium, Johannesburg|Hollywoodbets Kings Park, Durban|Thomond Park, TBC|Stadio Sergio Lanfranchi, TBC|Parc y Scarlets, TBC|Optus Stadium, Perth|Cardiff Arms Park, TBC|The DAM Health Stadium, TBC|Rodney Parade|Scotstoun Stadium, TBC)\s+([^0-9]{2,50})\s+([^0-9]{2,50})\s+(\d{1,2}:\d{2})/g;
  let m; while((m=rx.exec(clean))){fixtures.push([m[0],m[2].trim(),m[3].trim(),m[1],m[4]]);} return fixtures;
}


async function randomToken(){const a=new Uint8Array(32);crypto.getRandomValues(a);return [...a].map(x=>x.toString(16).padStart(2,'0')).join('')}
async function pbkdf2(password,salt){const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(password),'PBKDF2',false,['deriveBits']);const bits=await crypto.subtle.deriveBits({name:'PBKDF2',salt:new TextEncoder().encode(salt),iterations:120000,hash:'SHA-256'},key,256);return [...new Uint8Array(bits)].map(x=>x.toString(16).padStart(2,'0')).join('')}
async function predictorUserFromReq(req,env){const h=req.headers.get('authorization')||'';if(!h.startsWith('Bearer '))return null;const hash=await sha256(h.slice(7));const r=await env.DB.prepare('SELECT u.id,u.username,u.display_name AS displayName,u.favourite_team AS team,s.expires_at AS expiresAt FROM predictor_sessions s JOIN predictor_users u ON u.id=s.user_id WHERE s.token_hash=?').bind(hash).first();if(!r||new Date(r.expiresAt).getTime()<Date.now())return null;return r}
async function ensurePredictorAccountSchema(env){try{await env.DB.batch([env.DB.prepare('CREATE TABLE IF NOT EXISTS predictor_users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT NOT NULL UNIQUE, password_hash TEXT NOT NULL, password_salt TEXT NOT NULL, display_name TEXT NOT NULL, favourite_team TEXT, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)'),env.DB.prepare('CREATE TABLE IF NOT EXISTS predictor_sessions (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL, token_hash TEXT NOT NULL UNIQUE, expires_at TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)'),env.DB.prepare('CREATE INDEX IF NOT EXISTS predictor_sessions_user_idx ON predictor_sessions(user_id)')])}catch(e){}}

async function handleFetch(req,env){
  if(req.method==='OPTIONS')return new Response(null,{headers:cors});
  const u=new URL(req.url);
  try{
    if(u.pathname==='/health')return json({ok:true,service:'LEKKER RUGBY API',time:new Date().toISOString()});

    if(u.pathname==='/vote'&&req.method==='POST'){
      const body=await req.json();
      for(const p of positions){const arr=normalizeTop10(body[p]);if(arr.length!==10)return json({message:`Kies presies 10 spelers vir posisie #${p}.`},400);}
      const ip=req.headers.get('CF-Connecting-IP')||req.headers.get('x-forwarded-for')||'unknown';
      const ipHash=await sha256(ip+'|'+(env.IP_SALT||env.ADMIN_SECRET||'lekker-rugby'));
      const round=await activeRound(env);
      const exists=await env.DB.prepare('SELECT id FROM votes_v2 WHERE round_id=?1 AND ip_hash=?2').bind(round,ipHash).first();
      if(exists)return json({message:'Hierdie IP-adres het reeds vir hierdie stemronde gestem.'},409);
      const cols=positions.map(p=>'pos_'+p).join(','); const qs=positions.map(()=>'?').join(',');
      const vals=positions.map(p=>JSON.stringify(normalizeTop10(body[p])));
      await env.DB.prepare(`INSERT INTO votes_v2(round_id,ip_hash,${cols}) VALUES(?, ?, ${qs})`).bind(round,ipHash,...vals).run();
      return json({message:'Jou persoonlike Top 10 is ontvang!'});
    }

    if(u.pathname==='/rankings'&&req.method==='GET'){
      const round=await activeRound(env);
      let r=await env.DB.prepare('SELECT pos_1,pos_2,pos_3,pos_4,pos_5,pos_6,pos_7,pos_8,pos_9,pos_10,pos_11,pos_12,pos_13,pos_14,pos_15 FROM votes_v2 WHERE round_id=?').bind(round).all();
      const rows=r.results||[];
      return json({rankings:aggregateVotes(rows),voteCount:rows.length,round});
    }


    if(u.pathname==='/predictor/auth'&&req.method==='POST'){
      await ensurePredictorAccountSchema(env); const b=await req.json(); const action=String(b.action||'login'); const username=String(b.username||'').trim().toLowerCase(); const password=String(b.password||''); if(!/^[a-z0-9._-]{3,30}$/.test(username)||password.length<6)return json({message:'Gebruik 3–30 karakters vir jou gebruikersnaam en minstens 6 karakters vir jou wagwoord.'},400);
      if(action==='register'){const exists=await env.DB.prepare('SELECT id FROM predictor_users WHERE username=?').bind(username).first();if(exists)return json({message:'Daardie gebruikersnaam bestaan reeds.'},409);const salt=await randomToken();const hash=await pbkdf2(password,salt);const r=await env.DB.prepare('INSERT INTO predictor_users(username,password_hash,password_salt,display_name) VALUES(?,?,?,?)').bind(username,hash,salt,username).run();const id=r.meta.last_row_id;const token=await randomToken();await env.DB.prepare('INSERT INTO predictor_sessions(user_id,token_hash,expires_at) VALUES(?,?,?)').bind(id,await sha256(token),new Date(Date.now()+30*86400000).toISOString()).run();return json({token,user:{id,username,displayName:username,team:''}})}
      const urow=await env.DB.prepare('SELECT id,username,password_hash,password_salt,display_name AS displayName,favourite_team AS team FROM predictor_users WHERE username=?').bind(username).first();if(!urow)return json({message:'Gebruikersnaam of wagwoord is verkeerd.'},401);const check=await pbkdf2(password,urow.password_salt);if(check!==urow.password_hash)return json({message:'Gebruikersnaam of wagwoord is verkeerd.'},401);const token=await randomToken();await env.DB.prepare('INSERT INTO predictor_sessions(user_id,token_hash,expires_at) VALUES(?,?,?)').bind(urow.id,await sha256(token),new Date(Date.now()+30*86400000).toISOString()).run();return json({token,user:{id:urow.id,username:urow.username,displayName:urow.displayName,team:urow.team||''}})
    }
    if(u.pathname==='/predictor/me'&&req.method==='GET'){await ensurePredictorAccountSchema(env);const user=await predictorUserFromReq(req,env);if(!user)return json({message:'Jy moet eers aanteken.'},401);return json({user})}
    if(u.pathname==='/predictor/me'&&req.method==='POST'){await ensurePredictorAccountSchema(env);const user=await predictorUserFromReq(req,env);if(!user)return json({message:'Jy moet eers aanteken.'},401);const b=await req.json();const displayName=String(b.displayName||user.username).trim().slice(0,30)||user.username;const team=String(b.team||'').trim().slice(0,60);await env.DB.prepare('UPDATE predictor_users SET display_name=?,favourite_team=?,updated_at=CURRENT_TIMESTAMP WHERE id=?').bind(displayName,team,user.id).run();return json({user:{...user,displayName,team}})}
    if(u.pathname==='/predictor/pools'&&req.method==='POST'){
      const body=await req.json(); const action=String(body.action||'join'); const authUser=await predictorUserFromReq(req,env); const nickname=String(body.nickname||authUser?.displayName||'Speler').trim().slice(0,30); const deviceId=String(body.deviceId||authUser?.username||'').trim().slice(0,120); if(!deviceId)return json({message:'Teken eers in om pools te gebruik.'},401);
      if(action==='create'){
        let code=''; for(let i=0;i<12;i++){const a=new Uint8Array(4);crypto.getRandomValues(a);code='LR'+[...a].map(x=>(x%36).toString(36)).join('').slice(0,5).toUpperCase();const hit=await env.DB.prepare('SELECT id FROM predictor_pools WHERE code=?').bind(code).first();if(!hit)break;}
        if(!code)return json({message:'Pool-kode kon nie geskep word nie.'},500); const name=String(body.name||body.poolName||`${nickname} se LEKKER Rugby Pool`).trim().slice(0,60);
        const r=await env.DB.prepare('INSERT INTO predictor_pools(code,name) VALUES(?,?)').bind(code,name).run(); const poolId=r.meta.last_row_id; await env.DB.prepare('INSERT INTO predictor_members(pool_id,device_id,nickname) VALUES(?,?,?) ON CONFLICT(pool_id,device_id) DO UPDATE SET nickname=excluded.nickname').bind(poolId,deviceId,nickname).run(); return json({code,name,poolId});
      }
      const code=String(body.code||'').trim().toUpperCase(); if(!code)return json({message:'Voer die pool-kode in.'},400); const pool=await env.DB.prepare('SELECT id,code,name FROM predictor_pools WHERE code=?').bind(code).first(); if(!pool)return json({message:'Pool-kode bestaan nie.'},404); await env.DB.prepare('INSERT INTO predictor_members(pool_id,device_id,nickname) VALUES(?,?,?) ON CONFLICT(pool_id,device_id) DO UPDATE SET nickname=excluded.nickname').bind(pool.id,deviceId,nickname).run(); return json({code:pool.code,name:pool.name,poolId:pool.id});
    }

    if(u.pathname==='/predictor/predict'&&req.method==='POST'){
      const b=await req.json(); const deviceId=String(b.deviceId||'').trim(); const code=String(b.pool||'').trim().toUpperCase(); const fixtureId=String(b.fixtureId||'').trim(); const ph=Number(b.predHome),pa=Number(b.predAway); if(!deviceId||!code||!fixtureId||!Number.isInteger(ph)||!Number.isInteger(pa)||ph<0||pa<0||ph>99||pa>99)return json({message:'Ongeldige voorspelling.'},400);
      const pool=await env.DB.prepare('SELECT id FROM predictor_pools WHERE code=?').bind(code).first(); if(!pool)return json({message:'Pool-kode bestaan nie.'},404);
      await env.DB.prepare('INSERT INTO predictor_members(pool_id,device_id,nickname) VALUES(?,?,?) ON CONFLICT(pool_id,device_id) DO UPDATE SET nickname=excluded.nickname').bind(pool.id,deviceId,String(b.nickname||'Speler').trim().slice(0,30)).run();
      await env.DB.prepare(`INSERT INTO predictor_predictions(pool_id,device_id,nickname,fixture_id,league,match_date,home_team,away_team,venue,pred_home,pred_away) VALUES(?,?,?,?,?,?,?,?,?,?,?) ON CONFLICT(pool_id,device_id,fixture_id) DO UPDATE SET nickname=excluded.nickname,pred_home=excluded.pred_home,pred_away=excluded.pred_away,saved_at=CURRENT_TIMESTAMP`).bind(pool.id,deviceId,String(b.nickname||'Speler').trim().slice(0,30),fixtureId,String(b.league||''),String(b.date||''),String(b.home||''),String(b.away||''),String(b.venue||''),ph,pa).run(); return json({message:'Voorspelling gestoor.'});
    }

    if(u.pathname==='/predictor/state'&&req.method==='GET'){
      const code=String(u.searchParams.get('pool')||'').trim().toUpperCase(); if(!code)return json({members:[],predictions:[]}); const pool=await env.DB.prepare('SELECT id,code,name FROM predictor_pools WHERE code=?').bind(code).first(); if(!pool)return json({members:[],predictions:[],code});
      const m=await env.DB.prepare('SELECT device_id AS deviceId,nickname FROM predictor_members WHERE pool_id=? ORDER BY nickname').bind(pool.id).all(); const p=await env.DB.prepare('SELECT device_id AS deviceId,nickname,fixture_id AS fixtureId,league,match_date AS date,home_team AS home,away_team AS away,venue,pred_home AS homeScore,pred_away AS awayScore,saved_at AS savedAt FROM predictor_predictions WHERE pool_id=?').bind(pool.id).all();
      return json({code:pool.code,name:pool.name,members:m.results||[],predictions:(p.results||[]).map(x=>({...x,home:x.homeScore,away:x.awayScore,pool:pool.code}))});
    }

    if(u.pathname==='/rugby/supersport'&&req.method==='GET'){
      if(env.RUGBY_API_KEY){
        try{
          const today=new Date().toISOString().slice(0,10);
          const api=new URL('https://v1.rugby.api-sports.io/games'); api.searchParams.set('date',today);
          const d=await cachedApiSports(api.toString(),env);
          const games=d.response||[];
          return json({provider:'API-Sports Rugby',updatedAt:new Date().toISOString(),currentLive:[],fixtures:[],results:[],games});
        }catch(e){}
      }
      // Verified SuperSport snapshot. This is the safe fallback until a deployed
      // Worker is refreshed against the live source. The source was checked on
      // 6 September 2026.
      return json({provider:'SuperSport',verifiedAt:'2026-09-06T15:39:00+02:00',currentLive:[['2026-09-06T15:30:00+02:00','Currie Cup','Toyota Cheetahs','Airlink Pumas','Toyota Stadium, Bloemfontein','LIVE at verification']],fixtures:[
    ["2026-09-06T11:00:00+02:00","Currie Cup","Suzuki Griquas","Fidelity ADT Lions","Windhoek Draught Park"],
    ["2026-09-06T13:30:00+02:00","Currie Cup","Toyota Cheetahs","Airlink Pumas","Toyota Stadium, Bloemfontein"],
    ["2026-09-12T21:00:00+02:00","International Rugby","Springboks Men","New Zealand Men","M&T Bank Stadium, Baltimore, USA"],
    ["2026-09-25T18:45:00+02:00","URC","Benetton Rugby","Dragons","Stadio Comunale di Monigo"],
    ["2026-09-25T18:45:00+02:00","URC","Connacht","Stormers","The Sportsground"],
    ["2026-09-25T18:45:00+02:00","URC","Ulster","Edinburgh","Kingspan Stadium"],
    ["2026-09-26T11:30:00+02:00","URC","Lions","Leinster","Ellis Park Stadium, Johannesburg"],
    ["2026-09-26T14:00:00+02:00","URC","Sharks","Ospreys","Hollywoodbets Kings Park, Durban"],
    ["2026-09-26T16:30:00+02:00","URC","Munster","Glasgow Warriors","Thomond Park"],
    ["2026-09-26T16:30:00+02:00","URC","Zebre","Bulls","Stadio Sergio Lanfranchi"],
    ["2026-09-26T18:45:00+02:00","URC","Llanelli Scarlets","Cardiff Rugby","Parc y Scarlets"],
    ["2026-09-27T09:45:00+02:00","International Rugby","Australia Men","Springboks Men","Optus Stadium, Perth"],
    ["2026-10-02T18:45:00+02:00","URC","Cardiff Rugby","Zebre","Cardiff Arms Park"],
    ["2026-10-02T18:45:00+02:00","URC","Edinburgh","Stormers","The DAM Health Stadium"],
    ["2026-10-02T18:45:00+02:00","URC","Benetton Rugby","Connacht","Stadio Comunale di Monigo"],
    ["2026-10-03T11:45:00+02:00","URC","Lions","Ospreys","Ellis Park Stadium, Johannesburg"],
    ["2026-10-03T14:00:00+02:00","URC","Dragons","Llanelli Scarlets","Rodney Parade"],
    ["2026-10-03T16:30:00+02:00","URC","Sharks","Leinster","Hollywoodbets Kings Park, Durban"],
    ["2026-10-03T16:30:00+02:00","URC","Glasgow Warriors","Ulster","Scotstoun Stadium"],
    ["2026-10-03T18:45:00+02:00","URC","Munster","Bulls","Thomond Park"],
    ["2026-10-04T10:00:00+02:00","Women's Internationals","Spain Women","South Africa Women","Estadio Olimpico de la Cartuja, Seville"],
    ["2026-10-09T18:45:00+02:00","URC","Glasgow Warriors","Connacht","Scotstoun Stadium"],
    ["2026-10-10T06:10:00+02:00","International Rugby","New Zealand Men","Australia Men","Eden Park, Auckland"],
    ["2026-10-17T05:00:00+02:00","International Rugby","Australia Men","New Zealand Men","Stadium Australia"],
    ["2026-10-24T05:50:00+02:00","International Rugby","Japan Men","Fiji Men","Prince Chichibu Memorial Stadium"]
  ],results:[
    ["2026-09-05","International Rugby","Springboks Men",29,"New Zealand Men",24,"FNB Stadium"],
    ["2026-09-05","International Rugby","Argentina Men",28,"Australia Men",28,"Estadio Malvinas Argentinas"],
    ["2026-09-05","Women's Internationals","South Africa Women",20,"New Zealand Women",52,"FNB Stadium"],
    ["2026-09-04","Women's Internationals","Japan Women",12,"Fiji Women",15,"Japan Base"],
    ["2026-08-30","Currie Cup","Sanlam Boland Kavaliers",17,"Suzuki Griquas",48,"Boland Stadium"],
    ["2026-08-29","International Rugby","Argentina Men",21,"Australia Men",27,"Estadio 23 de Agosto"],
    ["2026-08-29","International Rugby","Springboks Men",33,"New Zealand Men",26,"DHL Stadium, Cape Town"],
    ["2026-08-29","Currie Cup","Airlink Pumas",52,"Toyota Cheetahs",26,"Mbombela Stadium"],
    ["2026-08-28","Currie Cup","Hollywoodbets Sharks XV",53,"Vodacom Bulls XV",22,"Hollywoodbets Kings Park"],
    ["2026-08-28","Currie Cup","Fidelity ADT Lions",36,"DHL Stormers XXIII",12,"Ellis Park Stadium"],
    ["2026-08-25","Tour Match","Lions",35,"New Zealand Men",41,"Ellis Park Stadium"],
    ["2026-08-22","International Rugby","Springboks Men",16,"New Zealand Men",33,"Ellis Park Stadium, Johannesburg"]
  ]});
    }

    if(u.pathname==='/rugby/news'&&req.method==='GET'){
      try{
        const rss='https://news.google.com/rss/search?q=rugby%20union%20OR%20Springboks%20OR%20All%20Blacks&hl=en-ZA&gl=ZA&ceid=ZA:en';
        const r=await fetch(rss,{headers:{'user-agent':'LEKKER-RUGBY-APP/1.0'},cache:'no-store'});
        if(!r.ok)return json({items:[]},502);
        const xml=await r.text(); const items=[]; const blocks=xml.split('<item>').slice(1,21);
        for(const b of blocks){
          const text=(tag)=>{const m=b.match(new RegExp('<'+tag+'>([\s\S]*?)</'+tag+'>'));return m?m[1].replace(/<!\[CDATA\[|\]\]>/g,'').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').trim():''};
          const title=text('title'),url=text('link'),description=text('description'),pub=text('pubDate');
          if(title&&url)items.push({icon:'📰',title,description:description.replace(/<[^>]+>/g,'').slice(0,260),url,publishedAt:pub});
        }
        return json({provider:'Google News RSS',updatedAt:new Date().toISOString(),items});
      }catch(e){return json({items:[]},502)}
    }

    if(u.pathname==='/rugby/live'&&req.method==='GET'){
      if(!env.RUGBY_API_KEY)return json({message:'RUGBY_API_KEY is nie in Cloudflare Worker gestel nie.'},503);
      const today=new Date().toISOString().slice(0,10);
      const api=new URL('https://v1.rugby.api-sports.io/games');
      api.searchParams.set('date',today);
      const d=await cachedApiSports(api.toString(),env);
      return json({games:d.response||[],provider:'API-Sports Rugby',updatedAt:new Date().toISOString(),date:today});
    }

    if(u.pathname==='/rugby/history'&&req.method==='GET'){
      const team=(u.searchParams.get('team')||'').trim();
      const venue=(u.searchParams.get('venue')||'').trim();
      const limit=Math.min(Number(u.searchParams.get('limit')||500),1000);
      let sql='SELECT * FROM rugby_matches'; const args=[]; const where=[];
      if(team){where.push('(home_team LIKE ? OR away_team LIKE ?)');args.push('%'+team+'%','%'+team+'%');}
      if(venue){where.push('(venue LIKE ? OR venue_city LIKE ?)');args.push('%'+venue+'%','%'+venue+'%');}
      if(where.length)sql+=' WHERE '+where.join(' AND '); sql+=' ORDER BY played_at DESC LIMIT ?'; args.push(limit);
      const r=await env.DB.prepare(sql).bind(...args).all(); const games=r.results||[];
      const summary={played:games.length,wins:0,losses:0,draws:0,pointsFor:0,pointsAgainst:0,stadiums:{}};
      for(const g of games){const home=g.home_team===team||(!team&&String(g.home_team).toLowerCase().includes(String(team).toLowerCase())); const hs=Number(g.home_score||0),as=Number(g.away_score||0); if(team){if(hs===as)summary.draws++;else if((home&&hs>as)||(!home&&as>hs))summary.wins++;else summary.losses++;summary.pointsFor+=home?hs:as;summary.pointsAgainst+=home?as:hs;} const v=g.venue||'Onbekende stadion';if(!summary.stadiums[v])summary.stadiums[v]={played:0,wins:0,losses:0,draws:0};const st=summary.stadiums[v];st.played++;if(team){if(hs===as)st.draws++;else if((home&&hs>as)||(!home&&as>hs))st.wins++;else st.losses++;}}
      return json({team,venue,games,summary});
    }

    if(u.pathname==='/rugby/summary'&&req.method==='GET'){
      const league=u.searchParams.get('league'); const event=u.searchParams.get('event');
      if(!league||!event)return json({message:'league en event word benodig.'},400);
      const url=`https://site.api.espn.com/apis/site/v2/sports/rugby/${encodeURIComponent(league)}/summary?event=${encodeURIComponent(event)}`;
      const r=await fetch(url,{cache:'no-store'}); if(!r.ok)return json({message:'Wedstryddata kon nie gelaai word nie.'},502);
      const d=await r.json(); return json({provider:'ESPN',summary:d});
    }

    if(u.pathname==='/player-photo-url'&&req.method==='GET'){
      const name=u.searchParams.get('name'); const country=u.searchParams.get('country')||'';
      if(!name)return json({message:'Missing name'},400);
      const source=await playerPhoto(name,country);
      if(!source)return json({url:''},404);
      return json({url:source,name});
    }

    if(u.pathname==='/player-photo'&&req.method==='GET'){
      const name=u.searchParams.get('name');
      if(!name)return new Response('Missing name',{status:400,headers:cors});
      const cache=await caches.open('lekker-rugby-photos-v1');
      const cacheKey=new Request('https://photos.lekker-rugby.local/'+encodeURIComponent(name));
      const hit=await cache.match(cacheKey);
      if(hit)return new Response(hit.body,{headers:{...cors,'content-type':hit.headers.get('content-type')||'image/jpeg','cache-control':'public,max-age=604800'}});
      const source=await playerPhoto(name);
      if(!source)return new Response('',{status:404,headers:cors});
      const img=await fetch(source,{headers:{'user-agent':'LEKKER-RUGBY-APP/1.0'}});
      if(!img.ok)return new Response('',{status:404,headers:cors});
      const h=new Headers(cors);h.set('content-type',img.headers.get('content-type')||'image/jpeg');h.set('cache-control','public,max-age=604800');
      const out=new Response(img.body,{headers:h});
      await cache.put(cacheKey,out.clone());
      return out;
    }

    if(u.pathname==='/admin/competitions'&&req.method==='GET'){
      if(!await auth(req,env))return json({message:'Nie gemagtig nie.'},401);
      const r=await env.DB.prepare('SELECT id,round_id AS roundId,name,description,active,created_at AS createdAt FROM voting_competitions ORDER BY id DESC').all();
      return json({competitions:r.results||[],activeRound:await activeRound(env)});
    }
    if(u.pathname==='/admin/competitions'&&req.method==='POST'){
      if(!await auth(req,env))return json({message:'Nie gemagtig nie.'},401);
      const b=await req.json();const roundId=String(b.roundId||'').trim().slice(0,80);const name=String(b.name||'').trim().slice(0,120);const description=String(b.description||'').trim().slice(0,500);
      if(!roundId||!name)return json({message:'Round ID en naam is verpligtend.'},400);
      await env.DB.prepare('UPDATE voting_competitions SET active=0').run();
      await env.DB.prepare('INSERT INTO voting_competitions(round_id,name,description,active) VALUES(?,?,?,1) ON CONFLICT(round_id) DO UPDATE SET name=excluded.name,description=excluded.description,active=1').bind(roundId,name,description).run();
      return json({ok:true,roundId,name,active:true});
    }
    if(u.pathname==='/admin/reset-votes'&&req.method==='POST'){
      if(!await auth(req,env))return json({message:'Nie gemagtig nie.'},401);
      const b=await req.json().catch(()=>({}));const round=String(b.roundId||await activeRound(env)).trim();
      const r=await env.DB.prepare('DELETE FROM votes_v2 WHERE round_id=?').bind(round).run();
      return json({ok:true,roundId:round,deleted:r.meta?.changes||0});
    }
    if(u.pathname==='/admin/votes'&&req.method==='GET'){
      if(!await auth(req,env))return json({message:'Nie gemagtig nie.'},401);
      const round=String(u.searchParams.get('round')||await activeRound(env)).trim();
      const r=await env.DB.prepare('SELECT id,submitted_at AS submittedAt,pos_1,pos_2,pos_3,pos_4,pos_5,pos_6,pos_7,pos_8,pos_9,pos_10,pos_11,pos_12,pos_13,pos_14,pos_15 FROM votes_v2 WHERE round_id=? ORDER BY id DESC LIMIT 1000').bind(round).all();
      const rows=(r.results||[]).map(x=>{const y={id:x.id,submittedAt:x.submittedAt};for(const p of positions)y[p]=normalizeTop10(x['pos_'+p]);return y});
      return json({roundId:round,count:rows.length,votes:rows,aggregate:aggregateVotes(r.results||[])});
    }
    if(u.pathname==='/admin/settings'&&req.method==='GET'){
      if(!await auth(req,env))return json({message:'Nie gemagtig nie.'},401);
      const r=await env.DB.prepare('SELECT key,value,updated_at AS updatedAt FROM app_settings ORDER BY key').all();return json({settings:r.results||[]});
    }
    if(u.pathname==='/admin/settings'&&req.method==='POST'){
      if(!await auth(req,env))return json({message:'Nie gemagtig nie.'},401);
      const b=await req.json();const entries=b.settings&&typeof b.settings==='object'?b.settings:{};
      for(const [key,val] of Object.entries(entries)){if(!/^[A-Za-z0-9_.-]{1,80}$/.test(key))continue;await env.DB.prepare('INSERT INTO app_settings(key,value) VALUES(?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value,updated_at=CURRENT_TIMESTAMP').bind(key,String(val).slice(0,1000)).run();}
      return json({ok:true});
    }
    if(u.pathname==='/admin/login'&&req.method==='POST'){
      const b=await req.json();
      const configuredPassword=env.ADMIN_PASSWORD||'LekkerRugby1234'; if(!b.password||b.password!==configuredPassword)return json({message:'Ongeldige admin-wagwoord.'},401);
      const ts=String(Date.now());const secret=env.ADMIN_SECRET||'LEKKER-RUGBY-ADMIN-SECRET-CHANGE-ME';return json({token:ts+'.'+await sign(ts,secret)});
    }
    if(u.pathname==='/admin/players'&&req.method==='POST'){
      if(!await auth(req,env))return json({message:'Nie gemagtig nie.'},401);
      const b=await req.json();const name=String(b.name||'').trim();const country=String(b.country||'').trim();const position=Number(b.pos);
      if(!name||!country||position<1||position>15)return json({message:'Ongeldige spelerdata.'},400);
      await env.DB.prepare('INSERT OR IGNORE INTO players(name,country,position) VALUES(?,?,?)').bind(name,country,position).run();return json({ok:true});
    }
    if(u.pathname==='/admin/players'&&req.method==='GET'){
      if(!await auth(req,env))return json({message:'Nie gemagtig nie.'},401);
      const r=await env.DB.prepare('SELECT id,name,country,position,active FROM players ORDER BY name').all();return json({players:r.results||[]});
    }
    return json({message:'Nie gevind nie.'},404);
  }catch(e){return json({message:'Bedienerfout.',error:String(e)},500)}
}

const ESPN_RUGBY_LEAGUES=[
  ['World Rugby Championship','164205'],['Six Nations','180659'],['Super Rugby Pacific','242041'],
  ['United Rugby Championship','289234'],['Champions Cup','270559'],['Top 14','170645'],
  ['The Rugby Championship','398'],['Currie Cup','270555']
];
async function ingestRugbyHistory(env){
  if(!env.DB)return;
  const now=new Date();
  const dates=[];
  for(let i=0;i<8;i++){const d=new Date(now);d.setUTCDate(d.getUTCDate()-i);dates.push(d.toISOString().slice(0,10).replaceAll('-',''));}
  for(const [leagueName,leagueId] of ESPN_RUGBY_LEAGUES){
    for(const date of dates){
      try{
        const r=await fetch(`https://site.api.espn.com/apis/site/v2/sports/rugby/${leagueId}/scoreboard?dates=${date}`,{cache:'no-store'});
        if(!r.ok)continue; const j=await r.json();
        for(const g of (j.events||[])){
          const c=g.competitions?.[0]||{}; const ts=c.competitors||[];
          const home=ts.find(t=>t.homeAway==='home')||ts[0]||{}; const away=ts.find(t=>t.homeAway==='away')||ts[1]||{};
          const venue=c.venue||{};
          const state=String(g.status?.type?.state||'').toLowerCase();
          if(!['post','final','complete'].some(x=>state.includes(x)) && !c.status?.type?.completed)continue;
          await env.DB.prepare(`INSERT INTO rugby_matches(event_id,league_id,league_name,played_at,status,home_team,away_team,home_score,away_score,venue,venue_city,attendance,neutral_site,raw_json,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,CURRENT_TIMESTAMP) ON CONFLICT(event_id) DO UPDATE SET home_score=excluded.home_score,away_score=excluded.away_score,status=excluded.status,attendance=excluded.attendance,raw_json=excluded.raw_json,updated_at=CURRENT_TIMESTAMP`)
            .bind(String(g.id||''),String(leagueId),leagueName,String(g.date||''),state,String(home.team?.displayName||home.team?.name||''),String(away.team?.displayName||away.team?.name||''),Number(home.score||0),Number(away.score||0),String(venue.fullName||venue.name||''),String(venue.address?.city||''),Number(c.attendance||0),c.neutralSite?1:0,JSON.stringify(g)).run();
        }
      }catch(e){}
    }
  }
}
export default {fetch:handleFetch, scheduled: async (_event,env)=>{await ingestRugbyHistory(env)}};
