/* FINAL FIX: remove legacy overlay and ensure the empty modal stays hidden. */
(function(){
  const kill=()=>{
    const modal=document.getElementById("modal");
    if(modal && modal.hidden) modal.style.display="none";
    document.querySelectorAll('.banner,.install-banner,#installBanner,#appBanner,[data-install-banner]').forEach(el=>el.remove());
    document.querySelectorAll('body > div, body > aside').forEach(el=>{
      if(el.id==='modal' || el.classList.contains('app-shell')) return;
      const st=getComputedStyle(el);
      const r=el.getBoundingClientRect();
      const txt=(el.textContent||'').trim();
      if(st.position==='fixed' && r.width>window.innerWidth*.7 && r.height>80 && (txt==='' || /×|✕|close|install|installeer/i.test(txt))) el.remove();
    });
  };
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',kill,{once:true}); else kill();
  window.addEventListener('load',kill,{once:true});
})();

const API_URL = (window.LEKKER_RUGBY_CONFIG && window.LEKKER_RUGBY_CONFIG.apiUrl) || "";

// Verified SuperSport snapshot used immediately when the Worker is not configured.
// The Worker endpoint returns the same structure and can be refreshed/deployed later.
const SUPERSPORT_VERIFIED={
  fixtures:[
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
  ],
  results:[
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
  ]
};

const PHOTO_OVERRIDES={
  "Handre Pollard":"https://commons.wikimedia.org/wiki/Special:Redirect/file/Handré_Pollard_June_2026.jpg?width=900",
  "Handré Pollard":"https://commons.wikimedia.org/wiki/Special:Redirect/file/Handré_Pollard_June_2026.jpg?width=900",
  "Eben Etzebeth":"https://commons.wikimedia.org/wiki/Special:Redirect/file/Eben_Etzebeth_2022.jpg?width=900"
};
const ENGLAND_FLAG="\u{1F3F4}\u{E0067}\u{E0062}\u{E0065}\u{E006E}\u{E0067}\u{E007F}";
const WALES_FLAG="\u{1F3F4}\u{E0067}\u{E0062}\u{E0077}\u{E006C}\u{E0073}\u{E007F}";
const SCOTLAND_FLAG="\u{1F3F4}\u{E0067}\u{E0062}\u{E0073}\u{E0063}\u{E0074}\u{E006F}\u{E007F}";
const FLAG_SPECIAL={};
["Lawrence Dallaglio","Jonny Wilkinson","Matt Dawson","Danny Care","Ben Youngs","Harry Randall","Richard Hill","Neil Back","Martin Johnson","Courtney Lawes","Maro Itoje","Joe Launchbury","Dan Cole","Jason Leonard","Phil Vickery","Dylan Hartley","Jamie George","Owen Farrell","Manu Tuilagi","Jeremy Guscott","Will Greenwood","Rory Underwood","Jason Robinson","Josh Lewsey","Mike Brown","Alex Goode","George Chuter","Graham Rowntree","Andrew Sheridan","Tom Palmer","Simon Shaw","Steve Borthwick","Danny Cipriani","Stuart Lancaster"].forEach(n=>FLAG_SPECIAL[n]=ENGLAND_FLAG);
["Alun Wyn Jones","Gareth Thomas","Gethin Jenkins","Sam Warburton","Taulupe Faletau","Justin Tipuric","Toby Faletau","Neil Jenkins","Stephen Jones","Dan Biggar","Gareth Anscombe","Mike Phillips","Dwayne Peel","Shane Williams","George North","Liam Williams","Leigh Halfpenny","Scott Quinnell","Jamie Roberts","Gavin Henson","Jonathan Davies","Graham Price","JPR Williams","Gareth Edwards","Barry John","Phil Bennett","Mervyn Davies","Dai Morris"].forEach(n=>FLAG_SPECIAL[n]=WALES_FLAG);
["Stuart Hogg","Finn Russell","Greig Laidlaw","Chris Paterson","Duhan van der Merwe","Sean Maitland","Richie Gray","Jonny Gray","John Barclay","Hamish Watson","David Denton","Ross Ford","Tom Smith","Euan Murray"].forEach(n=>FLAG_SPECIAL[n]=SCOTLAND_FLAG);
const FLAG_IMG={
  ENG:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Flag_of_England.svg',
  SCO:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Flag_of_Scotland.svg',
  WAL:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Flag_of_Wales.svg',
  ZA:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Flag_of_South_Africa.svg',
  NZ:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Flag_of_New_Zealand.svg',
  AU:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Flag_of_Australia.svg',
  IT:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Flag_of_Italy.svg',
  FR:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Flag_of_France.svg',
  IE:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Flag_of_Ireland.svg',
  AR:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Flag_of_Argentina.svg',
  FJ:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Flag_of_Fiji.svg',
  GE:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Flag_of_Georgia.svg',
  TO:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Flag_of_Tonga.svg',
  JP:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Flag_of_Japan.svg',
  WS:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Flag_of_Samoa.svg',
  CA:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Flag_of_Canada.svg',
  US:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Flag_of_the_United_States.svg',
  UY:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Flag_of_Uruguay.svg',
  NA:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Flag_of_Namibia.svg',
  PT:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Flag_of_Portugal.svg',
  ES:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Flag_of_Spain.svg',
  GA:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Flag_of_Gabon.svg',
  HK:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Flag_of_Hong_Kong.svg',
  KE:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Flag_of_Kenya.svg',
  ZW:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Flag_of_Zimbabwe.svg',
  BW:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Flag_of_Botswana.svg',
  ZM:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Flag_of_Zambia.svg',
  UG:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Flag_of_Uganda.svg',
  RU:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Flag_of_Russia.svg'
};
const FLAG_DATA=FLAG_IMG;
const FLAG_BY_VALUE={'🇿🇦':'ZA','🇳🇿':'NZ','🇦🇺':'AU','🇮🇹':'IT','🇫🇷':'FR','🇮🇪':'IE','🇦🇷':'AR','🇫🇯':'FJ','🇬🇪':'GE','🇷🇴':'RO','🇹🇴':'TO','🇯🇵':'JP','🇼🇸':'WS','🇨🇦':'CA','🇺🇸':'US','🇺🇾':'UY','🇳🇦':'NA','🇵🇹':'PT','🇪🇸':'ES','🇬🇦':'GA','🇭🇰':'HK','🇰🇪':'KE','🇿🇼':'ZW','🇧🇼':'BW','🇿🇲':'ZM','🇺🇬':'UG','🏴ENG':'ENG','🏴WAL':'WAL','🏴SCO':'SCO'};
function flagMarkupByCode(code,cls='inline-flag'){const src=FLAG_DATA[code]||FLAG_IMG[code];return src?`<img class="${cls}" src="${src}" alt="${code} vlag" loading="lazy" onerror="this.onerror=null;this.style.display='none'">`:''}
function playerFlag(name,fallback){const special=FLAG_SPECIAL[name];if(special===ENGLAND_FLAG)return flagMarkupByCode('ENG');if(special===WALES_FLAG)return flagMarkupByCode('WAL');if(special===SCOTLAND_FLAG)return flagMarkupByCode('SCO');const code=FLAG_BY_VALUE[fallback||'']||fallback||'';return code&&FLAG_IMG[code]?flagMarkupByCode(code):'<span class="country-flag-emoji">🌍</span>'}
function teamFlagMarkup(t){const code=FLAG_BY_VALUE[t.flag]||t.flag;if(FLAG_DATA[code]||FLAG_IMG[code])return flagMarkupByCode(code,'team-flag-img');return '<span class="team-flag-emoji">🌍</span>'}
const STORAGE="lekkerRugbyVotesV1";
let selections={};
let activeRank="all";
let selectionOrder={};
let adminToken=localStorage.getItem("lekkerAdminToken")||"";
let voteCounts={};
try{localStorage.removeItem("lekkerRugbyPhotoCacheV7");localStorage.removeItem("lekkerRugbyPhotoCacheV8");localStorage.removeItem("lekkerRugbyPhotoCacheV9");}catch(e){}
const PHOTO_CACHE_KEY="lekkerRugbyPhotoCacheV15";
// V15 deliberately discards every older player-photo cache. Earlier versions could
// contain generic stadium/newspaper images, and those must never be reused.
try{
  Object.keys(localStorage).filter(k=>/^lekkerRugbyPhotoCacheV\d+$/i.test(k)&&k!==PHOTO_CACHE_KEY).forEach(k=>localStorage.removeItem(k));
}catch(e){}
let photoCache=JSON.parse(localStorage.getItem(PHOTO_CACHE_KEY)||"{}");
let liveTimer=null;

const POSITIONS=[
["1","Losskopstut"],["2","Haker"],["3","Vaskopstut"],["4","Slot"],["5","Slot"],["6","Blindekantflank"],["7","Oopkantflank"],["8","Nommer 8"],["9","Skrumskakel"],["10","Losskakel"],["11","Linkervleuel"],["12","Binne-senter"],["13","Buite-senter"],["14","Regtervleuel"],["15","Heelagter"]
].map(([n,name])=>({n,name}));

const SPRINGBOK_RESULTS_2026=[['20 Jun','Tour Match','Springboks',80,'Barbarians',31,'Nelson Mandela Bay Stadium'],['4 Jul','Nations Championship','Springboks',45,'England',21,'Ellis Park Stadium'],['11 Jul','Nations Championship','Springboks',42,'Scotland',28,'Loftus Versfeld'],['18 Jul','Nations Championship','Springboks',43,'Wales',0,'Hollywoodbets Kings Park'],['8 Aug','International Rugby','Argentina',10,'Springboks',17,'Estadio José Amalfitani'],['22 Aug','International Rugby','Springboks',16,'New Zealand',33,'Ellis Park Stadium'],['29 Aug','International Rugby','Springboks',33,'New Zealand',26,'DHL Stadium'],['5 Sep','International Rugby','Springboks',29,'New Zealand',24,'FNB Stadium']];
const SPRINGBOK_LATEST_XV=[
 ['15','Cheslin Kolbe',53,170],['14','Kurt-Lee Arendse',34,130],['13','Jesse Kriel',93,120],['12','Damian de Allende',102,60],['11','Ethan Hooker',12,10],['10','Sacha Feinberg-Mngomezulu',23,184],['9','Cobus Reinach',56,100],['8','Jasper Wiese',48,20],['7','Pieter-Steph du Toit',101,70],['6','Siya Kolisi',106,75],['5','Ruan Nortje',23,5],['4','Eben Etzebeth',145,45],['3','Wilco Louw',34,10],['2','Malcolm Marx',92,140],['1','Ox Nche',51,0]
];
const SPRINGBOK_BENCH=[['16','Deon Fourie'],['17','Gerhard Steenekamp'],['18','Thomas du Toit'],['19','Lood de Jager'],['20','Andre Esterhuizen'],['21','Cameron Hanekom'],['22','Morne van den Berg'],['23','Manie Libbok']];
const SPRINGBOK_INJURIES=[['Cheslin Kolbe','Fraktuur: kakebeen','Uit vir Baltimore.'],['Handre Pollard','Hamstring','Het die tweede toets gemis; finale beskikbaarheid moet bevestig word.'],['Damian Willemse','Hamstring','Het die derde toets gemis; Rassie het bevestig hy reis VSA toe.'],['Grant Williams','Besering/rehab','Rassie het bevestig hy is fiks genoeg om VSA toe te reis.'],['Canan Moodie','Besering/rehab','Rassie het bevestig hy is fiks genoeg om VSA toe te reis.']];
const WORLD_TOP10_TEAMS=[
  {rank:1,name:'South Africa',display:'Springbokke',flag:'🇿🇦',rating:93.39},
  {rank:2,name:'New Zealand',display:'All Blacks',flag:'🇳🇿',rating:92.85},
  {rank:3,name:'Ireland',display:'Ireland',flag:'🇮🇪',rating:88.08},
  {rank:4,name:'France',display:'Frankryk',flag:'🇫🇷',rating:87.43},
  {rank:5,name:'England',display:'Engeland',flag:'ENG',rating:85.68},
  {rank:6,name:'Scotland',display:'Skotland',flag:'SCO',rating:84.78},
  {rank:7,name:'Australia',display:'Australië',flag:'🇦🇺',rating:83.71},
  {rank:8,name:'Argentina',display:'Argentinië',flag:'🇦🇷',rating:82.08},
  {rank:9,name:'Fiji',display:'Fiji',flag:'🇫🇯',rating:78.00},
  {rank:10,name:'Wales',display:'Wallis',flag:'WAL',rating:76.38}
];
const SPRINGBOK_2026_SUMMARY={played:8,wins:7,losses:1,draws:0,pointsFor:305,pointsAgainst:173,pointsDiff:132,avgFor:38.13,avgAgainst:21.63};
const SPRINGBOK_HEAD_TO_HEAD_NZ={played:113,wins:45,losses:64,draws:4,from1987:{played:76,wins:25,losses:49,draws:2},pointsFor:1928,pointsAgainst:2352};
const SPRINGBOK_CURRENT_AVAILABILITY=[
 ['Cheslin Kolbe','🚑','Fraktuur van die kakebeen','UIT – sal die Baltimore-toets mis.'],
 ['Damian Willemse','🟢','Hamstring','Beskikbaar/reis na VSA volgens Rassie se jongste opdatering.'],
 ['Grant Williams','🟢','Besering/rehab','Beskikbaar/reis na VSA volgens Rassie se jongste opdatering.'],
 ['Canan Moodie','🟢','Besering/rehab','Beskikbaar/reis na VSA volgens Rassie se jongste opdatering.'],
 ['Siya Kolisi','🟢','Fiks','Beskikbaar; het die derde toets begin.'],
 ['Handré Pollard','🟢','Beskikbaar','Geen huidige bevestigde besering in die jongste opdatering.'],
 ['Eben Etzebeth','🟢','Beskikbaar','Het die derde toets begin.'],
 ['Sacha Feinberg-Mngomezulu','🟢','Beskikbaar','Het die derde toets begin en 9 punte geskop.']
];
const NEWS_IMG_FALLBACK='data:image/svg+xml;charset=UTF-8,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 520"><rect width="900" height="520" fill="#07130d"/><circle cx="450" cy="260" r="170" fill="#0e3a22" stroke="#d7a51c" stroke-width="8"/><path d="M450 105l34 105h111l-90 65 34 105-89-65-89 65 34-105-90-65h111z" fill="#d7a51c"/><text x="450" y="455" fill="#fff" font-family="Arial" font-size="42" font-weight="700" text-anchor="middle">LEKKER RUGBY</text></svg>');
const NEWS_IMG_BOKS='https://media-cdn.cortextech.io/1WWmqT/1BSdBWIjCjnOJp/0544c345-cf03-4181-a9ba-dfa075d540a0.jpg';
const NEWS_IMG_KOLBE='https://images.supersport.com/media/kr5igkyb/cheslin-kolbe-2000g.jpg';
const NEWS_IMG_ALLBLACKS='https://www.timeslive.co.za/resizer/v2/6TWRAZLSPFCAHNAY4N5KFDZXCY.jpg?auth=33356371314a6f5bc8b47da9bbeddc15d47a68e56cf44f844e3ea9f560013154&height=533&smart=true&width=800';
const NEWS_IMG_WALLABIES='https://i.guim.co.uk/img/media/2ad8a5219a81d179d8932bf71e9c6ce9323eb9ed/320_0_4750_3800/master/4750.jpg?crop=none&dpr=1&s=none&width=1200';
const NEWS_IMG_JAPAN='https://en.rugby-japan.jp/wp-content/uploads/2026/09/0G8A6386-1024x683.jpg';
const NEWS_IMG_RANKINGS='data:image/svg+xml;charset=UTF-8,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675"><defs><linearGradient id="g" x1="0" x2="1"><stop stop-color="#07130d"/><stop offset="1" stop-color="#0e3a22"/></linearGradient></defs><rect width="1200" height="675" fill="url(#g)"/><circle cx="1030" cy="115" r="170" fill="#d7a51c" opacity=".12"/><text x="70" y="105" fill="#d7a51c" font-family="Arial" font-size="30" font-weight="700" letter-spacing="4">WORLD RUGBY</text><text x="70" y="175" fill="#fff" font-family="Arial" font-size="58" font-weight="900">WÊRELRANGLYS</text><text x="70" y="225" fill="#b7c8be" font-family="Arial" font-size="25">7 SEPTEMBER 2026</text><g font-family="Arial" font-size="34" font-weight="800"><text x="90" y="310" fill="#d7a51c">1</text><text x="150" y="310" fill="#fff">🇿🇦 SUID-AFRIKA</text><text x="850" y="310" fill="#fff">94.33</text><text x="90" y="385" fill="#d7a51c">2</text><text x="150" y="385" fill="#fff">🇳🇿 NIEU-SEELAND</text><text x="850" y="385" fill="#fff">91.90</text><text x="90" y="460" fill="#d7a51c">3</text><text x="150" y="460" fill="#fff">🇮🇪 IERLAND</text><text x="850" y="460" fill="#fff">88.08</text><text x="90" y="535" fill="#d7a51c">4</text><text x="150" y="535" fill="#fff">🇫🇷 FRANKRYK</text><text x="850" y="535" fill="#fff">87.43</text></g><text x="70" y="625" fill="#8ea398" font-family="Arial" font-size="20">SUID-AFRIKA BEHOU WÊRELD-NOMMER 1</text></svg>');
const LEKKER_NEWS=[['🔥','BOKKE 29–24 ALL BLACKS','Springboks lei die vier-toets reeks 2–1 ná ’n 29–24 oorwinning by FNB Stadium.','https://springboks.rugby/news-features/articles/2026/9/5/boks-take-series-lead-in-greatest-test',NEWS_IMG_BOKS],['🚑','KOLBE UIT VIR BALTIMORE','Cheslin Kolbe het sy kakebeen gebreek en sal nie die vierde toets teen Nieu-Seeland speel nie.','https://supersport.com/rugby/news/8d2bab1e-c7ec-49b5-a6af-e60e1e1e4c4e/kolbe-breaks-jaw-and-shoulder-injury-sidelines-savea',NEWS_IMG_KOLBE],['⚡','ALL BLACKS GETREF DEUR BESERINGS','Ardie Savea, Quinn Tupaea en Luke Jacobson is uit vir die vierde toets.','https://www.timeslive.co.za/sport/rugby/2026-09-06-all-blacks-suffer-another-injury-setback/',NEWS_IMG_ALLBLACKS],['🌏','AUSTRALIË KLINCH REEKS IN ARGENTINIË','Die Wallabies het die reeks in Argentinië gewen nadat die tweede toets 28–28 geëindig het.','https://www.theguardian.com/sport/2026/sep/06/argentina-australia-wallabies-rugby-union-second-test-match-report',NEWS_IMG_WALLABIES],['🇯🇵','JAPAN KLAP CANADA 57–12','Japan het Kanada in Niigata met 57–12 verslaan.','https://en.rugby-japan.jp/2026/09/06/brave-blossoms-defeat-canada-in-niigata/',NEWS_IMG_JAPAN],['🏆','WÊRELRANGLYS','Suid-Afrika is #1 ná die jongste internasionale toetsnaweek, voor Nieu-Seeland #2, Ierland #3 en Frankryk #4.','https://www.world.rugby/rankings?lang=en',NEWS_IMG_RANKINGS]];
// Groot beginlys van bekende, internasionaal gecapte mansspelers vanaf die moderne era.
// Dit is 'n redigeerbare saadlys; die Admin kan enige ontbrekende speler byvoeg.
const PLAYER_SEED=[
["Os du Randt","🇿🇦","1"],["Tendai Mtawarira","🇿🇦","1"],["Trevor Nyakane","🇿🇦","1"],["Steven Kitshoff","🇿🇦","1"],["Ox Nche","🇿🇦","1"],["Thomas du Toit","🇿🇦","1"],["Frans Malherbe","🇿🇦","3"],["Jannie du Plessis","🇿🇦","3"],["CJ van der Linde","🇿🇦","3"],["Bismarck du Plessis","🇿🇦","2"],["John Smit","🇿🇦","2"],["Malcolm Marx","🇿🇦","2"],["Schalk Brits","🇿🇦","2"],["Adriaan Strauss","🇿🇦","2"],["James Dalton","🇿🇦","2"],["Victor Matfield","🇿🇦","4"],["Bakkies Botha","🇿🇦","5"],["Eben Etzebeth","🇿🇦","4"],["Lood de Jager","🇿🇦","5"],["RG Snyman","🇿🇦","5"],["Francois Pienaar","🇿🇦","6"],["Pieter-Steph du Toit","🇿🇦","6"],["Juan Smith","🇿🇦","6"],["Schalk Burger","🇿🇦","7"],["Heinrich Brussow","🇿🇦","7"],["Siya Kolisi","🇿🇦","6"],["Duane Vermeulen","🇿🇦","8"],["Gary Botha","🇿🇦","8"],["Bob Skinstad","🇿🇦","8"],["Faf de Klerk","🇿🇦","9"],["Ruan Pienaar","🇿🇦","9"],["Fourie du Preez","🇿🇦","9"],["Cobus Reinach","🇿🇦","9"],["Jannie de Beer","🇿🇦","10"],["Naas Botha","🇿🇦","10"],["Henry Honiball","🇿🇦","10"],["Morne Steyn","🇿🇦","10"],["Handre Pollard","🇿🇦","10"],["Joel Stransky","🇿🇦","10"],["Percy Montgomery","🇿🇦","15"],["Francois Steyn","🇿🇦","15"],["Willie le Roux","🇿🇦","15"],["André Joubert","🇿🇦","15"],["Bryan Habana","🇿🇦","11"],["Cheslin Kolbe","🇿🇦","11"],["James Small","🇿🇦","13"],["Jaque Fourie","🇿🇦","13"],["Jean de Villiers","🇿🇦","12"],["Jesse Kriel","🇿🇦","12"],["Lukhanyo Am","🇿🇦","13"],["Damian de Allende","🇿🇦","12"],["Joost van der Westhuizen","🇿🇦","9"],
["Sean Fitzpatrick","🇳🇿","2"],["Keven Mealamu","🇳🇿","2"],["Dane Coles","🇳🇿","2"],["Tony Woodcock","🇳🇿","1"],["Owen Franks","🇳🇿","3"],["Carl Hayman","🇳🇿","3"],["Nepo Laulala","🇳🇿","3"],["Richie McCaw","🇳🇿","7"],["Michael Jones","🇳🇿","7"],["Jerry Collins","🇳🇿","6"],["Jerome Kaino","🇳🇿","6"],["Kieran Read","🇳🇿","8"],["Zinzan Brooke","🇳🇿","8"],["Lawrence Dallaglio","🏴","8"],["Sam Whitelock","🇳🇿","4"],["Brodie Retallick","🇳🇿","5"],["Ali Williams","🇳🇿","4"],["Scott Barrett","🇳🇿","5"],["Ma'a Nonu","🇳🇿","12"],["Conrad Smith","🇳🇿","13"],["Tana Umaga","🇳🇿","13"],["Dan Carter","🇳🇿","10"],["Richie Mo'unga","🇳🇿","10"],["Stephen Donald","🇳🇿","10"],["Aaron Smith","🇳🇿","9"],["Piri Weepu","🇳🇿","9"],["Justin Marshall","🇳🇿","9"],["George Gregan","🇦🇺","9"],["Beauden Barrett","🇳🇿","10"],["Julian Savea","🇳🇿","11"],["Doug Howlett","🇳🇿","11"],["Christian Cullen","🇳🇿","15"],["Ben Smith","🇳🇿","15"],["Israel Dagg","🇳🇿","15"],["Will Jordan","🇳🇿","15"],["Richie McCaw","🇳🇿","7"],
["David Pocock","🇦🇺","7"],["Michael Hooper","🇦🇺","7"],["George Smith","🇦🇺","7"],["Stephen Moore","🇦🇺","2"],["Phil Kearns","🇦🇺","2"],["Tatafu Polota-Nau","🇦🇺","2"],["Sekope Kepu","🇦🇺","3"],["Matt Dunning","🇦🇺","1"],["James Slipper","🇦🇺","1"],["Nathan Sharpe","🇦🇺","4"],["John Eales","🇦🇺","4"],["Brodie Retallick","🇳🇿","5"],["Will Skelton","🇦🇺","5"],["Tim Horan","🇦🇺","12"],["Matt Giteau","🇦🇺","12"],["Stirling Mortlock","🇦🇺","13"],["Drew Mitchell","🇦🇺","11"],["Lote Tuqiri","🇦🇺","11"],["Israel Folau","🇦🇺","15"],["Chris Latham","🇦🇺","15"],["Stephen Larkham","🇦🇺","10"],["Michael Lynagh","🇦🇺","10"],["Quade Cooper","🇦🇺","10"],["Bernard Foley","🇦🇺","10"],["Nicolas Sanchez","🇦🇷","10"],["George Smith","🇦🇺","7"],
["Sergio Parisse","🇮🇹","8"],["Martin Castrogiovanni","🇮🇹","3"],["Andrea Lo Cicero","🇮🇹","1"],["Mirco Bergamasco","🇮🇹","11"],["Mauro Bergamasco","🇮🇹","6"],["Alessandro Zanni","🇮🇹","6"],["Marco Bortolami","🇮🇹","4"],["Tommaso Allan","🇮🇹","10"],["Diego Dominguez","🇮🇹","10"],["Mauro Bergamasco","🇮🇹","7"],
["Antoine Dupont","🇫🇷","9"],["Jean-Baptiste Elissalde","🇫🇷","9"],["Fabien Galthie","🇫🇷","9"],["Morgan Parra","🇫🇷","9"],["Dimitri Yachvili","🇫🇷","9"],["Thierry Dusautoir","🇫🇷","6"],["Serge Betsen","🇫🇷","7"],["Imanol Harinordoquy","🇫🇷","8"],["Louis Picamoles","🇫🇷","8"],["Olivier Magne","🇫🇷","6"],["Raphael Ibanez","🇫🇷","2"],["Dimitri Szarzewski","🇫🇷","2"],["Julien Marchand","🇫🇷","2"],["William Servat","🇫🇷","2"],["Olivier Roumat","🇫🇷","4"],["Fabien Pelous","🇫🇷","4"],["Yannick Nyanga","🇫🇷","7"],["Francois Cros","🇫🇷","7"],["Romain Ntamack","🇫🇷","10"],["Frédéric Michalak","🇫🇷","10"],["Jonny Wilkinson","🏴","10"],["Damian Penaud","🇫🇷","14"],["Vincent Clerc","🇫🇷","11"],["Christophe Dominici","🇫🇷","11"],["Serge Blanco","🇫🇷","15"],["Thomas Ramos","🇫🇷","15"],
["Jonny Wilkinson","🏴","10"],["Matt Dawson","🏴","9"],["Danny Care","🏴","9"],["Ben Youngs","🏴","9"],["Harry Randall","🏴","9"],["Lawrence Dallaglio","🏴","8"],["Richard Hill","🏴","7"],["Neil Back","🏴","7"],["Martin Johnson","🏴","4"],["Courtney Lawes","🏴","6"],["Maro Itoje","🏴","4"],["Joe Launchbury","🏴","4"],["Dan Cole","🏴","3"],["Jason Leonard","🏴","1"],["Phil Vickery","🏴","3"],["Dylan Hartley","🏴","2"],["Jamie George","🏴","2"],["Brian O'Driscoll","🇮🇪","13"],["Owen Farrell","🏴","12"],["Manu Tuilagi","🏴","13"],["Jeremy Guscott","🏴","13"],["Will Greenwood","🏴","13"],["Rory Underwood","🏴","11"],["Jason Robinson","🏴","11"],["Josh Lewsey","🏴","14"],["Mike Brown","🏴","15"],["Alex Goode","🏴","15"],
["Brian O'Driscoll","🇮🇪","13"],["Keith Wood","🇮🇪","2"],["Ronan O'Gara","🇮🇪","10"],["Johnny Sexton","🇮🇪","10"],["Conor Murray","🇮🇪","9"],["Jamison Gibson-Park","🇮🇪","9"],["Peter O'Mahony","🇮🇪","6"],["Josh van der Flier","🇮🇪","7"],["Sean O'Brien","🇮🇪","7"],["Sergio Parisse","🇮🇹","8"],["Paul O'Connell","🇮🇪","4"],["Tadhg Beirne","🇮🇪","5"],["Tadhg Furlong","🇮🇪","3"],["Andrew Porter","🇮🇪","1"],["Dan Sheehan","🇮🇪","2"],["Rob Kearney","🇮🇪","15"],["Tommy Bowe","🇮🇪","14"],["Simon Zebo","🇮🇪","15"],["Keith Earls","🇮🇪","11"],["Shane Horgan","🇮🇪","14"],
["Alun Wyn Jones","🏴","4"],["Gareth Thomas","🏴","1"],["Gethin Jenkins","🏴","1"],["Sam Warburton","🏴","7"],["Taulupe Faletau","🏴","8"],["Justin Tipuric","🏴","7"],["Toby Faletau","🏴","8"],["Rory Best","🇮🇪","2"],["Neil Jenkins","🏴","10"],["Stephen Jones","🏴","10"],["Dan Biggar","🏴","10"],["Gareth Anscombe","🏴","10"],["Mike Phillips","🏴","9"],["Dwayne Peel","🏴","9"],["Shane Williams","🏴","11"],["George North","🏴","11"],["Liam Williams","🏴","15"],["Leigh Halfpenny","🏴","15"],["Scott Quinnell","🏴","8"],["Jamie Roberts","🏴","12"],["Gavin Henson","🏴","12"],["Jonathan Davies","🏴","13"],
["Samu Kerevi","🇦🇺","12"],["Robbie Deans","🇳🇿","13"],["Stuart Hogg","🏴","15"],["Finn Russell","🏴","10"],["Greig Laidlaw","🏴","9"],["Chris Paterson","🏴","15"],["Duhan van der Merwe","🏴","11"],["Sean Maitland","🏴","11"],["Richie Gray","🏴","4"],["Jonny Gray","🏴","5"],["John Barclay","🏴","7"],["Hamish Watson","🏴","7"],["David Denton","🏴","8"],["Ross Ford","🏴","2"],["Tom Smith","🏴","1"],["Euan Murray","🏴","3"],
["Juan Martín Hernández","🇦🇷","10"],["Agustin Pichot","🇦🇷","9"],["Felipe Contepomi","🇦🇷","10"],["Santiago Phelan","🇦🇷","7"],["Pablo Matera","🇦🇷","6"],["Juan Martín Fernández Lobbe","🇦🇷","8"],["Facundo Isa","🇦🇷","8"],["Rodrigo Roncero","🇦🇷","1"],["Mario Ledesma","🇦🇷","2"],["Omar Hasan","🇦🇷","3"],["Patricio Albacete","🇦🇷","4"],["Manuel Contepomi","🇦🇷","13"],["Hernán Senillosa","🇦🇷","12"],["Horacio Agulla","🇦🇷","14"],["Juan Imhoff","🇦🇷","11"],["Emiliano Boffelli","🇦🇷","15"],
["George Chuter","🏴","2"],["Jason Leonard","🏴","1"],["Graham Rowntree","🏴","1"],["Andrew Sheridan","🏴","1"],["Tom Palmer","🏴","4"],["Simon Shaw","🏴","5"],["Steve Borthwick","🏴","4"],["Danny Cipriani","🏴","10"],["Stuart Lancaster","🏴","7"],
["Graham Price","🏴","3"],["JPR Williams","🏴","15"],["Gareth Edwards","🏴","9"],["Barry John","🏴","10"],["Phil Bennett","🏴","10"],["Mervyn Davies","🏴","8"],["Dai Morris","🏴","9"],["John Eales","🇦🇺","4"],["David Campese","🇦🇺","11"],["Tim Horan","🇦🇺","12"],["Nick Farr-Jones","🇦🇺","9"],
["Sione Vailanu","🇹🇴","8"],["Viliame Mata","🇫🇯","8"],["Nemani Nadolo","🇫🇯","11"],["Waisale Serevi","🇫🇯","10"],["Rupeni Caucaunibuca","🇫🇯","11"],["Semi Radradra","🇫🇯","13"],["Waisea Nayacalevu","🇫🇯","12"],["Samuela Vunisa","🇫🇯","6"],["Campese Ma'afu","🇫🇯","1"],["Osea Kolinisau","🇫🇯","7"],["Bryan Habana","🇿🇦","14"],
["Mihai Macovei","🇷🇴","7"],["Florin Vlaicu","🇷🇴","10"],["Davit Kacharava","🇬🇪","13"],["Mamuka Gorgodze","🇬🇪","6"],["Merab Sharikadze","🇬🇪","13"],["Mikheil Nariashvili","🇬🇪","1"],["Beka Gigashvili","🇬🇪","3"],["Guram Gogichashvili","🇬🇪","1"],["Tedo Abzhandadze","🇬🇪","10"],["Alexander Todua","🇬🇪","11"],["Soso Matiashvili","🇬🇪","15"],
["Morne du Plessis","🇿🇦","8"],["Naas Botha","🇿🇦","10"],["Danie Gerber","🇿🇦","13"],["Carel du Plessis","🇿🇦","11"],["Ruben Kruger","🇿🇦","7"],["Andre Snyman","🇿🇦","6"],["Frans Steyn","🇿🇦","12"],["Victor Matfield","🇿🇦","5"],["John Smit","🇿🇦","2"],["Percy Montgomery","🇿🇦","15"],["Shane Williams","🏴","14"],["George North","🏴","14"],["Tommy Bowe","🇮🇪","14"],["Sitiveni Sivivatu","🇫🇯","14"]
].map(x=>({name:x[0],country:x[1],pos:x[2]}));

const CURRENT_CAPPED_ADDITIONS=[
// South Africa – current capped players missing from the older historical snapshot
['Gerhard Steenekamp','🇿🇦','1'],['Zachary Porthen','🇿🇦','3'],['Boan Venter','🇿🇦','1'],['Wilco Louw','🇿🇦','3'],['Ruan Nortje','🇿🇦','5'],['Andre Esterhuizen','🇿🇦','12'],['Cameron Hanekom','🇿🇦','8'],['Morne van den Berg','🇿🇦','9'],['Manie Libbok','🇿🇦','10'],['Kurt-Lee Arendse','🇿🇦','14'],['Ethan Hooker','🇿🇦','11'],['Jasper Wiese','🇿🇦','8'],['Marco van Staden','🇿🇦','6'],['Ben-Jason Dixon','🇿🇦','7'],['Franco Mostert','🇿🇦','4'],['Jean Kleyn','🇿🇦','5'],['Johan Grobbelaar','🇿🇦','2'],
// New Zealand – capped 2026 touring group
['Asafo Aumua','🇳🇿','2'],['Codie Taylor','🇳🇿','2'],['Samisoni Taukei’aho','🇳🇿','2'],['George Bell','🇳🇿','2'],['Ethan de Groot','🇳🇿','1'],['George Bower','🇳🇿','1'],['Xavier Numia','🇳🇿','1'],['Ollie Norris','🇳🇿','3'],['Tyrel Lomax','🇳🇿','3'],['Fletcher Newell','🇳🇿','3'],['Pasilio Tosi','🇳🇿','3'],['Tupou Vaa’i','🇳🇿','5'],['Patrick Tuipulotu','🇳🇿','4'],['Josh Lord','🇳🇿','4'],['Sam Darry','🇳🇿','4'],['Fabian Holland','🇳🇿','5'],['Peter Lakai','🇳🇿','6'],['Simon Parker','🇳🇿','8'],['Ethan Blackadder','🇳🇿','6'],['Luke Jacobson','🇳🇿','7'],['Anton Segner','🇳🇿','7'],['Ardie Savea','🇳🇿','8'],['Wallace Sititi','🇳🇿','8'],['Cameron Roigard','🇳🇿','9'],['Cortez Ratima','🇳🇿','9'],['Kyle Preston','🇳🇿','9'],['Ruben Love','🇳🇿','10'],['Beauden Barrett','🇳🇿','10'],['Damian McKenzie','🇳🇿','10'],['Jordie Barrett','🇳🇿','12'],['Quinn Tupaea','🇳🇿','13'],['Billy Proctor','🇳🇿','12'],['Anton Lienert-Brown','🇳🇿','13'],['Timoci Tavatavanawai','🇳🇿','14'],['Caleb Clarke','🇳🇿','11'],['Fehi Fineanganofo','🇳🇿','14'],['Leroy Carter','🇳🇿','14'],['Josh Moorby','🇳🇿','14'],['Will Jordan','🇳🇿','14'],['Rieko Ioane','🇳🇿','13'],['Emoni Narawa','🇳🇿','11'],
// Ireland – current capped squad additions
['Finlay Bealham','🇮🇪','3'],['Tadhg Beirne','🇮🇪','5'],['Jack Boyle','🇮🇪','1'],['Thomas Clarkson','🇮🇪','3'],['Jack Conan','🇮🇪','8'],['Caelan Doris','🇮🇪','8'],['Tadhg Furlong','🇮🇪','3'],['Rónan Kelleher','🇮🇪','2'],['Jamison Gibson-Park','🇮🇪','9'],['Jack Crowley','🇮🇪','10'],['Josh van der Flier','🇮🇪','7'],['Garry Ringrose','🇮🇪','13'],['James Ryan','🇮🇪','4'],['Dan Sheehan','🇮🇪','2'],['James Lowe','🇮🇪','11'],['Stuart McCloskey','🇮🇪','12'],['Jamie Osborne','🇮🇪','13'],['Sam Prendergast','🇮🇪','10'],['Cian Prendergast','🇮🇪','8'],['Jacob Stockdale','🇮🇪','11'],['Tommy O’Brien','🇮🇪','14'],['Nathan Doak','🇮🇪','9'],['Tom Stewart','🇮🇪','2'],['Ciaran Frawley','🇮🇪','10'],
// France – current capped squad additions
['Hugo Auradou','🇫🇷','4'],['Demba Bamba','🇫🇷','3'],['Pierre Bochaton','🇫🇷','5'],['Sipili Falatea','🇫🇷','3'],['Marko Gazzotti','🇫🇷','8'],['Mickaël Guillard','🇫🇷','6'],['Oscar Jegou','🇫🇷','6'],['Maxime Lamothe','🇫🇷','2'],['Temo Matiu','🇫🇷','6'],['Peato Mauvaka','🇫🇷','2'],['Emmanuel Meafou','🇫🇷','4'],['Régis Montagne','🇫🇷','3'],['Lenni Nouchi','🇫🇷','7'],['Jefferson Poirot','🇫🇷','1'],['Alexandre Roumat','🇫🇷','4'],['Killian Tixeront','🇫🇷','7'],['Florian Verhaeghe','🇫🇷','4'],['Réda Wardi','🇫🇷','1'],['Théo Attissogbe','🇫🇷','11'],['Fabien Brau-Boirie','🇫🇷','13'],['Nicolas Depoortere','🇫🇷','13'],['Émilien Gailleton','🇫🇷','13'],['Kalvin Gourgues','🇫🇷','12'],['Antoine Hastoy','🇫🇷','10'],['Matthieu Jalibert','🇫🇷','10'],['Nolann Le Garrec','🇫🇷','9'],['Maxime Lucu','🇫🇷','9'],['Yoram Moefana','🇫🇷','12'],['Romain Ntamack','🇫🇷','10'],['Damian Penaud','🇫🇷','14'],['Max Spring','🇫🇷','15'],
// Wales – current capped squad additions
['Adam Beard','🏴WAL','4'],['James Botham','🏴WAL','7'],['Rhys Carre','🏴WAL','1'],['Ben Carter','🏴WAL','5'],['Ryan Elias','🏴WAL','2'],['Dewi Lake','🏴WAL','2'],['Dillon Lewis','🏴WAL','3'],['Evan Lloyd','🏴WAL','2'],['Alex Mann','🏴WAL','6'],['Jac Morgan','🏴WAL','7'],['Taine Plumtree','🏴WAL','8'],['Tommy Reffell','🏴WAL','7'],['Nicky Smith','🏴WAL','1'],['Gareth Thomas','🏴WAL','1'],['Aaron Wainwright','🏴WAL','8'],['Sam Wainwright','🏴WAL','3'],['Teddy Williams','🏴WAL','2'],['Josh Adams','🏴WAL','11'],['Sam Costelow','🏴WAL','10'],['Dan Edwards','🏴WAL','10'],['Mason Grady','🏴WAL','13'],['Kieran Hardy','🏴WAL','9'],['Joe Hawkins','🏴WAL','12'],['Eddie James','🏴WAL','13'],['Max Llewellyn','🏴WAL','13'],['Ellis Mee','🏴WAL','11'],['Reuben Morgan-Williams','🏴WAL','9'],['Blair Murray','🏴WAL','11'],['Louis Rees-Zammit','🏴WAL','14'],['Ben Thomas','🏴WAL','12'],['Tomos Williams','🏴WAL','9'],
// Scotland – current capped squad additions
['Ewan Ashman','🏴SCO','2'],['Josh Bayliss','🏴SCO','6'],['Magnus Bradbury','🏴SCO','8'],['Gregor Brown','🏴SCO','5'],['Dave Cherry','🏴SCO','2'],['Alex Craig','🏴SCO','4'],['Scott Cummings','🏴SCO','4'],['Rory Darge','🏴SCO','7'],['Jack Dempsey','🏴SCO','8'],['Freddy Douglas','🏴SCO','9'],['Matt Fagerson','🏴SCO','8'],['Zander Fagerson','🏴SCO','3'],['Grant Gilchrist','🏴SCO','4'],['Nathan McBeth','🏴SCO','1'],['Liam McConnell','🏴SCO','6'],
// Australia current capped additions
['James Slipper','🇦🇺','1'],['Angus Bell','🇦🇺','1'],['Zane Nonggorr','🇦🇺','3'],['Taniela Tupou','🇦🇺','3'],['Josh Nasser','🇦🇺','2'],['Brandon Paenga-Amosa','🇦🇺','2'],['Harry Wilson','🇦🇺','8'],['Rob Valetini','🇦🇺','6'],['Tom Hooper','🇦🇺','6'],['Fraser McReight','🇦🇺','7'],['Ben Donaldson','🇦🇺','10'],['Filipo Daugunu','🇦🇺','11'],['Len Ikitau','🇦🇺','13'],['Joseph-Aukuso Suaalii','🇦🇺','13'],['Tom Wright','🇦🇺','14'],['Lukhan Salakaia-Loto','🇦🇺','5'],['Carter Gordon','🇦🇺','10'],
].map(x=>({name:x[0],country:x[1],pos:x[2]}));

function uniquePlayers(list){const m=new Map();list.forEach(p=>{const key=p.name+'|'+p.country+'|'+p.pos;if(!m.has(key))m.set(key,p)});return [...m.values()]}
let players=uniquePlayers([...PLAYER_SEED,...CURRENT_CAPPED_ADDITIONS]);
let directoryPlayers=[...players];
let directoryHistoryLoaded=false;
const PLAYER_DIRECTORY_ALLOWED=new Set(['🇿🇦','🇳🇿','🇮🇪','🇫🇷','🇦🇺','🇦🇷','🇫🇯','🇼🇸','🏴ENG','🏴WAL','🏴SCO','🏴']);
const historicalPlayerStats={};
function allowedPlayerCountry(p){
  const key=playerCountryKey(p);
  if(PLAYER_DIRECTORY_ALLOWED.has(key))return true;
  const c=String(p.country||'').toLowerCase();
  return /south africa|new zealand|ireland|france|australia|argentina|fiji|samoa|england|wales|wallis|scotland|skotland/.test(c);
}

const $=s=>document.querySelector(s);const $$=s=>[...document.querySelectorAll(s)];
const esc=v=>String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
function localVotes(){try{return JSON.parse(localStorage.getItem(STORAGE))||[]}catch{return[]}}
function saveLocal(v){localStorage.setItem(STORAGE,JSON.stringify(v))}
function screen(id){$$('.screen').forEach(x=>x.classList.toggle('active',x.id===id));$$('.bottom-nav button').forEach(x=>x.classList.toggle('active',x.dataset.screen===id));window.scrollTo({top:0,behavior:'smooth'});if(id==='rankings')renderRankings();if(id==='players')renderPlayers();if(id==='admin')renderAdmin();if(id==='stats'){startLiveStats()}if(id==='teamstats')renderTeamStats();if(id==='news')renderNews();if(id==='predictor')renderPredictor();}
const MULTI_POSITION_MAP={
  'Damian Willemse':['10','12','13','15'], 'Jesse Kriel':['12','13','14','15'], 'Cheslin Kolbe':['11','14','15'],
  'Sacha Feinberg-Mngomezulu':['10','12'], 'Pieter-Steph du Toit':['4','5','6','7'], 'Siya Kolisi':['6','7','8'],
  'Jasper Wiese':['6','8'], 'Ox Nche':['1','3'], 'Francois Steyn':['12','13','15'], 'Willie le Roux':['11','14','15'],
  'Jean de Villiers':['12','13','15'], 'Damian de Allende':['12','13'], 'Lukhanyo Am':['12','13'], 'Andre Esterhuizen':['12','13'],
  'Handre Pollard':['10','12'], 'Morne Steyn':['10','15'], 'Faf de Klerk':['9','10'], 'Ruan Pienaar':['9','10'],
  'Beauden Barrett':['10','15'], 'Damian McKenzie':['10','15'], 'Jordie Barrett':['12','13','15'], 'Rieko Ioane':['11','12','13'],
  'Will Jordan':['11','14','15'], 'Richie Mo’unga':['10','12'], "Richie Mo'unga":['10','12'], 'Antoine Dupont':['9','10'],
  'Romain Ntamack':['10','12'], 'Thomas Ramos':['10','15'], 'Finn Russell':['10','12'], 'Stuart Hogg':['10','15'],
  'Dan Biggar':['10','12'], 'Gareth Anscombe':['10','15'], 'Liam Williams':['11','14','15'], 'Leigh Halfpenny':['11','14','15'],
  'Taulupe Faletau':['6','8'], 'Tadhg Beirne':['4','5','6','7'], 'Peter O’Mahony':['6','7','8'], 'Peter O\'Mahony':['6','7','8'],
  'Jack Conan':['6','8'], 'Caelan Doris':['6','8'], 'Jack Crowley':['10','12'], 'Ciaran Frawley':['10','12','15'],
  'James Lowe':['11','14'], 'Bundee Aki':['12','13'], 'Rob Kearney':['11','14','15'], 'Tommy Bowe':['11','14'],
  'Samu Kerevi':['12','13'], 'Israel Folau':['11','14','15'], 'Matt Giteau':['9','10','12','13'], 'Drew Mitchell':['11','14','15'],
  'Juan Martín Hernández':['10','15'], 'Felipe Contepomi':['10','12','13'], 'Horacio Agulla':['11','14'], 'Emiliano Boffelli':['11','14','15'],
  'Nemani Nadolo':['11','14'], 'Semi Radradra':['11','13','14'], 'Waisea Nayacalevu':['12','13'], 'Viliame Mata':['6','8'],
  'Waisale Serevi':['9','10','11','12','13'], 'Sean Fitzpatrick':['2','8'], 'Kieran Read':['6','8'], 'Richie McCaw':['6','7'],
  'Michael Hooper':['6','7'], 'David Pocock':['6','7','8'], 'George Smith':['6','7','8']
};
function playerPositions(p){const arr=[p.pos,...(MULTI_POSITION_MAP[p.name]||[])].filter(Boolean);return [...new Set(arr)];}
function getCandidates(pos){
  const list=Array.isArray(directoryPlayers)&&directoryPlayers.length?directoryPlayers:players;
  return list.filter(p=>allowedPlayerCountry(p)&&playerPositions(p).includes(pos.n)).sort((a,b)=>a.name.localeCompare(b.name));
}
function selectedFor(pos){ return Array.isArray(selectionOrder[pos]) ? selectionOrder[pos] : []; }
function toggleSelection(pos,name,checked){
  const arr=selectedFor(pos).slice();
  const i=arr.indexOf(name);
  if(checked && i<0){ if(arr.length>=10) return false; arr.push(name); }
  if(!checked && i>=0) arr.splice(i,1);
  selectionOrder[pos]=arr;
  selections[pos]=arr.slice();
  return true;
}
function rankPoints(arr){ const out={}; arr.forEach((name,i)=>out[name]=10-i); return out; }
function initials(name){return name.split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0]).join('').toUpperCase()||'🏉'}
function photoUrl(name){return photoCache[name]||''}
function photoImg(name,cls='vote-photo',country=''){
  const src=photoUrl(name),fallback=avatarFallback(name),countryAttr=country?` data-player-country="${esc(country)}"`:'';
  if(src)return `<span class="photo-frame ${cls}-frame has-photo"><img class="${cls}" loading="lazy" data-player-name="${esc(name)}"${countryAttr} src="${esc(src)}" alt="${esc(name)}"><span class="photo-fallback" aria-hidden="true">${esc(initials(name))}</span></span>`;
  return `<span class="photo-frame ${cls}-frame"><img class="${cls} photo-loading" loading="lazy" data-player-photo="${esc(name)}"${countryAttr} src="data:image/gif;base64,R0lGODlhAQABAAAAACw=" alt="${esc(name)}"><span class="photo-fallback" aria-hidden="true">${esc(initials(name))}</span></span>`;
}
function avatarFallback(name){return `<span class="photo-fallback" aria-hidden="true">${esc(initials(name))}</span>`}
function countryNameForPhoto(country){
  const map={'🇿🇦':'South Africa','🇳🇿':'New Zealand','🇦🇺':'Australia','🏴ENG':'England','🏴WAL':'Wales','🏴SCO':'Scotland','🇮🇪':'Ireland','🇫🇷':'France','🇮🇹':'Italy','🇦🇷':'Argentina','🇫🇯':'Fiji','🇯🇵':'Japan','🇹🇴':'Tonga','🇼🇸':'Samoa','🇨🇦':'Canada','🇺🇸':'United States','🇺🇾':'Uruguay','🇬🇪':'Georgia','🇷🇴':'Romania','🇳🇦':'Namibia','🇵🇹':'Portugal','🇪🇸':'Spain','🇬🇦':'Gabon','🇭🇰':'Hong Kong','🇰🇪':'Kenya','🇿🇼':'Zimbabwe','🇧🇼':'Botswana','🇿🇲':'Zambia','🇺🇬':'Uganda'};
  return map[String(country||'')]||String(country||'');
}
function playerCountryForPhoto(name,country=''){
  if(country)return countryNameForPhoto(country);
  const all=[...(Array.isArray(directoryPlayers)?directoryPlayers:[]),...(Array.isArray(players)?players:[])];
  const p=all.find(x=>x.name===name);return countryNameForPhoto(p?.country||'');
}
async function wikidataPortrait(name,country=''){
  try{
    const cn=playerCountryForPhoto(name,country),q=encodeURIComponent(`${name.trim()} rugby union ${cn}`.trim());
    const sr=await fetch('https://www.wikidata.org/w/api.php?action=wbsearchentities&search='+q+'&language=en&format=json&origin=*&limit=8',{cache:'no-store'});if(!sr.ok)return '';
    const sd=await sr.json();
    for(const hit of (sd.search||[]).filter(x=>/rugby/i.test(String(x.description||'')))){
      const id=hit.id,er=await fetch('https://www.wikidata.org/w/api.php?action=wbgetentities&ids='+encodeURIComponent(id)+'&props=claims|descriptions&languages=en&format=json&origin=*',{cache:'no-store'});if(!er.ok)continue;
      const ed=await er.json(),ent=ed.entities?.[id],desc=String(ent?.descriptions?.en?.value||'');if(!ent||!/rugby/i.test(desc))continue;
      const p18=ent.claims?.P18?.[0]?.mainsnak?.datavalue?.value;if(p18)return 'https://commons.wikimedia.org/wiki/Special:Redirect/file/'+encodeURIComponent(String(p18))+'?width=900';
    }
  }catch(e){}
  return '';
}
async function commonsPortrait(name,country=''){
  const score=x=>{let s=0,r=x.width/x.height,t=x.title.toLowerCase(),n=name.toLowerCase(),cn=countryNameForPhoto(country).toLowerCase();if(t.includes(n))s+=220;if(cn&&t.includes(cn))s+=25;if(x.height>=x.width*1.05)s+=90;if(r>=.50&&r<=.95)s+=35;if(/portrait|headshot|profile|player|rugby/.test(t))s+=40;if(/match|game|action|try|tackle|stadium|team|squad|group|cricket/.test(t))s-=70;s-=Math.abs(r-.72)*20;return s};
  try{
    const cn=countryNameForPhoto(country),q=encodeURIComponent(`"${name.trim()}" rugby union${cn?' '+cn:''}`),api='https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch='+q+'&gsrnamespace=6&gsrlimit=80&prop=imageinfo|categories&iiprop=url|size&iiurlwidth=900&cllimit=50&format=json&origin=*';
    const r=await fetch(api,{cache:'no-store'});if(r.ok){const d=await r.json();const files=Object.values(d?.query?.pages||{}).map(p=>{const i=p.imageinfo?.[0]||{};const cats=(p.categories||[]).map(c=>String(c.title||'')).join(' ');return {title:String(p.title||''),cats,url:i.thumburl||i.url||'',width:Number(i.thumbwidth||i.width||0),height:Number(i.thumbheight||i.height||0)}}).filter(x=>x.url&&x.width&&x.height&&/rugby|union player/i.test(x.title+' '+x.cats));files.sort((a,b)=>score(b)-score(a));if(files[0]&&score(files[0])>=150)return files[0].url;}
  }catch(e){}
  return '';
}
async function wikipediaPhoto(name,country=''){
  try{
    const cn=countryNameForPhoto(country);
    const clean=name.trim();
    const q=encodeURIComponent(`intitle:"${clean}" "rugby union"${cn?' "'+cn+'"':''}`);
    const r=await fetch('https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch='+q+'&srnamespace=0&srlimit=10&format=json&origin=*',{cache:'no-store'});
    if(!r.ok)return '';
    const d=await r.json();
    const hits=d?.query?.search||[];
    // Only accept a page whose title is the player's name or an explicit rugby-union disambiguation.
    const norm=v=>String(v||'').toLowerCase().replace(/\s+/g,' ').trim();
    const target=norm(clean);
    const ordered=[...hits].sort((a,b)=>{
      const ta=norm(a.title),tb=norm(b.title);
      const sa=(ta===target?100:0)+(ta.includes('rugby union')?30:0);
      const sb=(tb===target?100:0)+(tb.includes('rugby union')?30:0);
      return sb-sa;
    });
    for(const h of ordered){
      const title=String(h.title||'');
      const nt=norm(title);
      if(nt!==target && !nt.startsWith(target+' (rugby union)'))continue;
      const rr=await fetch('https://en.wikipedia.org/w/api.php?action=query&titles='+encodeURIComponent(title)+'&prop=pageimages|extracts&exintro=1&explaintext=1&piprop=original|thumbnail&pithumbsize=1000&format=json&origin=*',{cache:'no-store'});
      if(!rr.ok)continue;
      const dd=await rr.json(),pg=Object.values(dd?.query?.pages||{})[0],text=String(pg?.extract||'').toLowerCase();
      if(!pg||pg.missing||!/rugby union|rugby player|rugby footballer/.test(text))continue;
      if(cn && !text.includes(cn.toLowerCase()) && !['scotland','wales','england'].includes(cn.toLowerCase()))continue;
      const img=pg?.original?.source||pg?.thumbnail?.source||'';
      if(img)return img;
    }
  }catch(e){}
  return '';
}
async function resolvePlayerPhoto(name,country=''){
  if(PHOTO_OVERRIDES[name]){photoCache[name]=PHOTO_OVERRIDES[name];return PHOTO_OVERRIDES[name];}
  if(photoCache[name])return photoCache[name];
  if(API_URL){try{const r=await fetch(API_URL.replace(/\/$/,'')+'/player-photo-url?name='+encodeURIComponent(name)+'&country='+encodeURIComponent(playerCountryForPhoto(name,country)),{cache:'no-store'});if(r.ok){const d=await r.json();if(d?.url && !/stadium|arena|newspaper|press|team-photo|squad-photo/i.test(String(d.url))){photoCache[name]=d.url;localStorage.setItem(PHOTO_CACHE_KEY,JSON.stringify(photoCache));return d.url;}}}catch(e){}}
  const wd=await wikidataPortrait(name,country);if(wd){photoCache[name]=wd;localStorage.setItem(PHOTO_CACHE_KEY,JSON.stringify(photoCache));return wd;}
  const u=await wikipediaPhoto(name,country);if(u){photoCache[name]=u;localStorage.setItem(PHOTO_CACHE_KEY,JSON.stringify(photoCache));return u;}
  return '';
}
function setPhoto(node,u){const frame=node.closest('.photo-frame'),fb=frame?.querySelector('.photo-fallback')||node.closest('.avatar')?.querySelector('.photo-fallback');if(u){node.src=u;node.style.opacity='1';frame?.classList.add('has-photo');if(fb)fb.style.display='none';}else{node.style.opacity='0';frame?.classList.remove('has-photo');if(fb)fb.style.display='grid';}node.onerror=()=>{node.style.opacity='0';frame?.classList.remove('has-photo');if(fb)fb.style.display='grid';};}
function hydratePhotos(root=document){const nodes=[...root.querySelectorAll('[data-player-photo]')];if(!nodes.length)return;const load=async n=>{if(n.dataset.photoStarted)return;n.dataset.photoStarted='1';const u=await resolvePlayerPhoto(n.dataset.playerPhoto,n.dataset.playerCountry||'');setPhoto(n,u);};if('IntersectionObserver' in window){const io=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){io.unobserve(e.target);load(e.target);}})},{rootMargin:'700px 0px'});nodes.forEach(n=>io.observe(n));}else nodes.slice(0,60).forEach(load);}

async function loadVoteCounts(){
  let all=localVotes();
  if(API_URL){try{const r=await fetch(API_URL.replace(/\/$/,'')+'/rankings',{cache:'no-store'});if(r.ok){const d=await r.json();all=d.votes||[]}}catch(e){}}
  voteCounts={};
  POSITIONS.forEach(p=>voteCounts[p.n]={});
  all.forEach(v=>POSITIONS.forEach(p=>{const n=v[p.n];if(n)voteCounts[p.n][n]=(voteCounts[p.n][n]||0)+1}));
}
function renderPositions(){
  $('#positions').innerHTML=POSITIONS.map(p=>{
    const list=getCandidates(p); const chosen=selectedFor(p);
    return `<article class="player-card position-voter-card"><div class="position-title"><strong>#${p.n} ${p.name}</strong><span>${chosen.length?`WÊRELD XV: #1 • TOP 10 • ${chosen.length}/10`:`TOP 10 • 0/10`}</span></div><div class="vote-note compact-note">Kies tot <b>10 spelers</b> uit die volledige lys en rangskik hulle. <b>#1 is jou Wêreld XV-keuse</b>; #2–#10 is die res van jou Top 10.</div><div class="selected-ranking">${chosen.map((name,i)=>{const pl=list.find(x=>x.name===name);return `<div class="selected-rank"><b>${i+1}</b>${photoImg(name,'vote-photo',playerCountryForPhoto(name))}<span>${esc(name)}</span><button type="button" class="rank-up" data-pos="${p.n}" data-name="${esc(name)}" data-dir="up" ${i===0?'disabled':''}>↑</button><button type="button" class="rank-down" data-pos="${p.n}" data-name="${esc(name)}" data-dir="down" ${i===chosen.length-1?'disabled':''}>↓</button><button type="button" class="rank-remove" data-pos="${p.n}" data-name="${esc(name)}">×</button></div>`}).join('')||'<small class="votes">Nog geen spelers gekies nie.</small>'}</div><input class="position-player-search" data-pos="${p.n}" placeholder="Soek speler in #${p.n}..." autocomplete="off"><div class="player-list position-player-list" data-pos="${p.n}">${list.map(pl=>{const checked=chosen.includes(pl.name);return `<label class="player-option ${checked?'selected':''}"><input type="checkbox" value="${esc(pl.name)}" data-pos="${p.n}" ${checked?'checked':''} ${!checked&&chosen.length>=10?'disabled':''}>${photoImg(pl.name,'vote-photo',pl.country)}<span>${esc(pl.name)}</span><span class="player-country">${playerFlag(pl.name,pl.country)}</span></label>`}).join('')||'<p class="votes">Geen spelers in hierdie posisie nie.</p>'}</div></article>`
  }).join('');
  $$('#positions input[type="checkbox"]').forEach(i=>i.addEventListener('change',e=>{
    const ok=toggleSelection(e.target.dataset.pos,e.target.value,e.target.checked);
    if(!ok){e.target.checked=false;$('#voteMessage').textContent='Jy kan net 10 spelers per posisie kies.';return;}
    renderPositions(); progress();
  }));
  /* Voting searches are applied only by the explicit SOEK button / Enter. */
  $$('.rank-up,.rank-down,.rank-remove').forEach(btn=>btn.addEventListener('click',()=>{
    const pos=btn.dataset.pos,name=btn.dataset.name,arr=selectedFor(pos).slice(),i=arr.indexOf(name);
    if(btn.classList.contains('rank-remove')){if(i>=0)arr.splice(i,1);}
    else if(btn.dataset.dir==='up'&&i>0){[arr[i-1],arr[i]]=[arr[i],arr[i-1]];}
    else if(btn.dataset.dir==='down'&&i<arr.length-1){[arr[i+1],arr[i]]=[arr[i],arr[i+1]];}
    selectionOrder[pos]=arr; selections[pos]=arr.slice(); renderPositions(); progress();
  }));
  hydratePhotos($('#positions'));
  renderWorldXvSummary();
}
function renderWorldXvSummary(){
  const host=$('#worldXVGrid'); if(!host)return;
  host.innerHTML=POSITIONS.map(p=>{const first=selectedFor(p)[0]; return `<div class="world-xv-slot ${first?'filled':''}"><b>#${p.n}</b><span>${esc(p.name)}</span><strong>${first?esc(first):'Nog nie gekies nie'}</strong></div>`}).join('');
  hydratePhotos(host);
}
function progress(){const complete=POSITIONS.filter(p=>selectedFor(p).length===10).length;const xv=POSITIONS.filter(p=>selectedFor(p).length>0).length;$('#progressText').textContent=`WÊRELD XV ${xv}/15 • TOP 10 ${complete}/15`;$('#progressBar').style.width=`${xv/15*100}%`;$('#submitVote').disabled=complete!==15}
async function submit(){
  const complete=POSITIONS.every(p=>selectedFor(p).length===10);
  if(!complete){$('#voteMessage').textContent='Kies en rangskik 10 spelers (#1–#10) vir al 15 posisies. Jou #1 per posisie vorm jou Wêreld XV.';return;}
  const payload={}; POSITIONS.forEach(p=>payload[p.n]=selectedFor(p.n).slice());
  if(API_URL){try{const r=await fetch(API_URL.replace(/\/$/,'')+'/vote',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(payload)});const d=await r.json();if(!r.ok)throw new Error(d.message||'Stem kon nie ingedien word nie.');showVoteSuccess(d.message||'Jou Top 10 is ontvang!');return}catch(e){$('#voteMessage').textContent='⚠️ Die sentrale stemdiens is tans nie beskikbaar nie. Jou stem is nie ingedien nie.';return}}
  const v=localVotes();v.push({...payload,submittedAt:new Date().toISOString()});saveLocal(v);showVoteSuccess('Jou persoonlike Top 10 per posisie is plaaslik gestoor.');
}
function showVoteSuccess(msg){selections={};selectionOrder={};renderPositions();progress();$('#voteMessage').textContent='✓ '+msg;$('#modalContent').innerHTML=`<h2>🏆 Stem ontvang!</h2><p>${esc(msg)}</p><button class="primary" id="goRanks">SIEN RANGSKIKINGS</button>`;$('#modal').hidden=false;$('#goRanks').onclick=()=>{$('#modal').hidden=true;screen('rankings')}}
function renderRankTabs(){const tabs=[['all','ALLE POSISIES'],...POSITIONS.map(p=>[p.n,'#'+p.n])];$('#rankTabs').innerHTML=tabs.map(([id,label])=>`<button class="${activeRank===id?'active':''}" data-rank="${id}">${label}</button>`).join('');$$('#rankTabs button').forEach(b=>b.onclick=()=>{activeRank=b.dataset.rank;renderRankTabs();renderRankings()})}
async function renderRankings(){
  renderRankTabs();
  let data=null;
  if(API_URL){try{const r=await fetch(API_URL.replace(/\/$/,'')+'/rankings',{cache:'no-store'});if(r.ok)data=await r.json()}catch(e){}}
  const chosen=activeRank==='all'?POSITIONS:POSITIONS.filter(p=>p.n===activeRank);
  $('#rankingList').innerHTML=chosen.map(p=>{
    const rows=(data?.rankings?.[p.n]||[]);
    if(rows.length) return `<article class="ranking-card"><h3>#${p.n} ${p.name} <small>TOP 10</small></h3>${rows.slice(0,10).map((r,i)=>`<div class="rank-row"><span class="rank">${i+1}</span>${photoImg(r.name,'vote-photo',playerCountryForPhoto(r.name))}<strong>${esc(r.name)}</strong><span class="votes">${r.points} punte • ${r.firstPlace||0} × #1</span></div>`).join('')}</article>`;
    const local=localVotes(), scores={}; local.forEach(v=>{const arr=v[p.n];if(Array.isArray(arr))arr.slice(0,10).forEach((name,i)=>{scores[name]=(scores[name]||0)+(10-i)})});
    const rows2=Object.entries(scores).sort((a,b)=>b[1]-a[1]).slice(0,10);
    return `<article class="ranking-card"><h3>#${p.n} ${p.name} <small>TOP 10</small></h3>${rows2.map(([name,points],i)=>`<div class="rank-row"><span class="rank">${i+1}</span>${photoImg(name,'vote-photo',playerCountryForPhoto(name))}<strong>${esc(name)}</strong><span class="votes">${points} punte</span></div>`).join('')||'<p class="votes">Nog geen sentrale stemme nie.</p>'}</article>`;
  }).join('');
  hydratePhotos($('#rankingList'));
}
const FLAG_REMOTE=FLAG_IMG;
const PLAYER_COUNTRY_META={
  '🇿🇦':{name:'Springbokke',sub:'Suid-Afrika',flagCode:'ZA'},'🇳🇿':{name:'All Blacks',sub:'Nieu-Seeland',flagCode:'NZ'},'🇦🇺':{name:'Wallabies',sub:'Australië',flagCode:'AU'},
  '🇮🇹':{name:'Italië',sub:'Italië',flagCode:'IT'},'🇫🇷':{name:'Les Bleus',sub:'Frankryk',flagCode:'FR'},'🇮🇪':{name:'Ireland',sub:'Ierland',flagCode:'IE'},
  '🇦🇷':{name:'Los Pumas',sub:'Argentinië',flagCode:'AR'},'🇫🇯':{name:'Flying Fijians',sub:'Fidji',flagCode:'FJ'},'🇬🇪':{name:'Lelos',sub:'Georgië',flagCode:'GE'},
  '🇷🇴':{name:'Stejarii',sub:'Roemenië',flagCode:'RO'},'🇹🇴':{name:'Ikale Tahi',sub:'Tonga',flagCode:'TO'},'🇯🇵':{name:'Brave Blossoms',sub:'Japan',flagCode:'JP'},
  '🇨🇦':{name:'Canada',sub:'Kanada',flagCode:'CA'},'🇺🇸':{name:'USA',sub:'Verenigde State',flagCode:'US'},'🇺🇾':{name:'Los Teros',sub:'Uruguay',flagCode:'UY'},
  '🇳🇦':{name:'Welwitschias',sub:'Namibië',flagCode:'NA'},'🇵🇹':{name:'Os Lobos',sub:'Portugal',flagCode:'PT'},'🇪🇸':{name:'Los Leones',sub:'Spanje',flagCode:'ES'},
  '🇬🇦':{name:'Panthers',sub:'Gaboen',flagCode:'GA'},'🇼🇸':{name:'Manu Samoa',sub:'Samoa',flagCode:'WS'},'🇭🇰':{name:'Hong Kong China',sub:'Hongkong',flagCode:'HK'},
  '🇰🇪':{name:'Simba',sub:'Kenia',flagCode:'KE'},'🇿🇼':{name:'Sables',sub:'Zimbabwe',flagCode:'ZW'},'🇧🇼':{name:'Vleisvissers',sub:'Botswana',flagCode:'BW'},'🇿🇲':{name:'Chipolopolo',sub:'Zambië',flagCode:'ZM'},'🇺🇬':{name:'Crane',sub:'Uganda',flagCode:'UG'}
};
const ENGLAND_NAMES=new Set(["Lawrence Dallaglio","Jonny Wilkinson","Matt Dawson","Danny Care","Ben Youngs","Harry Randall","Richard Hill","Neil Back","Martin Johnson","Courtney Lawes","Maro Itoje","Joe Launchbury","Dan Cole","Jason Leonard","Phil Vickery","Dylan Hartley","Jamie George","Owen Farrell","Manu Tuilagi","Jeremy Guscott","Will Greenwood","Rory Underwood","Jason Robinson","Josh Lewsey","Mike Brown","Alex Goode","George Chuter","Graham Rowntree","Andrew Sheridan","Tom Palmer","Simon Shaw","Steve Borthwick","Danny Cipriani","Stuart Lancaster"]);
const WALES_NAMES=new Set(["Alun Wyn Jones","Gareth Thomas","Gethin Jenkins","Sam Warburton","Taulupe Faletau","Justin Tipuric","Toby Faletau","Neil Jenkins","Stephen Jones","Dan Biggar","Gareth Anscombe","Mike Phillips","Dwayne Peel","Shane Williams","George North","Liam Williams","Leigh Halfpenny","Scott Quinnell","Jamie Roberts","Gavin Henson","Jonathan Davies","Graham Price","JPR Williams","Gareth Edwards","Barry John","Phil Bennett","Mervyn Davies","Dai Morris"]);
const SCOTLAND_NAMES=new Set(["Stuart Hogg","Finn Russell","Greig Laidlaw","Chris Paterson","Duhan van der Merwe","Sean Maitland","Richie Gray","Jonny Gray","John Barclay","Hamish Watson","David Denton","Ross Ford","Tom Smith","Euan Murray"]);
function playerCountryKey(p){const c=String(p.country||'');if(ENGLAND_NAMES.has(p.name)||/england/i.test(c))return '🏴ENG';if(WALES_NAMES.has(p.name)||/wales|wallis/i.test(c))return '🏴WAL';if(SCOTLAND_NAMES.has(p.name)||/scotland|skotland/i.test(c))return '🏴SCO';if(FLAG_BY_VALUE[p.country])return p.country;const hit=Object.entries(PLAYER_COUNTRY_META).find(([,m])=>m.sub.toLowerCase()===c.toLowerCase()||m.name.toLowerCase()===c.toLowerCase());return hit?hit[0]:(c||'🌍')}
function playerCountryMeta(key){if(key==='🏴ENG')return {name:'Engeland',sub:'Engeland',flagCode:'ENG'};if(key==='🏴WAL')return {name:'Wallis',sub:'Wallis',flagCode:'WAL'};if(key==='🏴SCO')return {name:'Skotland',sub:'Skotland',flagCode:'SCO'};return PLAYER_COUNTRY_META[key]||{name:'Ander lande',sub:'Internasionaal',flagCode:FLAG_BY_VALUE[key]||''}}

function countryFlagMarkup(meta){
  const src=FLAG_DATA[meta.flagCode]||FLAG_REMOTE[meta.flagCode]||'';
  return src?`<img class="country-flag-img" src="${src}" alt="${esc(meta.name)} vlag" loading="lazy" onerror="this.onerror=null;this.style.display='none'">`:`<span class="country-flag-emoji">🌍</span>`;
}
// PLAYER STATS – verifieerbare Test-loopbaan data. Vir historiese spelers wys ons hul
// fisiese profiel soos dit tydens hul internasionale loopbaan/peak-era geregistreer is.
const CURRENT_BOK_STATS={
  "Gerhard Steenekamp":{h:"1.97 m",w:"125 kg",caps:21,points:10,tries:2,from:2023,to:2026},
  "Jan-Hendrik Wessels":{h:"1.88 m",w:"112 kg",caps:11,points:10,tries:2,from:2022,to:2026},
  "Zachary Porthen":{h:"1.88 m",w:"123 kg",caps:6,points:5,tries:1,from:2025,to:2026},
  "Cameron Hanekom":{h:"1.90 m",w:"107 kg",caps:3,points:5,tries:1,from:2025,to:2026},
  "Morne van den Berg":{h:"1.83 m",w:"90 kg",caps:7,points:25,tries:5,from:2025,to:2026},
  "Manie Libbok":{h:"1.82 m",w:"84 kg",caps:30,points:147,tries:2,from:2022,to:2026},
  "Kurt-Lee Arendse":{h:"1.75 m",w:"82 kg",caps:36,points:135,tries:27,from:2022,to:2026},
  "Ethan Hooker":{h:"1.86 m",w:"99 kg",caps:13,points:10,tries:2,from:2025,to:2026},
  "Jasper Wiese":{h:"1.90 m",w:"111 kg",caps:49,points:20,tries:4,from:2021,to:2026},
  "Wilco Louw":{h:"1.87 m",w:"123 kg",caps:32,points:10,tries:2,from:2018,to:2026},
  "Ruan Nortje":{h:"2.07 m",w:"116 kg",caps:24,points:5,tries:1,from:2021,to:2026},
  "Andre Esterhuizen":{h:"1.93 m",w:"111 kg",caps:32,points:30,tries:6,from:2019,to:2026},
  "Marco van Staden":{h:"1.84 m",w:"107 kg",caps:36,points:20,tries:4,from:2018,to:2026},
  "Franco Mostert":{h:"1.99 m",w:"112 kg",caps:82,points:20,tries:4,from:2014,to:2026},
  "Jean Kleyn":{h:"2.03 m",w:"125 kg",caps:7,points:0,tries:0,from:2023,to:2026},
  "Johan Grobbelaar":{h:"1.89 m",w:"112 kg",caps:7,points:0,tries:0,from:2022,to:2026}
};
const PLAYER_STATS={
  "Os du Randt":{h:"1.88 m",w:"120 kg",caps:80,points:10,tries:2,from:1994,to:2007},
  "Tendai Mtawarira":{h:"1.83 m",w:"117 kg",caps:117,points:5,tries:1,from:2008,to:2019},
  "Trevor Nyakane":{h:"1.78 m",w:"121 kg",caps:53,points:5,tries:1,from:2013,to:2026},
  "Steven Kitshoff":{h:"1.82 m",w:"109 kg",caps:83,points:5,tries:1,from:2016,to:2023},
  "Ox Nche":{h:"1.73 m",w:"115 kg",caps:51,points:0,tries:0,from:2018,to:2026},
  "Thomas du Toit":{h:"1.90 m",w:"130 kg",caps:23,points:0,tries:0,from:2018,to:2026},
  "Frans Malherbe":{h:"1.91 m",w:"123 kg",caps:75,points:0,tries:0,from:2013,to:2025},
  "Jannie du Plessis":{h:"1.90 m",w:"120 kg",caps:70,points:10,tries:2,from:2007,to:2015},
  "CJ van der Linde":{h:"1.82 m",w:"115 kg",caps:74,points:5,tries:1,from:2002,to:2011},
  "Bismarck du Plessis":{h:"1.90 m",w:"112 kg",caps:79,points:15,tries:3,from:2008,to:2015},
  "John Smit":{h:"1.88 m",w:"114 kg",caps:111,points:40,tries:8,from:2000,to:2011},
  "Malcolm Marx":{h:"1.89 m",w:"115 kg",caps:92,points:140,tries:28,from:2017,to:2026},
  "Schalk Brits":{h:"1.91 m",w:"105 kg",caps:15,points:10,tries:2,from:2013,to:2019},
  "Adriaan Strauss":{h:"1.88 m",w:"113 kg",caps:66,points:25,tries:5,from:2012,to:2016},
  "James Dalton":{h:"1.83 m",w:"105 kg",caps:43,points:10,tries:2,from:1994,to:2002},
  "Victor Matfield":{h:"2.01 m",w:"118 kg",caps:127,points:40,tries:8,from:2001,to:2015},
  "Bakkies Botha":{h:"2.02 m",w:"125 kg",caps:85,points:10,tries:2,from:2002,to:2011},
  "Eben Etzebeth":{h:"2.03 m",w:"121 kg",caps:141,points:30,tries:6,from:2012,to:2026},
  "Lood de Jager":{h:"2.06 m",w:"124 kg",caps:66,points:30,tries:6,from:2014,to:2023},
  "RG Snyman":{h:"2.06 m",w:"117 kg",caps:41,points:5,tries:1,from:2017,to:2026},
  "Francois Pienaar":{h:"1.90 m",w:"105 kg",caps:29,points:25,tries:5,from:1993,to:1996},
  "Pieter-Steph du Toit":{h:"2.01 m",w:"116 kg",caps:101,points:70,tries:14,from:2013,to:2026},
  "Juan Smith":{h:"1.96 m",w:"111 kg",caps:69,points:20,tries:4,from:2002,to:2010},
  "Schalk Burger":{h:"1.93 m",w:"114 kg",caps:86,points:85,tries:17,from:2003,to:2017},
  "Heinrich Brussow":{h:"1.80 m",w:"108 kg",caps:23,points:5,tries:1,from:2008,to:2015},
  "Siya Kolisi":{h:"1.88 m",w:"105 kg",caps:106,points:75,tries:15,from:2013,to:2026},
  "Duane Vermeulen":{h:"1.93 m",w:"116 kg",caps:66,points:35,tries:7,from:2012,to:2023},
  "Gary Botha":{h:"1.80 m",w:"105 kg",caps:12,points:5,tries:1,from:2005,to:2010},
  "Bob Skinstad":{h:"1.93 m",w:"105 kg",caps:42,points:25,tries:5,from:1997,to:2007},
  "Faf de Klerk":{h:"1.72 m",w:"88 kg",caps:64,points:20,tries:4,from:2016,to:2025},
  "Ruan Pienaar":{h:"1.86 m",w:"90 kg",caps:88,points:135,tries:9,from:2006,to:2015},
  "Fourie du Preez":{h:"1.80 m",w:"85 kg",caps:76,points:60,tries:12,from:2004,to:2015},
  "Cobus Reinach":{h:"1.78 m",w:"85 kg",caps:56,points:100,tries:20,from:2014,to:2026},
  "Jannie de Beer":{h:"1.78 m",w:"85 kg",caps:13,points:149,tries:5,from:1996,to:1999},
  "Naas Botha":{h:"1.79 m",w:"88 kg",caps:28,points:312,tries:5,from:1980,to:1992},
  "Morne Steyn":{h:"1.82 m",w:"91 kg",caps:68,points:742,tries:4,from:2010,to:2021},
  "Handre Pollard":{h:"1.88 m",w:"97 kg",caps:83,points:820,tries:8,from:2014,to:2026},
  "Joel Stransky":{h:"1.78 m",w:"86 kg",caps:22,points:240,tries:3,from:1993,to:1997},
  "Percy Montgomery":{h:"1.85 m",w:"95 kg",caps:102,points:893,tries:25,from:1997,to:2008},
  "Francois Steyn":{h:"1.91 m",w:"116 kg",caps:78,points:165,tries:33,from:2006,to:2023},
  "Willie le Roux":{h:"1.84 m",w:"91 kg",caps:95,points:75,tries:15,from:2013,to:2026},
  "André Joubert":{h:"1.85 m",w:"92 kg",caps:34,points:80,tries:16,from:1992,to:1997},
  "Bryan Habana":{h:"1.80 m",w:"95 kg",caps:124,points:335,tries:67,from:2004,to:2016},
  "Cheslin Kolbe":{h:"1.71 m",w:"80 kg",caps:53,points:170,tries:26,from:2018,to:2026},
  "James Small":{h:"1.81 m",w:"91 kg",caps:47,points:80,tries:20,from:1992,to:1997},
  "Jaque Fourie":{h:"1.89 m",w:"103 kg",caps:72,points:70,tries:32,from:2003,to:2011},
  "Jean de Villiers":{h:"1.90 m",w:"100 kg",caps:109,points:140,tries:27,from:2002,to:2015},
  "Jesse Kriel":{h:"1.86 m",w:"97 kg",caps:93,points:120,tries:24,from:2015,to:2026},
  "Lukhanyo Am":{h:"1.86 m",w:"94 kg",caps:37,points:25,tries:5,from:2017,to:2023},
  "Damian de Allende":{h:"1.90 m",w:"102 kg",caps:102,points:60,tries:12,from:2015,to:2026},
  "Joost van der Westhuizen":{h:"1.88 m",w:"90 kg",caps:89,points:190,tries:38,from:1993,to:2003}
};
function playerStatsData(name){
  const d=PLAYER_STATS[name]||CURRENT_BOK_STATS[name];
  if(d)return d;
  const h=historicalPlayerStats[name];
  if(h)return {h:'—',w:'—',caps:h.caps,points:h.points,tries:h.tries,from:h.from,to:h.to,unverified:false};
  return {h:'—',w:'—',caps:'—',points:'—',tries:'—',from:'—',to:'—',unverified:true};
}
function openPlayerStats(name){
  const d=playerStatsData(name),modal=$('#playerStatsModal'); if(!modal)return;
  $('#playerStatsTitle').textContent=name;
  $('#playerStatsBody').innerHTML=`<div class="player-stats-grid">
    <div><b>${d.h}</b><small>Lengte</small></div><div><b>${d.w}</b><small>Gewig</small></div>
    <div><b>${d.caps}</b><small>Caps</small></div><div><b>${d.points}</b><small>Punte</small></div>
    <div><b>${d.tries}</b><small>Drieë</small></div><div><b>${d.from}${d.from!=='—'?' – '+d.to:''}</b><small>Springbok / Test-loopbaan</small></div>
  </div>${d.unverified?'<p class="player-stats-note">Hierdie speler se detaildata is nog nie in die verifieerde databasis nie. Ons wys eerder geen syfers as om onbetroubare inligting te gee nie.</p>':'<p class="player-stats-note">Stats is vir internasionale/Test-rugby. Historiese spelers se lengte en gewig weerspieël hul speel-/peak-era profiel.</p>'}`;
  modal.hidden=false; modal.setAttribute('aria-hidden','false'); document.body.classList.add('modal-open');
}
function closePlayerStats(){const m=$('#playerStatsModal');if(m){m.hidden=true;m.setAttribute('aria-hidden','true');document.body.classList.remove('modal-open')}}

const playerOpenGroups=new Set();
let appliedPlayerSearch='';
function renderPlayers(){
  const q=appliedPlayerSearch;const pos=$('#playerFilter')?.value||'all';
  const list=directoryPlayers.filter(p=>allowedPlayerCountry(p)&&(pos==='all'||p.pos===pos)&&(!q||p.name.toLowerCase().includes(q)));
  const groups=new Map();list.forEach(p=>{const key=playerCountryKey(p);if(!groups.has(key))groups.set(key,[]);groups.get(key).push(p)});
  const html=[...groups.entries()].map(([key,items])=>{const meta=playerCountryMeta(key),open=playerOpenGroups.has(key)||!!q;return `<section class="player-country-group ${open?'is-open':''}" data-player-country="${esc(key)}"><button type="button" class="player-country-bar" data-player-country-toggle="${esc(key)}" aria-expanded="${open}"><div class="player-country-logo">${countryFlagMarkup(meta)}</div><div class="player-country-title"><h3>${esc(meta.name)}</h3><small>${esc(meta.sub)} • ${items.length} spelers</small></div><span class="player-country-chevron">⌄</span></button><div class="player-country-dropdown" ${open?'':'hidden'}><div class="player-grid">${items.map(p=>`<article class="player-tile" role="button" tabindex="0" data-player-stats="${esc(p.name)}"><div class="avatar">${photoImg(p.name,'player-photo',p.country)}</div><h3>${esc(p.name)}</h3><small>${playerFlag(p.name,p.country)} • ${p.pos?('#'+p.pos+' '+(POSITIONS.find(x=>x.n===p.pos)?.name||'')):'Posisie nie gespesifiseer'}</small><p>Klik vir speler stats</p></article>`).join('')}</div></div></section>`}).join('');
  $('#playerGrid').innerHTML=html||'<p class="votes">Geen spelers gevind nie.</p>';hydratePhotos($('#playerGrid'));
}


const HISTORICAL_PLAYER_SOURCES=[
  ['South Africa','🇿🇦','SouthAfrica.csv'],['New Zealand','🇳🇿','NewZealand.csv'],['Ireland','🇮🇪','Ireland.csv'],
  ['France','🇫🇷','France.csv'],['England','🏴ENG','England.csv'],['Scotland','🏴SCO','Scotland.csv'],
  ['Australia','🇦🇺','Australia.csv'],['Argentina','🇦🇷','Argentina.csv'],['Fiji','🇫🇯','Fiji.csv'],
  ['Wales','🏴WAL','Wales.csv'],['Samoa','🇼🇸','Samoa.csv']
];
const HISTORICAL_PLAYER_BASES=['https://cdn.jsdelivr.net/gh/hautahi/Rugby-Wanderers@master/data/','https://raw.githubusercontent.com/hautahi/Rugby-Wanderers/master/data/'];
function csvFields(line){const out=[];let cur='',q=false;for(let i=0;i<line.length;i++){const c=line[i];if(c==='"'){if(q&&line[i+1]==='"'){cur+='"';i++;}else q=!q;}else if(c===','&&!q){out.push(cur.trim());cur='';}else cur+=c;}out.push(cur.trim());return out;}
function debutYear(v){const m=String(v||'').match(/(18|19|20)\d{2}/);return m?Number(m[0]):0;}
function positionNumber(v){const x=String(v||'').toLowerCase();if(/prop|loosehead|tighthead/.test(x))return '1';if(/hooker/.test(x))return '2';if(/lock|second row/.test(x))return '4';if(/flanker/.test(x))return '7';if(/number 8|no\. ?8|\b8\b/.test(x))return '8';if(/scrum/.test(x))return '9';if(/fly|stand-off|stand off/.test(x))return '10';if(/wing/.test(x))return '11';if(/centre|center/.test(x))return '13';if(/full-back|fullback/.test(x))return '15';if(/utility back|back three/.test(x))return '15';if(/half-back|halfback/.test(x))return '9';return '12';}
async function loadHistoricalPlayerDirectory(){
  if(directoryHistoryLoaded)return;
  directoryHistoryLoaded=true;
  const merged=[...directoryPlayers];
  const existing=new Set(merged.map(p=>String(p.name||'').trim().toLowerCase()+'|'+playerCountryKey(p)));
  await Promise.all(HISTORICAL_PLAYER_SOURCES.map(async ([country,flag,file])=>{
    try{
      let r=null;
      for(const base of HISTORICAL_PLAYER_BASES){
        try{const rr=await fetch(base+file+'?v=20260909',{cache:'no-store',mode:'cors'});if(rr.ok){r=rr;break}}catch(e){}
      }
      if(!r)return;
      const text=await r.text();const lines=text.split(/\r?\n/).filter(Boolean);if(lines.length<2)return;
      const head=csvFields(lines[0]).map(x=>x.toLowerCase());
      const ni=head.indexOf('name'),di=head.indexOf('debut'),pi=head.indexOf('position'),mi=head.indexOf('matches'),poi=head.indexOf('points'),ti=head.indexOf('tries');
      for(const line of lines.slice(1)){
        const row=csvFields(line),name=(row[ni]||'').trim(),year=debutYear(row[di]);
        const matches=Number(String(row[mi]||'0').replace(/[^0-9.-]/g,''))||0;
        if(!name||year<1987||year>2026||matches<=0)continue;
        const pos=positionNumber(row[pi]);
        const player={name,country:flag,pos};
        const key=name.toLowerCase()+'|'+playerCountryKey(player);
        const points=Number(String(row[poi]||'0').replace(/[^0-9.-]/g,''))||0;
        const tries=Number(String(row[ti]||'0').replace(/[^0-9.-]/g,''))||0;
        historicalPlayerStats[name]={caps:matches,points,tries,from:year,to:'—'};
        if(!existing.has(key)){existing.add(key);merged.push(player);}
      }
    }catch(e){}
  }));
  directoryPlayers=uniquePlayers(merged).filter(allowedPlayerCountry);
  renderPlayers();
  renderPositions();
}

async function refreshLiveNews(){
  if(!API_URL)return;
  try{
    const r=await fetch(API_URL.replace(/\/$/,'')+'/rugby/news',{cache:'no-store'});
    if(!r.ok)return;
    const d=await r.json();
    if(Array.isArray(d.items)&&d.items.length){
      window.LEKKER_LIVE_NEWS=d.items.map(x=>[x.icon||'📰',x.title||'Rugby Nuus',x.description||'',x.url||'',x.image||NEWS_IMG_FALLBACK]);
      renderNews();
    }
  }catch(e){}
}


const ESPN_RUGBY_LEAGUES=[
  ['World Rugby Championship','164205'],
  ['Six Nations','180659'],
  ['Super Rugby Pacific','242041'],
  ['United Rugby Championship','289234'],
  ['Champions Cup','270559'],
  ['Top 14','170645'],
  ['The Rugby Championship','398'],
  ['Currie Cup','270555']
];
async function loadESPNRugby(){
  const d=new Date();const date=d.getUTCFullYear()+String(d.getUTCMonth()+1).padStart(2,'0')+String(d.getUTCDate()).padStart(2,'0');
  const results=await Promise.all(ESPN_RUGBY_LEAGUES.map(async ([league,id])=>{
    try{
      const u=`https://site.api.espn.com/apis/site/v2/sports/rugby/${id}/scoreboard?dates=${date}`;
      const r=await fetch(u,{cache:'no-store'});if(!r.ok)return [];
      const j=await r.json();return (j.events||[]).map(g=>({...g,__league:league,__leagueId:id}));
    }catch(e){return []}
  }));
  const seen=new Set(),games=[];results.flat().forEach(g=>{if(!seen.has(g.id)){seen.add(g.id);games.push(g)}});
  return games;
}
async function showMatchSummary(eventId,leagueId){
  const box=$('#modalContent'); if(!box)return;
  box.innerHTML='<h2>📊 WEDSTRYDSTATISTIEKE</h2><p>Laai wedstryddetail...</p>'; $('#modal').hidden=false;
  try{
    let d=null;
    if(API_URL){const r=await fetch(API_URL.replace(/\/$/,'')+'/rugby/summary?league='+encodeURIComponent(leagueId)+'&event='+encodeURIComponent(eventId),{cache:'no-store'});if(r.ok)d=await r.json();}
    if(!d){const r=await fetch(`https://site.api.espn.com/apis/site/v2/sports/rugby/${encodeURIComponent(leagueId)}/summary?event=${encodeURIComponent(eventId)}`,{cache:'no-store'});if(!r.ok)throw new Error('Geen wedstryddetail beskikbaar nie.');d={summary:await r.json()};}
    const x=d.summary||{}; const comp=x.header?.competitions?.[0]||{}; const teams=comp.competitors||[];
    const venue=comp.venue||x.gameInfo?.venue||{}; const stats=(x.boxscore?.teams||[]);
    const rows=stats.flatMap(t=>(t.statistics||[]).map(st=>`<div class="rank-row"><strong>${esc(t.team?.displayName||t.team?.name||'Span')}</strong><span>${esc(st.label||st.name||'Stat')}</span><span class="votes">${esc(String(st.displayValue??st.value??'-'))}</span></div>`)).join('');
    const scorer=(x.scoringPlays||[]).slice(-20).map(e=>`<div class="rank-row"><strong>${esc(e.text||e.type?.text||'Spelgebeurtenis')}</strong><span>${e.period?.displayValue||''}</span><span class="votes">${e.clock?.displayValue||''}</span></div>`).join('');
    box.innerHTML=`<h2>📊 WEDSTRYDSTATISTIEKE</h2><p><b>${esc(teams.map(t=>t.team?.displayName||t.team?.name||'').filter(Boolean).join(' vs '))}</b></p><p>${esc(venue.fullName||venue.name||'Stadion onbekend')} ${venue.address?.city?'• '+esc(venue.address.city):''}</p>${comp.attendance?`<p>Toeskouers: <b>${esc(String(comp.attendance))}</b></p>`:''}<h3>Spanstatistieke</h3>${rows||'<p class="votes">Geen gedetailleerde spanstatistieke deur die bron verskaf nie.</p>'}${scorer?'<h3>Spelgebeurtenisse</h3>'+scorer:''}`;
  }catch(e){box.innerHTML='<h2>📊 WEDSTRYDSTATISTIEKE</h2><p>Die detaildata kon nie nou gelaai word nie.</p>';}
}

async function loadLiveStats(){
  try{
    let games=[];
    let ss=null;
    if(API_URL){
      try{const r=await fetch(API_URL.replace(/\/$/,'')+'/rugby/supersport',{cache:'no-store'});if(r.ok)ss=await r.json()}catch(e){}
      try{const r=await fetch(API_URL.replace(/\/$/,'')+'/rugby/live',{cache:'no-store'});if(r.ok){const d=await r.json();games=d.games||[]}}catch(e){}
    }
    if(!ss)ss=SUPERSPORT_VERIFIED;
    const todayKey=new Intl.DateTimeFormat('en-CA',{timeZone:'Africa/Johannesburg',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
    const todaySource=ss.fixtures||SUPERSPORT_VERIFIED.fixtures;
    const localDateKey=v=>{const d=new Date(v);return Number.isNaN(d.getTime())?'':new Intl.DateTimeFormat('en-CA',{timeZone:'Africa/Johannesburg',year:'numeric',month:'2-digit',day:'2-digit'}).format(d)};
    const today=todaySource.filter(x=>localDateKey(x[0])===todayKey);
    const liveToday=games.filter(g=>localDateKey(g.date||g.startDate||g.status?.type?.date||g.status?.type?.detail)===todayKey);
    const todayCount=Math.max(today.length,liveToday.length);
    const liveStates=new Set(['in','live','halftime','1h','2h','et','ot','bt','p','int']);
    const isLiveGame=g=>{const s=String(g?.status?.type?.state||g?.status?.short||g?.status?.type?.name||'').toLowerCase();return liveStates.has(s)||s.includes('in_progress')||s.includes('live')||s==='in'};
    const live=games.filter(isLiveGame);
    $('#liveCount').textContent=live.length;
    $('#gameCount').textContent=todayCount;
    $('#liveUpdated').textContent='SuperSport • opgedateer '+new Date().toLocaleTimeString('af-ZA',{hour:'2-digit',minute:'2-digit'});
    const liveHtml=games.length?games.map(g=>{
      const c=g.competitions?.[0]||{};const teams=c.competitors||[];const home=teams.find(t=>t.homeAway==='home')||teams[0]||{};const away=teams.find(t=>t.homeAway==='away')||teams[1]||{};
      const h=home.team?.displayName||home.team?.name||g.home?.name||'Tuis';const a=away.team?.displayName||away.team?.name||g.away?.name||'Besoekers';
      const hs=home.score??g.scores?.home??'-',as=away.score??g.scores?.away??'-';const liveNow=isLiveGame(g);
      return `<article class="live-match ${liveNow?'is-live':''}"><div class="match-meta"><span>${esc(g.__league||g.league?.name||'Rugby')}</span><small>${liveNow?'🔴 LIVE':esc(g.status?.type?.shortDetail||g.status?.type?.description||'Vandag')}</small></div><div class="live-team">${esc(h)}</div><div class="live-score"><div>${esc(hs)} – ${esc(as)}</div><div class="live-status">${liveNow?'🔴 LIVE':''}</div><button class="dark-btn match-details" data-event="${esc(g.id||'')}" data-league="${esc(g.__leagueId||'')}" ${g.id?'':'disabled'}>SIEN ALLE STATISTIEKE</button></div><div class="live-team">${esc(a)}</div></article>`
    }).join(''):'<div class="coming"><span>LIVE</span><h3>GEEN LIVE WEDSTRYD BESKIKBAAR NIE</h3><p>Die huidige wedstryd-feed rapporteer geen live wedstryd nie.</p></div>';
    const upcoming=ss.fixtures||SUPERSPORT_VERIFIED.fixtures;
    const results=ss.results||SUPERSPORT_VERIFIED.results;
    const currentLive=ss.currentLive||[];
    const fmt=d=>new Date(d).toLocaleString('af-ZA',{weekday:'short',day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'});
    const now=Date.now();
    const upcomingFuture=upcoming.filter(x=>new Date(x[0]).getTime()>now-30*60*1000);
    const liveVerified=currentLive.map(x=>`<article class="live-match is-live"><div class="match-meta"><span>${esc(x[1])}</span><small>🔴 LIVE • SuperSport</small></div><div class="live-team">${esc(x[2])}</div><div class="live-score"><div>LIVE</div><div class="live-status">${esc(x[5]||'LIVE')}</div></div><div class="live-team">${esc(x[3])}</div><small>${esc(x[4])}</small></article>`).join('');
    const upcomingHtml=upcomingFuture.slice(0,30).map(x=>`<article class="live-match"><div class="match-meta"><span>${esc(x[1])}</span><small>${fmt(x[0])}</small></div><div class="live-team">${esc(x[2])}</div><div class="live-score"><div>VS</div><div class="live-status">${esc(x[4])}</div></div><div class="live-team">${esc(x[3])}</div></article>`).join('');
    const resultsHtml=results.slice(0,20).map(x=>`<article class="live-match"><div class="match-meta"><span>${esc(x[1])}</span><small>${esc(x[0])}</small></div><div class="live-team">${esc(x[2])}</div><div class="live-score"><div>${x[3]} – ${x[5]}</div><div class="live-status">${esc(x[6])}</div></div><div class="live-team">${esc(x[4])}</div></article>`).join('');
    $('#liveMatches').innerHTML=`${liveHtml}${liveVerified}<div class="live-head"><h3>📅 KOMENDE WEDSTRYDE</h3><small>SuperSport Fixtures</small></div><div class="live-matches">${upcomingHtml}</div><div class="live-head"><h3>✅ ONLANGSE RESULTATE</h3><small>SuperSport Results</small></div><div class="live-matches">${resultsHtml}</div>`;
  }catch(e){
    $('#liveCount').textContent='—';$('#gameCount').textContent='—';$('#liveUpdated').textContent='Kon nie verfris nie';
    $('#liveMatches').innerHTML='<div class="coming"><span>VERBINDING</span><h3>RUGBY-DATA TYDELIK ONBESKIKBAAR</h3><p>Probeer weer.</p></div>';
  }
}

const PREDICTOR_STORAGE='lekkerRugbyPredictorV1';
let predictorFixtures=[];
let predictorResults=[];
let predictorMembers=[];
let predictorPredictions=[];
let predictorTab='games';
function predictorDevice(){let id=localStorage.getItem('lekkerRugbyPredictorDevice');if(!id){id='lr-'+cryptoRandom();localStorage.setItem('lekkerRugbyPredictorDevice',id)}return id}
function cryptoRandom(){return Math.random().toString(36).slice(2)+Date.now().toString(36)}
function predictorKey(x){return [String(x[0]),String(x[1]),String(x[2]),String(x[3])].join('|')}
function predictorFixture(x){return {id:predictorKey(x),date:x[0],league:x[1],home:x[2],away:x[3],venue:x[4]||''}}
function predictorLocal(){try{return JSON.parse(localStorage.getItem(PREDICTOR_STORAGE)||'{}')}catch{return {}}}
function savePredictorLocal(v){localStorage.setItem(PREDICTOR_STORAGE,JSON.stringify(v))}
function predictorName(){return (localStorage.getItem('lekkerRugbyPredictorName')||'').trim()}
function predictorPool(){return (localStorage.getItem('lekkerRugbyPredictorPool')||'LOCAL').trim().toUpperCase()}
function setPredictorIdentity(){const n=$('#predictorName')?.value.trim();const pool=($('#predictorPool')?.value.trim()||'LOCAL').toUpperCase();if(n)localStorage.setItem('lekkerRugbyPredictorName',n);localStorage.setItem('lekkerRugbyPredictorPool',pool);return {name:n||'Speler',pool}}
function predDate(d){return new Date(d).toLocaleString('af-ZA',{weekday:'short',day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'})}
function predClosed(x){return Date.now()>=new Date(x.date).getTime()}
function actualFor(f){const date=f.date.slice(0,10);return predictorResults.find(r=>r[0]===date&&String(r[2]).toLowerCase()===f.home.toLowerCase()&&String(r[4]).toLowerCase()===f.away.toLowerCase())||null}
function predPoints(pred,f,allPreds=[]){const actual=actualFor(f);if(!actual)return {points:0,win:0,margin:0,bonus:0,played:false};const ah=Number(actual[3]),aa=Number(actual[5]);const ph=Number(pred.home),pa=Number(pred.away);if(!Number.isFinite(ph)||!Number.isFinite(pa))return {points:0,win:0,margin:0,bonus:0,played:true};const am=ah-aa,pm=ph-pa;const actualSign=Math.sign(am),predSign=Math.sign(pm);const win=(actualSign===predSign?1:0);const margin=Math.abs(am-pm)<=5?.5:0;let bonus=0;if(win&&allPreds.length){const valid=allPreds.filter(x=>Number.isFinite(Number(x.home))&&Number.isFinite(Number(x.away)));if(valid.length){const distances=valid.map(x=>({d:Math.abs((Number(x.home)-Number(x.away))-am),x}));const min=Math.min(...distances.map(x=>x.d));const mine=Math.abs(pm-am);if(mine===min&&mine<=15)bonus=1;}}return {points:win+margin+bonus,win,margin,bonus,played:true}}
function predictorLoadLocal(){const d=predictorLocal();const pool=predictorPool();const all=d.predictions||[];predictorPredictions=all.filter(x=>x.pool===pool);const n=predictorName()||'Speler';predictorMembers=[{deviceId:predictorDevice(),nickname:n,predictions:predictorPredictions}];}
async function predictorFetchData(){
  let ss=null;
  if(API_URL){try{const r=await fetch(API_URL.replace(/\/$/,'')+'/rugby/supersport',{cache:'no-store'});if(r.ok)ss=await r.json()}catch(e){}}
  ss=ss||SUPERSPORT_VERIFIED; predictorFixtures=(ss.fixtures||[]).map(predictorFixture); predictorResults=ss.results||[];
  predictorLoadLocal();
  if(API_URL){try{const r=await fetch(API_URL.replace(/\/$/,'')+'/predictor/state?pool='+encodeURIComponent(predictorPool()),{cache:'no-store'});if(r.ok){const d=await r.json();predictorMembers=d.members||[];predictorPredictions=(d.predictions||[]).filter(x=>x.pool===predictorPool())}}catch(e){}}
}
function predChoice(old,f){
  const ph=Number(old?.home),pa=Number(old?.away);
  if(!Number.isFinite(ph)||!Number.isFinite(pa))return {winner:'',margin:''};
  const d=ph-pa; return {winner:d>0?'home':d<0?'away':'draw',margin:String(Math.abs(d))};
}
function predictorRenderGames(){
  const host=$('#predictorGames');if(!host)return;
  const future=predictorFixtures.filter(x=>new Date(x.date).getTime()>Date.now()-30*60*1000).slice(0,60);
  if(!future.length){host.innerHTML='<div class="predictor-pane"><h3>Geen komende wedstryde nie</h3><p class="votes">Verfris om die jongste SuperSport-fixtures te laai.</p></div>';return}
  const me=predictorDevice();const mine=predictorPredictions.filter(x=>x.deviceId===me);
  host.innerHTML='<p class="predictor-note">Kies die <b>wenner</b> en die <b>marge</b>. Dit volg die rugby-predictor-meganika: 1 punt vir wenner, +0.5 vir ’n marge binne 5, +1 bonus vir die naaste marge in jou pool. Jou keuse sluit wanneer die wedstryd begin. Pool: <span class="pool-code">'+esc(predictorPool())+'</span>.</p>'+future.map(f=>{
    const old=mine.find(x=>x.fixtureId===f.id)||{};const choice=predChoice(old,f);const closed=predClosed(f);const actual=actualFor(f);
    const result=old.home!=null?predPoints(old,f):null;
    const margins=Array.from({length:31},(_,i)=>i+1);
    return `<article class="predictor-game ${closed?'predictor-closed':''}">
      <div class="meta"><span>${esc(f.league)}</span><span>${predDate(f.date)}</span></div>
      <div class="predictor-match-head"><div class="predictor-team">${esc(f.home)}<small>${esc(f.venue)}</small></div><div class="predictor-vs">VS</div><div class="predictor-team">${esc(f.away)}<small>${actual?'FINAL: '+actual[3]+'–'+actual[5]:'Kies jou voorspelling'}</small></div></div>
      <div class="pick-row"><span class="pick-label">WENNER</span><div class="pick-buttons">
        <button type="button" class="pick-btn ${choice.winner==='home'?'selected':''}" data-pick-winner="${esc(f.id)}" data-winner="home" ${closed?'disabled':''}>${esc(f.home)}</button>
        <button type="button" class="pick-btn ${choice.winner==='draw'?'selected':''}" data-pick-winner="${esc(f.id)}" data-winner="draw" ${closed?'disabled':''}>GELYKOP</button>
        <button type="button" class="pick-btn ${choice.winner==='away'?'selected':''}" data-pick-winner="${esc(f.id)}" data-winner="away" ${closed?'disabled':''}>${esc(f.away)}</button>
      </div></div>
      <div class="pick-row"><span class="pick-label">MARGE</span><select class="margin-select" data-pred-margin="${esc(f.id)}" ${closed?'disabled':''}><option value="">Kies marge</option>${margins.map(m=>`<option value="${m}" ${choice.margin===String(m)?'selected':''}>${m} punt${m===1?'':'e'}</option>`).join('')}</select></div>
      <div class="prediction-preview" data-pred-preview="${esc(f.id)}">${choice.winner?`VOORSPELLING: ${choice.winner==='home'?esc(f.home):choice.winner==='away'?esc(f.away):'GELYKOP'}${choice.winner==='draw'?'':' met '+(choice.margin||'—')+' punt(e)'}`:'Kies wenner + marge'}</div>
      <div class="predictor-save"><small>${closed?(actual?'Wedstryd klaar':'Voorspelling gesluit'):(old.home!=null?'Voorspelling gestoor':'Nog nie voorspel nie')}</small><button class="gold-btn save-prediction" data-fixture="${esc(f.id)}" ${closed?'disabled':''}>${old.home!=null?'STOOR WEER':'STOOR VOORSPELLING'}</button></div>
      ${result&&result.played?`<div class="predictor-save"><span class="predictor-saved">${result.points} punte • Win ${result.win} • Marge ${result.margin} • Bonus ${result.bonus}</span></div>`:''}
    </article>`}).join('');
}
function predictorRenderMyPicks(){
  const h=$('#predictorMyPicks');if(!h)return;const me=predictorDevice();const mine=predictorPredictions.filter(x=>x.deviceId===me);
  if(!mine.length){h.innerHTML='<h3>📋 MY VOORSPELLINGS</h3><p class="votes">Jy het nog geen wedstryd voorspel nie. Gaan na KOMENDE SPELLETJIES om te begin.</p>';return}
  const rows=mine.map(p=>{const f=predictorFixtures.find(x=>x.id===p.fixtureId);if(!f)return '';const c=predChoice(p,f),actual=actualFor(f),z=predPoints(p,f,predictorPredictions.filter(x=>x.pool===predictorPool()&&x.fixtureId===p.fixtureId));return `<div class="predictor-rank"><strong>${predClosed(f)?'✓':'•'}</strong><span><b>${esc(f.home)} vs ${esc(f.away)}</b><small class="votes">${predDate(f.date)} • ${c.winner==='home'?esc(f.home):c.winner==='away'?esc(f.away):'GELYKOP'}${c.winner==='draw'?'':' by '+c.margin}</small></span><strong>${actual?z.points.toFixed(1):'—'}</strong></div>`}).join('');
  h.innerHTML=`<h3>📋 MY VOORSPELLINGS</h3><p class="predictor-note">Jou punte verskyn nadat die werklike uitslag beskikbaar is.</p>${rows}`;
}
function predictorRenderPools(){
  const h=$('#predictorPools');if(!h)return;const code=predictorPool();h.innerHTML=`<h3>👥 MY POOLS</h3><div class="pool-card"><span class="pill">AKTIEWE POOL</span><b>${esc(code)}</b><p class="votes">Deel hierdie kode met vriende. Wanneer die Worker gekoppel is, word lede en voorspelling sentraal gedeel.</p><div class="predictor-pool-actions"><button type="button" class="dark-btn" data-copy-pool="${esc(code)}">KOPIEER KODE</button><button type="button" class="gold-btn" data-pred-tab-jump="games">GAAN VOORSPEL</button></div></div><div class="pool-card"><h4>REEKS-PRESTASIE</h4><p class="votes">Jou ranglys word outomaties per kompetisie/reeks opgebreek, sodat jy URC, Currie Cup en internasionale rugby apart kan volg.</p></div>`;
}
function predictorRenderRules(){const h=$('#predictorRules');if(!h)return;h.innerHTML='<h3>🎯 Hoe LEKKER Rugby Voorspel werk</h3><div class="predictor-rule-grid"><div class="predictor-rule"><b>1</b><span>WIN</span><p class="votes">Kies die korrekte wenner.</p></div><div class="predictor-rule"><b>+0.5</b><span>MARGE</span><p class="votes">Jou marge moet binne 5 punte van die werklike marge wees.</p></div><div class="predictor-rule"><b>+1</b><span>BONUS</span><p class="votes">Die naaste korrekte marge in jou pool kry &apos;n bonus, mits dit binne 15 punte is.</p></div></div><p class="data-note">Die meganika is geïnspireer deur moderne rugby-predictors, maar LEKKER Rugby Voorspel gebruik sy eie naam, databasis en implementering.</p>'}
function predictorRenderLeaderboard(){const h=$('#predictorLeaderboard');if(!h)return;const rows=[];const pool=predictorPool();for(const m of predictorMembers){const ps=(predictorPredictions||[]).filter(x=>x.pool===pool&&x.deviceId===m.deviceId);let total=0,played=0,wins=0,margins=0,bonus=0;const series={};for(const p of ps){const f=predictorFixtures.find(x=>x.id===p.fixtureId);if(!f)continue;const z=predPoints(p,f,predictorPredictions.filter(x=>x.pool===pool&&x.fixtureId===p.fixtureId));total+=z.points;played+=z.played?1:0;wins+=z.win;margins+=z.margin;bonus+=z.bonus;const key=f.league;series[key]=(series[key]||0)+z.points}rows.push({name:m.nickname||'Speler',total,played,wins,margins,bonus,series})}rows.sort((a,b)=>b.total-a.total||b.wins-a.wins||a.name.localeCompare(b.name));const seriesMap={};rows.forEach(r=>Object.entries(r.series).forEach(([k,v])=>{seriesMap[k]=(seriesMap[k]||0)+v}));h.innerHTML=`<h3>🏆 POOL: ${esc(pool)}</h3><p class="predictor-note">${rows.length} speler${rows.length===1?'':'s'} • punte word outomaties bereken sodra uitslae beskikbaar is.</p>${rows.map((r,i)=>`<div class="predictor-rank"><strong>#${i+1}</strong><span><b>${esc(r.name)}</b><small class="votes">${r.played} klaar • ${r.wins} regte wenners • ${r.margins} marge-punte • ${r.bonus} bonus</small></span><strong>${r.total.toFixed(1)}</strong></div>`).join('')||'<p class="votes">Geen voorspellers in hierdie pool nie.</p>'}<h3 style="margin-top:22px">📚 REEKS / KOMPETISIE-PUNTE</h3>${Object.entries(seriesMap).sort((a,b)=>b[1]-a[1]).map(([k,v])=>`<div class="predictor-rank"><strong>🏉</strong><span>${esc(k)}</span><strong>${v.toFixed(1)}</strong></div>`).join('')||'<p class="votes">Geen reeks-punte nog nie.</p>'}`}
async function renderPredictor(){const n=predictorName();if($('#predictorName'))$('#predictorName').value=n;if($('#predictorPool'))$('#predictorPool').value=predictorPool()==='LOCAL'?'':predictorPool();await predictorFetchData();predictorRenderGames();predictorRenderMyPicks();predictorRenderLeaderboard();predictorRenderPools();predictorRenderRules();predictorSetTab(predictorTab)}
function predictorSetTab(tab){predictorTab=tab;$$('[data-pred-tab]').forEach(b=>b.classList.toggle('active',b.dataset.predTab===tab));$('#predictorGames').hidden=tab!=='games';$('#predictorMyPicks').hidden=tab!=='mypicks';$('#predictorLeaderboard').hidden=tab!=='leaderboard';$('#predictorPools').hidden=tab!=='pools';$('#predictorRules').hidden=tab!=='rules';if(tab==='leaderboard')predictorRenderLeaderboard();if(tab==='mypicks')predictorRenderMyPicks();if(tab==='pools')predictorRenderPools()}
async function predictorSave(fixtureId){
  const name=$('#predictorName').value.trim();if(!name){$('#predictorStatus').textContent='Tik eers jou naam in.';return}
  localStorage.setItem('lekkerRugbyPredictorName',name);const f=predictorFixtures.find(x=>x.id===fixtureId);if(!f||predClosed(f))return;
  const w=$(`[data-pick-winner="${CSS.escape(fixtureId)}"].selected`)?.dataset.winner;const m=Number($(`[data-pred-margin="${CSS.escape(fixtureId)}"]`)?.value);
  if(!w||!Number.isInteger(m)||(w!=='draw'&&m<1)||m<0||m>50){$('#predictorStatus').textContent='Kies eers ’n wenner en geldige marge.';return}
  const pool=($('#predictorPool').value.trim()||'LOCAL').toUpperCase();localStorage.setItem('lekkerRugbyPredictorPool',pool);
  const home=w==='home'?m:w==='away'?0:0,away=w==='away'?m:0;
  const payload={fixtureId,home:f.home,away:f.away,league:f.league,date:f.date,venue:f.venue,predHome:home,predAway:away,pool,nickname:name,deviceId:predictorDevice()};let central=false;
  if(API_URL){try{const r=await fetch(API_URL.replace(/\/$/,'')+'/predictor/predict',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(payload)});if(!r.ok)throw new Error('central');central=true}catch(e){}}
  const d=predictorLocal();d.predictions=(d.predictions||[]).filter(x=>!(x.pool===pool&&x.deviceId===payload.deviceId&&x.fixtureId===fixtureId));d.predictions.push(payload);savePredictorLocal(d);predictorPredictions=d.predictions.filter(x=>x.pool===pool);$('#predictorStatus').innerHTML=(central?'✓ Sentraal gestoor':'✓ Plaaslik gestoor')+' • '+esc(f.home)+' vs '+esc(f.away);predictorRenderGames();predictorRenderMyPicks();
}
async function predictorCreateJoin(mode){const name=($('#predictorName')?.value.trim()||predictorUser?.displayName||'Speler');const field=($('#predictorPool')?.value.trim()||'');if(!predictorSession){$('#predictorStatus').textContent='Skep eers jou eie login en teken in.';return}if(mode==='create'&&!field){$('#predictorStatus').textContent='Gee jou pool ’n naam.';return}if(mode==='join'&&!field){$('#predictorStatus').textContent='Voer die pool-kode in wat jy ontvang het.';return}localStorage.setItem('lekkerRugbyPredictorName',name);try{const r=await predictorApi('/predictor/pools',{method:'POST',body:JSON.stringify({action:mode,nickname:name,deviceId:predictorUser.username,poolName:mode==='create'?field:'',name:mode==='create'?field:'',code:mode==='join'?field.toUpperCase():''})});const d=await r.json();if(!r.ok)throw new Error(d.message||'Pool kon nie verwerk word nie.');localStorage.setItem('lekkerRugbyPredictorPool',d.code);$('#predictorPool').value=mode==='create'?(d.name||field):d.code;$('#predictorStatus').innerHTML='✓ '+esc(d.name||field)+' • Pool-kode: <b>'+esc(d.code)+'</b>';await renderPredictor()}catch(e){$('#predictorStatus').textContent='⚠️ '+e.message}};
function renderNews(){
  const el=document.getElementById('newsList');if(!el)return;
  const items=Array.isArray(LEKKER_NEWS)?LEKKER_NEWS:[];
  el.innerHTML=items.map((n,i)=>`<article class="news-card"><div class="news-art"><img data-news-index="${i}" src="${esc(n[4]||'./assets/lekker-rugby-hero.png')}" alt="${esc(n[1])}" loading="lazy" referrerpolicy="no-referrer"></div><div><span class="news-source">LEKKER NUUS</span><h3>${esc(n[1])}</h3><p>${esc(n[2])}</p><a href="${esc(n[3])}" target="_blank" rel="noopener noreferrer">LEES VOLLEDIGE BERIG →</a></div></article>`).join('');
  el.querySelectorAll('img[data-news-index]').forEach(img=>img.addEventListener('error',()=>{img.onerror=null;img.src=NEWS_IMG_FALLBACK;},{once:true}));
}

function renderTeamHistory(t){
  const h=TEAM_FIVE_YEAR_OVERVIEW[t.name]||TEAM_FIVE_YEAR_OVERVIEW['South Africa'];
  const rows=h.years.map(y=>`<div class="team-table-row"><b>${y}</b><span>Internasionale wedstryde</span><span>Resultate-argief</span><a href="${h.source}" target="_blank" rel="noopener noreferrer">OPEN DATA →</a></div>`).join('');
  return `<div class="team-section"><h4>📈 5-JAAR STATISTIEKE • 2022–2026</h4><p class="team-note">${esc(h.note)}</p><div class="team-table"><div class="team-table-row head"><span>Jaar</span><span>Datastel</span><span>Status</span><span>Bron</span></div>${rows}</div></div>`;
}
const TEAM_DETAIL_DATA={
  'New Zealand':{
    venue:'M&T Bank Stadium, Baltimore', source:'https://www.rugbypass.com/teams/new-zealand/fixtures-results/',
    results:[['4 Jul','Nations Championship','New Zealand',34,'France',32,'One NZ Stadium'],['11 Jul','Nations Championship','New Zealand',47,'Italy',17,'Hnry Stadium'],['18 Jul','Nations Championship','New Zealand',40,'Ireland',21,'Eden Park'],['7 Aug','Hybrid Friendly','Stormers',21,'New Zealand',38,'DHL Stadium'],['11 Aug','Hybrid Friendly','Sharks',0,'New Zealand',54,'Hollywoodbets Kings Park'],['15 Aug','Hybrid Friendly','Bulls',19,'New Zealand',50,'Loftus Versfeld'],['22 Aug','International Rugby','South Africa',16,'New Zealand',33,'Ellis Park'],['29 Aug','International Rugby','South Africa',33,'New Zealand',26,'DHL Stadium'],['5 Sep','International Rugby','South Africa',29,'New Zealand',24,'FNB Stadium']],
    next:[['12 Sep 2026','South Africa vs New Zealand','M&T Bank Stadium','22:00'],['10 Oct 2026','New Zealand vs Australia','Eden Park','07:10'],['17 Oct 2026','Australia vs New Zealand','Accor Stadium','06:00'],['7 Nov 2026','Scotland vs New Zealand','Scottish Gas Murrayfield','14:10'],['14 Nov 2026','Wales vs New Zealand','Principality Stadium','14:10'],['21 Nov 2026','England vs New Zealand','TBC','14:10']],
    xv:[['15','Damian McKenzie'],['14','Will Jordan'],['13','Quinn Tupaea'],['12','Jordie Barrett'],['11','Josh Moorby'],['10','Ruben Love'],['9','Cam Roigard'],['8','Ardie Savea'],['7','Luke Jacobson'],['6','Tupou Vaa’i'],['5','Patrick Tuipulotu'],['4','Josh Lord'],['3','Tyrel Lomax'],['2','Codie Taylor'],['1','Ethan de Groot']],
    injuries:[['Ardie Savea','🚑','Skouerbesering','UIT vir Baltimore.'],['Quinn Tupaea','🚑','Kniebesering','UIT / nie beskikbaar vir die vierde toets nie.'],['Luke Jacobson','🚑','Elmboogbesering','UIT vir Baltimore.']],
    note:'Die laaste beskikbare XV is die 18 Julie 2026-span; die September-reeksdata word apart bygewerk volgens die jongste wedstrydbronne.'
  },
  'Ireland':{
    venue:'Aviva Stadium, Dublin', source:'https://www.rugbypass.com/teams/ireland/fixtures-results/',
    results:[['5 Feb','Six Nations','France',36,'Ireland',14,'Stade de France'],['14 Feb','Six Nations','Ireland',20,'Italy',13,'Aviva Stadium'],['21 Feb','Six Nations','England',21,'Ireland',42,'Allianz Stadium'],['6 Mar','Six Nations','Ireland',27,'Wales',17,'Aviva Stadium'],['14 Mar','Six Nations','Ireland',43,'Scotland',21,'Aviva Stadium'],['4 Jul','Nations Championship','Australia',31,'Ireland',33,'Allianz Stadium'],['11 Jul','Nations Championship','Japan',20,'Ireland',36,'McDonald Jones Stadium'],['18 Jul','Nations Championship','New Zealand',40,'Ireland',21,'Eden Park']],
    next:[['6 Nov 2026','Ireland vs Argentina','Aviva Stadium','20:10'],['14 Nov 2026','Ireland vs Fiji','Aviva Stadium','20:10'],['21 Nov 2026','Ireland vs South Africa','Aviva Stadium','16:40']],
    xv:[['15','Hugo Keenan'],['14','Robert Baloucoune'],['13','Garry Ringrose'],['12','Stuart McCloskey'],['11','Jimmy O’Brien'],['10','Sam Prendergast'],['9','Jamison Gibson-Park'],['8','Jack Conan'],['7','Josh van der Flier'],['6','Tadhg Beirne'],['5','James Ryan'],['4','Joe McCarthy'],['3','Tadhg Furlong'],['2','Dan Sheehan'],['1','Tom O’Toole']],
    injuries:[['Rob Baloucoune','🟢','Hamstring','Fiks verklaar en terug in die beginspan vir die 18 Julie-toets.']],
    note:'Die laaste beskikbare XV is die 18 Julie 2026-span teen Nieu-Seeland.'
  },
  'France':{
    venue:'Stade de France, Paris', source:'https://www.rugbypass.com/teams/france/fixtures-results/',
    results:[['5 Feb','Six Nations','France',36,'Ireland',14,'Stade de France'],['15 Feb','Six Nations','Wales',12,'France',54,'Principality Stadium'],['22 Feb','Six Nations','France',33,'Italy',8,'Stade Pierre Mauroy'],['7 Mar','Six Nations','Scotland',50,'France',40,'Scottish Gas Murrayfield'],['14 Mar','Six Nations','France',48,'England',46,'Stade de France'],['4 Jul','Nations Championship','New Zealand',34,'France',32,'One NZ Stadium'],['11 Jul','Nations Championship','Australia',26,'France',42,'Suncorp Stadium'],['18 Jul','Nations Championship','Japan',15,'France',42,'MUFG Stadium']],
    next:[['7 Nov 2026','France vs Fiji','Groupama Stadium','20:10'],['13 Nov 2026','France vs South Africa','Stade de France','20:10'],['21 Nov 2026','France vs Argentina','Stade de France','20:10']],
    xv:[['15','Matthieu Jalibert'],['14','Theo Attissogbe'],['13','Fabien Brau-Boirie'],['12','Yoram Moefana'],['11','Aaron Grandidier-Nkanang'],['10','Romain Ntamack'],['9','Maxime Lucu'],['8','Alexandre Roumat'],['7','Marko Gazzotti'],['6','Lenni Nouchi'],['5','Emmanuel Meafou'],['4','Florian Verhaeghe'],['3','Regis Montagne'],['2','Maxime Lamothe'],['1','Jefferson Poirot']],
    injuries:[], note:'Die laaste beskikbare XV is die 18 Julie 2026-span teen Japan.'
  },
  'England':{
    venue:'Allianz Stadium, London', source:'https://www.rugbypass.com/teams/england/fixtures-results/',
    results:[['7 Feb','Six Nations','England',48,'Wales',7,'Allianz Stadium'],['14 Feb','Six Nations','Scotland',31,'England',20,'Scottish Gas Murrayfield'],['21 Feb','Six Nations','England',21,'Ireland',42,'Allianz Stadium'],['7 Mar','Six Nations','Italy',23,'England',18,'Stadio Olimpico'],['14 Mar','Six Nations','France',48,'England',46,'Stade de France'],['4 Jul','Nations Championship','South Africa',45,'England',21,'Ellis Park'],['11 Jul','Nations Championship','Fiji',8,'England',73,'Hill Dickinson Stadium'],['18 Jul','Nations Championship','Argentina',24,'England',31,'Estadio Unico Madre de Ciudades']],
    next:[['8 Nov 2026','England vs Australia','Allianz Stadium','15:10'],['14 Nov 2026','England vs Japan','Allianz Stadium','16:40'],['21 Nov 2026','England vs New Zealand','TBC','14:10']],
    xv:[['15','Marcus Smith'],['14','Tommy Freeman'],['13','Henry Slade'],['12','Seb Atkinson'],['11','Immanuel Feyi-Waboso'],['10','Fin Smith'],['9','Jack van Poortvliet'],['8','Ben Earl'],['7','Guy Pepper'],['6','Ollie Chessum'],['5','George Martin'],['4','Alex Coles'],['3','Joe Heyes'],['2','Jamie George'],['1','Ellis Genge']],
    injuries:[['Will Stuart','🟢','Besering/rehab','Terugkeer na ’n beduidende besering.'],['Fin Baxter','🟢','Besering/rehab','Terug in die groep na besering.'],['Jamie George','🟡','Rehab','In rehabilitasie volgens jongste groep-opdatering.'],['Ollie Chessum','🟡','Rehab','In rehabilitasie volgens jongste groep-opdatering.']],
    note:'Die laaste beskikbare XV is die 18 Julie 2026-span teen Argentinië.'
  },
  'Scotland':{
    venue:'Scottish Gas Murrayfield, Edinburgh', source:'https://www.rugbypass.com/teams/scotland/fixtures-results/',
    results:[['7 Feb','Six Nations','Italy',18,'Scotland',15,'Stadio Olimpico'],['14 Feb','Six Nations','Scotland',31,'England',20,'Scottish Gas Murrayfield'],['21 Feb','Six Nations','Wales',23,'Scotland',26,'Principality Stadium'],['7 Mar','Six Nations','Scotland',50,'France',40,'Scottish Gas Murrayfield'],['14 Mar','Six Nations','Ireland',43,'Scotland',21,'Aviva Stadium'],['4 Jul','Nations Championship','Argentina',38,'Scotland',47,'Estadio Mario Alberto Kempes'],['11 Jul','Nations Championship','South Africa',42,'Scotland',28,'Loftus Versfeld'],['18 Jul','Nations Championship','Fiji',17,'Scotland',33,'Scottish Gas Murrayfield']],
    next:[['7 Nov 2026','Scotland vs New Zealand','Scottish Gas Murrayfield','14:10'],['15 Nov 2026','Scotland vs Australia','TBC','15:10'],['21 Nov 2026','Scotland vs Japan','TBC','14:10']],
    xv:[['15','Tom Jordan'],['14','Darcy Graham'],['13','Ollie Smith'],['12','Stafford McDowall'],['11','Duhan van der Merwe'],['10','Fergus Burke'],['9','George Horne'],['8','Gregor Brown'],['7','Freddy Douglas'],['6','Josh Bayliss'],['5','Max Williamson'],['4','Jonny Gray'],['3','D’Arcy Rae'],['2','Gregor Hiddleston'],['1','Rory Sutherland']],
    injuries:[['Elliot Millar Mills','🚑','Besering','Het die 2026-toer met ’n besering verlaat.']],
    note:'Laaste beskikbare XV: 18 Julie 2026 teen Fiji. Skotse Rugby se amptelike verslag bevestig die 33–17 oorwinning en 55 215 toeskouers.'
  },
  'Australia':{
    venue:'Optus Stadium, Perth', source:'https://www.rugbypass.com/teams/australia/fixtures-results/',
    results:[['4 Jul','Nations Championship','Australia',31,'Ireland',33,'Allianz Stadium'],['11 Jul','Nations Championship','Australia',26,'France',42,'Suncorp Stadium'],['18 Jul','Nations Championship','Australia',57,'Italy',10,'HBF Park'],['8 Aug','Internationals','Japan',32,'Australia',35,'Hanazono Rugby Stadium'],['15 Aug','Internationals','Australia',56,'Japan',17,'Queensland Country Bank Stadium'],['29 Aug','Internationals','Argentina',21,'Australia',27,'Estadio 23 de Agosto'],['5 Sep','Internationals','Argentina',28,'Australia',28,'Estadio Malvinas Argentinas']],
    next:[['27 Sep 2026','Australia vs South Africa','Optus Stadium','10:45'],['10 Oct 2026','New Zealand vs Australia','Eden Park','07:10'],['17 Oct 2026','Australia vs New Zealand','Accor Stadium','06:00'],['8 Nov 2026','England vs Australia','Allianz Stadium','15:10'],['15 Nov 2026','Scotland vs Australia','TBC','15:10'],['21 Nov 2026','Wales vs Australia','Principality Stadium','20:10']],
    xv:[['15','Tom Wright'],['14','Max Jorgensen'],['13','Joseph-Aukuso Suaalii'],['12','Len Ikitau'],['11','Filipo Daugunu'],['10','Ben Donaldson'],['9','Ryan Lonergan'],['8','Harry Wilson'],['7','Fraser McReight'],['6','Rob Valetini'],['5','Josh Canham'],['4','Jeremy Williams'],['3','Taniela Tupou'],['2','Billy Pollard'],['1','Angus Bell']],
    injuries:[['Len Ikitau','🟢','Enkel','Gekeur om terug te keer en het die tweede Argentinië-toets begin.'],['Carter Gordon','🟡','Besering','Het ’n besering in Mendoza opgedoen.']],
    note:'Die laaste beskikbare XV is die 5 September 2026-span teen Argentinië.'
  },
  'Argentina':{
    venue:'Estadio Malvinas Argentinas, Mendoza', source:'https://www.rugbypass.com/teams/argentina/fixtures-results/',
    results:[['4 Jul','Nations Championship','Argentina',38,'Scotland',47,'Estadio Mario Alberto Kempes'],['11 Jul','Nations Championship','Argentina',35,'Wales',21,'Estadio Bicentenario'],['18 Jul','Nations Championship','Argentina',24,'England',31,'Estadio Unico Madre de Ciudades'],['8 Aug','Internationals','Argentina',10,'South Africa',17,'Estadio José Amalfitani'],['29 Aug','Internationals','Argentina',21,'Australia',27,'Estadio 23 de Agosto'],['5 Sep','Internationals','Argentina',28,'Australia',28,'Estadio Malvinas Argentinas']],
    next:[['6 Nov 2026','Ireland vs Argentina','Aviva Stadium','20:10'],['14 Nov 2026','Italy vs Argentina','Stadio Luigi Ferraris','11:40'],['21 Nov 2026','France vs Argentina','Stade de France','20:10']],
    xv:[['15','Santiago Carreras'],['14','Rodrigo Isgró'],['13','Lucio Cinti Luna'],['12','Faustino Sánchez Valarolo'],['11','Ignacio Mendy'],['10','Nicolás Roger'],['9','Simón Benítez Cruz'],['8','Joaquín Moro'],['7','Guido Petti'],['6','Pablo Matera'],['5','Franco Molina'],['4','Efraín Elías'],['3','Pedro Delgado'],['2','Ignacio Ruiz'],['1','Boris Wegner']],
    injuries:[], note:'Die laaste beskikbare XV is die 5 September 2026-span teen Australië.'
  },
  'Fiji':{
    venue:'Scottish Gas Murrayfield, Edinburgh', source:'https://www.rugbypass.com/teams/fiji/fixtures-results/',
    results:[['4 Jul','Nations Championship','Fiji',24,'Wales',39,'Cardiff City Stadium'],['11 Jul','Nations Championship','Fiji',8,'England',73,'Hill Dickinson Stadium'],['18 Jul','Nations Championship','Fiji',17,'Scotland',33,'Scottish Gas Murrayfield']],
    next:[['12 Sep 2026','Fiji vs Canada','Hanazono Rugby Stadium','08:00'],['24 Oct 2026','Japan vs Fiji','Prince Chichibu Memorial Stadium','06:50'],['7 Nov 2026','France vs Fiji','Groupama Stadium','20:10'],['14 Nov 2026','Ireland vs Fiji','Aviva Stadium','20:10'],['21 Nov 2026','Italy vs Fiji','Bluenergy Stadium','16:40']],
    xv:[['15','Isaiah Armstrong-Ravula'],['14','Selestino Ravutaumada'],['13','Virimi Vakatawa'],['12','Josua Tuisova'],['11','Jiuta Wainiqolo'],['10','Caleb Muntz'],['9','Frank Lomani'],['8','Elia Canakaivata'],['7','Lekima Tagitagivalu'],['6','Pita-Gus Sowakula'],['5','Temo Mayanavanua'],['4','Isoa Nasilasila'],['3','Mesake Doge'],['2','Tevita Ikanivere'],['1','Eroni Mawi']],
    injuries:[], note:'Laaste beskikbare XV: 18 Julie 2026 teen Skotland.'
  },
  'Wales':{
    venue:'Principality Stadium, Cardiff', source:'https://www.rugbypass.com/teams/wales/fixtures-results/',
    results:[['7 Feb','Six Nations','England',48,'Wales',7,'Allianz Stadium'],['15 Feb','Six Nations','Wales',12,'France',54,'Principality Stadium'],['21 Feb','Six Nations','Wales',23,'Scotland',26,'Principality Stadium'],['6 Mar','Six Nations','Ireland',27,'Wales',17,'Aviva Stadium'],['14 Mar','Six Nations','Wales',31,'Italy',17,'Principality Stadium'],['27 Jun','Hybrid Friendly','Barbarians',31,'Wales',33,'Allianz Stadium'],['4 Jul','Nations Championship','Fiji',24,'Wales',39,'Cardiff City Stadium'],['11 Jul','Nations Championship','Argentina',35,'Wales',21,'Estadio Bicentenario'],['18 Jul','Nations Championship','South Africa',43,'Wales',0,'Hollywoodbets Kings Park']],
    next:[['7 Nov 2026','Wales vs Japan','Principality Stadium','16:40'],['14 Nov 2026','Wales vs New Zealand','Principality Stadium','14:10'],['21 Nov 2026','Wales vs Australia','Principality Stadium','20:10']],
    xv:[['15','Blair Murray'],['14','Louis Rees-Zammit'],['13','Max Llewellyn'],['12','Ben Thomas'],['11','Josh Adams'],['10','Dan Edwards'],['9','Tomos Williams'],['8','Aaron Wainwright'],['7','Jac Morgan'],['6','Alex Mann'],['5','Adam Beard'],['4','Teddy Williams'],['3','Dillon Lewis'],['2','Dewi Lake'],['1','Rhys Carre']],
    injuries:[], note:'Laaste beskikbare XV: 18 Julie 2026 teen Suid-Afrika. Die WRU het die volledige span en 23-man wedstryddag-groep bevestig.'
  }
};
function teamStatsCalc(results,name){let played=0,wins=0,losses=0,draws=0,pf=0,pa=0;for(const r of results){const home=r[2],hs=Number(r[3]),away=r[4],as=Number(r[5]);if(home!==name&&away!==name)continue;played++;const forPts=home===name?hs:as,against=home===name?as:hs;pf+=forPts;pa+=against;if(forPts>against)wins++;else if(forPts<against)losses++;else draws++;}return {played,wins,losses,draws,pointsFor:pf,pointsAgainst:pa,pointsDiff:pf-pa,avgFor:played?(pf/played).toFixed(2):'0.00',avgAgainst:played?(pa/played).toFixed(2):'0.00'};}
function teamRows(results,name){return results.filter(r=>r[2]===name||r[4]===name).map(r=>{const win=r[2]===name?r[3]>r[5]:r[5]>r[3];const draw=r[3]===r[5];return `<div class="team-table-row"><span>${esc(r[0])} • ${esc(r[1])}</span><b>${esc(r[2])} ${r[3]}–${r[5]} ${esc(r[4])}</b><span>${esc(r[6])}</span><span>${draw?'D':win?'W':'L'}</span></div>`}).join('');}
function teamNextRows(next){return next.map(r=>`<div class="team-table-row"><span>${esc(r[0])}</span><b>${esc(r[1])}</b><span>${esc(r[2])}</span><span>${esc(r[3])}</span></div>`).join('');}
function renderTeamStats(selected=''){
  const list=document.getElementById('worldTeamList'),detail=document.getElementById('teamDetail'),hero=document.querySelector('#teamstats .team-stats-hero'),head=document.querySelector('#teamstats .page-head');if(!list||!detail)return;
  const isDetail=!!selected;if(hero)hero.hidden=isDetail;if(head){const h2=head.querySelector('h2'),p=head.querySelector('p');if(h2)h2.textContent=isDetail?'SPAN STATISTIEKE':'WÊRELD TOP 10 SPANSTATISTIEKE';if(p)p.textContent=isDetail?'Volledige 2026-profiel, uitslae, laaste XV, beserings en volgende wedstryde.':'Die huidige Top 10 volgens die World Rugby-mansranglys. Kies ’n span om sy volledige profiel oop te maak.';}
  if(!isDetail){list.hidden=false;detail.hidden=true;list.innerHTML=WORLD_TOP10_TEAMS.map(t=>`<button type="button" class="world-team-bar" data-team="${esc(t.name)}"><span class="world-team-rank">#${t.rank}</span><span class="world-team-name">${teamFlagMarkup(t)} ${esc(t.display)}</span><span class="world-team-rating">${t.rating.toFixed(2)}</span></button>`).join('');return;}
  const t=WORLD_TOP10_TEAMS.find(x=>x.name===selected)||WORLD_TOP10_TEAMS[0];if(t.name==='South Africa'){/* existing Springbok profile stays exactly as approved below */}
  if(t.name==='South Africa'){
    const results=SPRINGBOK_RESULTS_2026.map(r=>`<div class="team-table-row"><span>${esc(r[0])} • ${esc(r[1])}</span><b>${esc(r[2])} ${r[3]}–${r[5]} ${esc(r[4])}</b><span>${esc(r[6])}</span><span>${r[3]>r[5]?'W':'L'}</span></div>`).join('');
    const xv=SPRINGBOK_LATEST_XV.map(r=>`<div class="team-table-row"><span>${r[0]}. ${esc(r[1])}</span><span>${r[2]} caps</span><span>${r[3]} pts</span><span>Springbok</span></div>`).join('');
    const availability=SPRINGBOK_CURRENT_AVAILABILITY.map(r=>`<div class="team-table-row"><span>${r[1]} ${esc(r[0])}</span><span>${esc(r[2])}</span><span>${esc(r[3])}</span><span>🇿🇦</span></div>`).join('');
    detail.hidden=false;list.hidden=true;detail.innerHTML=`<button type="button" class="dark-btn team-back" data-team-back="1">← TERUG NA VORIGE BLADSY</button><article class="team-stats-card"><small>WORLD RUGBY #1 • 93.39</small><h3>🇿🇦 SPRINGBOKKE</h3><p>Regerende wêreldkampioene en tans nommer 1 op die World Rugby-mansranglys.</p></article><div class="team-detail-grid"><div class="team-detail-stat"><b>${SPRINGBOK_2026_SUMMARY.played}</b><small>Wedstryde 2026</small></div><div class="team-detail-stat"><b>${SPRINGBOK_2026_SUMMARY.wins}-${SPRINGBOK_2026_SUMMARY.losses}-${SPRINGBOK_2026_SUMMARY.draws}</b><small>W–L–D</small></div><div class="team-detail-stat"><b>${SPRINGBOK_2026_SUMMARY.pointsFor}</b><small>Punte aangeteken</small></div><div class="team-detail-stat"><b>+${SPRINGBOK_2026_SUMMARY.pointsDiff}</b><small>Punte verskil</small></div><div class="team-detail-stat"><b>${SPRINGBOK_2026_SUMMARY.avgFor}</b><small>Gem. vir</small></div><div class="team-detail-stat"><b>${SPRINGBOK_2026_SUMMARY.avgAgainst}</b><small>Gem. teen</small></div><div class="team-detail-stat"><b>2–1</b><small>RGR vs NZ</small></div><div class="team-detail-stat"><b>21:00</b><small>Baltimore, 12 Sep</small></div></div><div class="team-section"><h4>🏉 2026 RESULTATE</h4><div class="team-table"><div class="team-table-row head"><span>Datum / kompetisie</span><span>Uitslag</span><span>Venue</span><span>Resultaat</span></div>${results}</div></div><div class="team-section"><h4>👥 LAASTE SPRINGBOK XV • 5 SEPTEMBER</h4><div class="team-table"><div class="team-table-row head"><span>Speler</span><span>Caps</span><span>Punte</span><span>Status</span></div>${xv}</div></div><div class="team-section"><h4>🚑 BESERINGS & BESKIKBAARHEID</h4><div class="team-table"><div class="team-table-row head"><span>Speler</span><span>Status</span><span>Besonderhede</span><span></span></div>${availability}</div></div><div class="team-section"><h4>🏆 RUGBY’S GREATEST RIVALRY • 2026</h4><div class="team-detail-grid"><div class="team-detail-stat"><b>3</b><small>Wedstryde gespeel</small></div><div class="team-detail-stat"><b>2</b><small>Bokke wen</small></div><div class="team-detail-stat"><b>1</b><small>Verloor</small></div><div class="team-detail-stat"><b>78–83</b><small>Punte in reeks</small></div><div class="team-detail-stat"><b>0</b><small>Bonus punte</small></div><div class="team-detail-stat"><b>2–1</b><small>Reeksvoorsprong</small></div><div class="team-detail-stat"><b>12 Sep</b><small>Volgende toets</small></div><div class="team-detail-stat"><b>21:00</b><small>SA-tyd</small></div></div><p class="team-note">Die finale toets is in Baltimore, VSA, op 12 September. Afskop is 21:00 SA-tyd. Daar is geen tradisionele bonuspuntstelsel in ’n vier-toets reeks nie; die reeks word op wedstryd-oorwinnings beslis.</p></div><div class="team-section"><h4>🇳🇿 HEAD-TO-HEAD: NEW ZEALAND</h4><div class="team-detail-grid"><div class="team-detail-stat"><b>${SPRINGBOK_HEAD_TO_HEAD_NZ.played}</b><small>Toetse</small></div><div class="team-detail-stat"><b>${SPRINGBOK_HEAD_TO_HEAD_NZ.wins}</b><small>SA wen</small></div><div class="team-detail-stat"><b>${SPRINGBOK_HEAD_TO_HEAD_NZ.losses}</b><small>NZ wen</small></div><div class="team-detail-stat"><b>${SPRINGBOK_HEAD_TO_HEAD_NZ.draws}</b><small>Gelykop</small></div></div></div><div class="team-section"><h4>📅 VOLGENDE WEDSTRYDE</h4><div class="team-table"><div class="team-table-row"><span>12 Sep 2026</span><b>Springboks vs New Zealand</b><span>M&T Bank Stadium</span><span>21:00</span></div><div class="team-table-row"><span>27 Sep 2026</span><b>Australia vs Springboks</b><span>Optus Stadium</span><span>09:45</span></div><div class="team-table-row"><span>7 Nov 2026</span><b>Italy vs Springboks</b><span>Estadio Camilo Cano</span><span>11:40</span></div></div></div><p class="team-note">Bronne: World Rugby/SA Rugby-ranglys, SA Rugby Match Centre en SuperSport.</p>`;return;
  }
  const d=TEAM_DETAIL_DATA[t.name];const s=teamStatsCalc(d.results,t.name);const rows=teamRows(d.results,t.name);const xv=d.xv.map(r=>`<div class="team-table-row"><span>${r[0]}. ${esc(r[1])}</span><span>${t.display}</span><span>2026</span><span>Laaste XV</span></div>`).join('');const injuries=d.injuries.length?d.injuries.map(r=>`<div class="team-table-row"><span>${r[1]} ${esc(r[0])}</span><span>${esc(r[2])}</span><span>${esc(r[3])}</span><span>${teamFlagMarkup(t)}</span></div>`).join(''):`<div class="team-table-row"><span>Geen bevestigde lys</span><span>—</span><span>Geen huidige beseringsdata in die profielbron nie.</span><span>${t.flag}</span></div>`;
  detail.hidden=false;list.hidden=true;detail.innerHTML=`<button type="button" class="dark-btn team-back" data-team-back="1">← TERUG NA WÊRELD TOP 10</button><article class="team-stats-card"><small>WORLD RUGBY #${t.rank} • ${t.rating.toFixed(2)}</small><h3>${teamFlagMarkup(t)} ${esc(t.display)}</h3><p>Huidige World Rugby-rating: <b>${t.rating.toFixed(2)}</b>. Hierdie profiel gebruik dieselfde struktuur as die Springbok-profiel.</p></article><div class="team-detail-grid"><div class="team-detail-stat"><b>${s.played}</b><small>Wedstryde in 2026-profiel</small></div><div class="team-detail-stat"><b>${s.wins}-${s.losses}-${s.draws}</b><small>W–L–D</small></div><div class="team-detail-stat"><b>${s.pointsFor}</b><small>Punte aangeteken</small></div><div class="team-detail-stat"><b>${s.pointsAgainst}</b><small>Punte afgestaan</small></div><div class="team-detail-stat"><b>${s.pointsDiff>=0?'+':''}${s.pointsDiff}</b><small>Punte verskil</small></div><div class="team-detail-stat"><b>${s.avgFor}</b><small>Gem. vir</small></div><div class="team-detail-stat"><b>${s.avgAgainst}</b><small>Gem. teen</small></div><div class="team-detail-stat"><b>${t.rating.toFixed(2)}</b><small>World Rugby-rating</small></div></div><div class="team-section"><h4>🏉 2026 RESULTATE</h4><div class="team-table"><div class="team-table-row head"><span>Datum / kompetisie</span><span>Uitslag</span><span>Venue</span><span>Resultaat</span></div>${rows}</div></div><div class="team-section"><h4>👥 LAASTE BESKIKBARE XV</h4><div class="team-table"><div class="team-table-row head"><span>Nr.</span><span>Speler</span><span>Span</span><span>Status</span></div>${xv}</div><p class="team-note">${esc(d.note)}</p></div><div class="team-section"><h4>🚑 BESERINGS & BESKIKBAARHEID</h4><div class="team-table"><div class="team-table-row head"><span>Speler</span><span>Status</span><span>Besonderhede</span><span></span></div>${injuries}</div></div><div class="team-section"><h4>📅 VOLGENDE WEDSTRYDE</h4><div class="team-table"><div class="team-table-row head"><span>Datum</span><span>Wedstryd</span><span>Venue</span><span>Tyd</span></div>${teamNextRows(d.next)}</div></div><div class="team-section"><h4>📊 SPANPROFIEL</h4><div class="team-detail-grid"><div class="team-detail-stat"><b>${t.rank}</b><small>Wêreldranglys</small></div><div class="team-detail-stat"><b>${t.rating.toFixed(2)}</b><small>World Rugby-rating</small></div><div class="team-detail-stat"><b>2022–2026</b><small>Historiese dekking</small></div><div class="team-detail-stat"><b>${t.display}</b><small>Nasionale span</small></div></div><p class="team-note">Resultate en wedstrydprogramme is saamgestel uit die beskikbare 2026 internasionale wedstryddatastelle. Speler- en beseringsdata word slegs gewys wanneer ’n huidige bron dit bevestig. <a href="${esc(d.source)}" target="_blank" rel="noopener noreferrer">OPEN WEDSTRYDARGIEF →</a></p></div>`;
}

function startLiveStats(){clearInterval(liveTimer);loadLiveStats();refreshLiveNews();liveTimer=setInterval(()=>{loadLiveStats();refreshLiveNews();loadHistoricalPlayerDirectory().catch(()=>{})},300000)}
function adminApi(path,opts={}){if(!API_URL)throw new Error('Sentrale API is nog nie in api-config.js ingestel nie.');const headers={...(opts.headers||{}),'content-type':'application/json','authorization':'Bearer '+adminToken};return fetch(API_URL.replace(/\/$/,'')+path,{...opts,headers});}
async function loadAdminCompetitions(){
  try{const r=await adminApi('/admin/competitions');const d=await r.json();if(!r.ok)throw new Error(d.message||'Kon kompetisies nie laai nie.');
    const list=$('#competitionList'),sel=$('#adminCompetitionSelect');
    if(sel)sel.innerHTML=(d.competitions||[]).map(c=>`<option value="${esc(c.roundId)}" ${c.active?'selected':''}>${esc(c.name)} — ${esc(c.roundId)}${c.active?' • AKTIEF':''}</option>`).join('')||'<option value="">Geen kompetisie nie</option>';
    if(list)list.innerHTML=(d.competitions||[]).map(c=>`<div class="admin-list-row"><div><b>${esc(c.name)}</b><small>${esc(c.roundId)}${c.description?' • '+esc(c.description):''}</small></div><span class="admin-status ${c.active?'active':''}">${c.active?'AKTIEF':'GESLUIT'}</span></div>`).join('')||'<div class="admin-note">Nog geen admin-kompetisies geskep nie.</div>';
    return d;
  }catch(e){if($('#competitionList'))$('#competitionList').innerHTML='<div class="admin-note">'+esc(e.message)+'</div>';return null}
}
async function createCompetition(){
  const roundId=$('#competitionRoundId').value.trim(),name=$('#competitionName').value.trim(),description=$('#competitionDescription').value.trim();if(!roundId||!name){$('#adminMessage').textContent='⚠️ Round ID en kompetisie naam is nodig.';return}
  try{const r=await adminApi('/admin/competitions',{method:'POST',body:JSON.stringify({roundId,name,description})});const d=await r.json();if(!r.ok)throw new Error(d.message||'Kon nie kompetisie skep nie.');$('#competitionRoundId').value='';$('#competitionName').value='';$('#competitionDescription').value='';$('#adminMessage').textContent='✓ Nuwe stemkompetisie is aktief.';await loadAdminCompetitions();await loadAdminVotes();}
  catch(e){$('#adminMessage').textContent='⚠️ '+e.message}
}
async function resetAdminVotes(){
  const round=$('#adminCompetitionSelect')?.value||'';if(!round)return; if(!confirm('Is jy seker? Alle stemme vir hierdie stemkompetisie sal permanent verwyder word.'))return;
  try{const r=await adminApi('/admin/reset-votes',{method:'POST',body:JSON.stringify({roundId:round})});const d=await r.json();if(!r.ok)throw new Error(d.message||'Kon nie stemme reset nie.');$('#resetMessage').textContent=`✓ ${d.deleted||0} stemme is vir ${round} verwyder.`;await loadAdminVotes();await loadVoteCounts();renderRankings();}
  catch(e){$('#resetMessage').textContent='⚠️ '+e.message}
}
async function loadAdminVotes(){
  const round=$('#adminCompetitionSelect')?.value||'';if(!round)return;
  try{const r=await adminApi('/admin/votes?round='+encodeURIComponent(round));const d=await r.json();if(!r.ok)throw new Error(d.message||'Kon nie stemme laai nie.');
    const summary=$('#adminVoteSummary');if(summary)summary.innerHTML=`<div><b>${d.count||0}</b><small>Totale stembriewe</small></div><div><b>15</b><small>Posisies</small></div><div><b>#1–#10</b><small>Puntestelsel</small></div>`;
    const votes=$('#adminVotes');if(!votes)return;const rows=d.votes||[];let html=`<div class="admin-vote-card"><h4>Stemlyste</h4>`;
    html+=rows.length?rows.map((v,i)=>`<details class="admin-vote-row"><summary>Stembrief #${esc(String(v.id))} • ${esc(String(v.submittedAt||''))}</summary><div class="admin-vote-grid">${POSITIONS.map(p=>`<div><b>#${p.n} ${esc(p.name)}</b><span>${(v[p.n]||[]).map((n,j)=>`${j+1}. ${esc(n)}`).join('<br>')||'—'}</span></div>`).join('')}</div></details>`).join(''):'<p class="admin-note">Geen stemme vir hierdie kompetisie nie.</p>';
    html+='</div><div class="admin-vote-card"><h4>Geaggregeerde Top 10 per posisie</h4>';
    html+=POSITIONS.map(p=>`<details class="admin-vote-row"><summary>#${p.n} ${esc(p.name)}</summary><div class="admin-ranking-mini">${(d.aggregate?.[p.n]||[]).map((x,i)=>`<div><b>${i+1}. ${esc(x.name)}</b><span>${x.points} punte • ${x.firstPlace||0} × #1 • ${x.votes||0} stemme</span></div>`).join('')||'<span>Geen data.</span>'}</div></details>`).join('');html+='</div>';votes.innerHTML=html;
  }catch(e){$('#adminVotes').innerHTML='<div class="admin-note">'+esc(e.message)+'</div>'}
}
async function loadAdminSettings(){try{const r=await adminApi('/admin/settings');const d=await r.json();if(!r.ok)throw new Error(d.message||'Kon instellings nie laai nie.');$('#adminSettings').innerHTML=(d.settings||[]).map(x=>`<div class="admin-list-row"><div><b>${esc(x.key)}</b><small>${esc(x.value)}</small></div><span>${esc(x.updatedAt||'')}</span></div>`).join('')||'<div class="admin-note">Geen backend-instellings gestoor nie.</div>'}catch(e){$('#adminSettings').innerHTML='<div class="admin-note">'+esc(e.message)+'</div>'}}
async function saveAdminSetting(){const key=$('#settingKey').value.trim(),value=$('#settingValue').value;if(!key)return;try{const r=await adminApi('/admin/settings',{method:'POST',body:JSON.stringify({settings:{[key]:value}})});const d=await r.json();if(!r.ok)throw new Error(d.message||'Kon nie instelling stoor nie.');$('#settingKey').value='';$('#settingValue').value='';$('#adminMessage').textContent='✓ Backend-instelling gestoor.';loadAdminSettings()}catch(e){$('#adminMessage').textContent='⚠️ '+e.message}}
function renderAdmin(){if(!adminToken){$('#adminLoggedOut').hidden=false;$('#adminPanel').hidden=true;return}$('#adminLoggedOut').hidden=true;$('#adminPanel').hidden=false;$('#adminCount').textContent=players.length;renderAdminTable();loadAdminCompetitions();loadAdminSettings();setTimeout(loadAdminVotes,50)}
function renderAdminTable(){const q=($('#adminSearch')?.value||'').toLowerCase();const list=players.filter(p=>!q||p.name.toLowerCase().includes(q)).slice(0,200);$('#adminTable').innerHTML=list.map((p,i)=>`<div class="admin-row"><b>${esc(p.name)}</b><span>${playerFlag(p.name,p.country)}</span><span>#${p.pos}</span><button class="dark-btn admin-del" data-i="${i}">VERWYDER</button></div>`).join('')}
async function adminLogin(){const password=$('#adminPassword').value;if(!password)return;if(!API_URL){$('#adminMessage').textContent='⚠️ Sentrale API is nog nie ingestel nie. Stel die Cloudflare Worker URL in api-config.js voordat admin-funksies gebruik word.';return}try{const r=await fetch(API_URL.replace(/\/$/,'')+'/admin/login',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({password})});const d=await r.json();if(!r.ok)throw new Error(d.message||'Ongeldige wagwoord');adminToken=d.token;localStorage.setItem('lekkerAdminToken',adminToken);$('#adminPassword').value='';$('#adminMessage').textContent='✓ Admin suksesvol aangemeld.';renderAdmin()}catch(e){$('#adminMessage').textContent='⚠️ '+e.message}}
async function addPlayer(){const name=$('#newName').value.trim(),country=$('#newCountry').value,pos=$('#newPos').value;if(!name)return;const player={name,country,pos};if(API_URL&&adminToken){try{const r=await adminApi('/admin/players',{method:'POST',body:JSON.stringify(player)});const d=await r.json();if(!r.ok)throw new Error(d.message||'Kon nie stoor nie.');players.unshift(player);saveLocalPlayers();$('#adminMessage').textContent='✓ Speler sentraal bygevoeg.'}catch(e){$('#adminMessage').textContent='⚠️ '+e.message;return}}else{players.unshift(player);saveLocalPlayers();$('#adminMessage').textContent='✓ Speler plaaslik bygevoeg.'}$('#newName').value='';renderAdmin()}

function saveLocalPlayers(){localStorage.setItem('lekkerRugbyPlayers',JSON.stringify(players))}
function loadLocalPlayers(){try{const x=JSON.parse(localStorage.getItem('lekkerRugbyPlayers'));if(Array.isArray(x)&&x.length)players=x}catch{}}
$$('[data-screen]').forEach(b=>b.addEventListener('click',()=>screen(b.dataset.screen)));
document.addEventListener('click',e=>{const back=e.target.closest('[data-team-back]');if(back){renderTeamStats('');return}const b=e.target.closest('[data-team]');if(b){screen('teamstats');renderTeamStats(b.dataset.team||'South Africa')}});
$$('[data-pred-tab]').forEach(b=>b.addEventListener('click',()=>predictorSetTab(b.dataset.predTab)));
$('#predictorRefresh')?.addEventListener('click',renderPredictor);
$('#createPool')?.addEventListener('click',()=>predictorCreateJoin('create'));
$('#joinPool')?.addEventListener('click',()=>predictorCreateJoin('join'));
document.addEventListener('click',e=>{const b=e.target.closest('.save-prediction');if(b)predictorSave(b.dataset.fixture);const p=e.target.closest('[data-pick-winner]');if(p){const id=p.dataset.pickWinner;$$(`[data-pick-winner="${CSS.escape(id)}"]`).forEach(x=>x.classList.toggle('selected',x===p));const preview=$(`[data-pred-preview="${CSS.escape(id)}"]`);const m=$(`[data-pred-margin="${CSS.escape(id)}"]`)?.value||'—';const f=predictorFixtures.find(x=>x.id===id);if(preview&&f)preview.textContent='VOORSPELLING: '+(p.dataset.winner==='home'?f.home:p.dataset.winner==='away'?f.away:'GELYKOP')+(p.dataset.winner==='draw'?'':' met '+m+' punt(e)');}const c=e.target.closest('[data-copy-pool]');if(c){const code=c.dataset.copyPool;try{navigator.clipboard?.writeText(code);$('#predictorStatus').textContent='Pool-kode: '+code}catch{prompt('Kopieer pool-kode:',code)}}const j=e.target.closest('[data-pred-tab-jump]');if(j)predictorSetTab(j.dataset.predTabJump)});

document.addEventListener('change',e=>{const s=e.target.closest('.margin-select');if(s){const id=s.dataset.predMargin;const p=$(`[data-pick-winner="${CSS.escape(id)}"].selected`);const f=predictorFixtures.find(x=>x.id===id);const preview=$(`[data-pred-preview="${CSS.escape(id)}"]`);if(p&&f&&preview)preview.textContent='VOORSPELLING: '+(p.dataset.winner==='home'?f.home:p.dataset.winner==='away'?f.away:'GELYKOP')+(p.dataset.winner==='draw'?'':' met '+(s.value||'—')+' punt(e)')}});
$('#refreshLive')?.addEventListener('click',loadLiveStats);
$('#clearVote').onclick=()=>{selections={};selectionOrder={};renderPositions();progress();$('#voteMessage').textContent=''};$('#submitVote').onclick=submit;$('#refreshResults').onclick=renderRankings;$('#closeModal').onclick=()=>$('#modal').hidden=true;$('#modal').addEventListener('click',e=>{if(e.target.id==='modal')$('#modal').hidden=true});$('#menuButton').onclick=()=>screen('more');$('#year').textContent=new Date().getFullYear();
document.addEventListener('click',e=>{const b=e.target.closest('.match-details');if(b)showMatchSummary(b.dataset.event,b.dataset.league)});
document.addEventListener('click',e=>{const tile=e.target.closest('[data-player-stats]');if(tile){openPlayerStats(tile.dataset.playerStats)}});
document.addEventListener('keydown',e=>{const tile=e.target.closest('[data-player-stats]');if(tile&&(e.key==='Enter'||e.key===' ')){e.preventDefault();openPlayerStats(tile.dataset.playerStats)}if(e.key==='Escape')closePlayerStats()});
document.addEventListener('click',e=>{if(e.target.closest('[data-player-stats-close]'))closePlayerStats()});
document.addEventListener('click',e=>{const b=e.target.closest('[data-player-country-toggle]');if(b){const key=b.dataset.playerCountryToggle,group=b.closest('.player-country-group'),drop=group?.querySelector('.player-country-dropdown');if(!group||!drop)return;const open=group.classList.toggle('is-open');b.setAttribute('aria-expanded',String(open));drop.hidden=!open;if(open)hydratePhotos(drop);}});
$('#playerSearchBtn')?.addEventListener('click',()=>{appliedPlayerSearch=($('#playerSearch')?.value||'').toLowerCase().trim();renderPlayers()});
$('#playerSearch')?.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();appliedPlayerSearch=($('#playerSearch')?.value||'').toLowerCase().trim();renderPlayers()}});$('#createCompetition')?.addEventListener('click',createCompetition);$('#resetVotes')?.addEventListener('click',resetAdminVotes);$('#refreshAdminVotes')?.addEventListener('click',loadAdminVotes);$('#adminCompetitionSelect')?.addEventListener('change',loadAdminVotes);$('#saveSetting')?.addEventListener('click',saveAdminSetting);$('#playerFilter')?.addEventListener('change',renderPlayers);$('#adminLogin')?.addEventListener('click',adminLogin);$('#adminLogout')?.addEventListener('click',()=>{adminToken='';localStorage.removeItem('lekkerAdminToken');renderAdmin()});$('#addPlayer')?.addEventListener('click',addPlayer);$('#adminSearch')?.addEventListener('input',renderAdminTable);
// Verwyder-knoppies is lokaal in hierdie MVP; sentrale delete word in die admin API beveilig.
document.addEventListener('click',e=>{if(e.target.classList.contains('admin-del')){const i=Number(e.target.dataset.i);if(Number.isFinite(i)){players.splice(i,1);saveLocalPlayers();renderAdminTable();}}});
loadLocalPlayers();loadVoteCounts().then(()=>renderPositions());progress();renderRankings();renderPlayers();renderAdmin();renderTeamStats();renderNews();loadHistoricalPlayerDirectory().catch(()=>{});startLiveStats();
if ('serviceWorker' in navigator) { window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js', {updateViaCache:'none'}).catch(()=>{})); }


/* ===== LEKKER RUGBY VOORSPEL 2.0: accounts, teams, competitions, awards ===== */
const PREDICTOR_TEAMS=[
 ['Springboks','🇿🇦','https://a.espncdn.com/i/teamlogos/rugby/500/5.png'],['All Blacks','🇳🇿','https://a.espncdn.com/i/teamlogos/rugby/500/8.png'],['Ireland','🇮🇪','https://a.espncdn.com/i/teamlogos/rugby/500/3.png'],['France','🇫🇷','https://a.espncdn.com/i/teamlogos/rugby/500/9.png'],['England','🏴','https://a.espncdn.com/i/teamlogos/rugby/500/7.png'],['Scotland','🏴','https://a.espncdn.com/i/teamlogos/rugby/500/30.png'],['Wales','🏴','https://a.espncdn.com/i/teamlogos/rugby/500/6.png'],['Australia','🇦🇺','https://a.espncdn.com/i/teamlogos/rugby/500/4.png'],['Argentina','🇦🇷','https://a.espncdn.com/i/teamlogos/rugby/500/23.png'],['Fiji','🇫🇯','https://a.espncdn.com/i/teamlogos/rugby/500/32.png'],['Samoa','🇼🇸','https://a.espncdn.com/i/teamlogos/rugby/500/26.png'],['Italy','🇮🇹','https://a.espncdn.com/i/teamlogos/rugby/500/20.png'],['Japan','🇯🇵','https://a.espncdn.com/i/teamlogos/rugby/500/29.png'],['Georgia','🇬🇪','https://a.espncdn.com/i/teamlogos/rugby/500/35.png'],['South Africa A','🇿🇦','https://a.espncdn.com/i/teamlogos/rugby/500/5.png'],['Bulls','🇿🇦','https://a.espncdn.com/i/teamlogos/rugby/500/12.png'],['Stormers','🇿🇦','https://a.espncdn.com/i/teamlogos/rugby/500/18.png'],['Sharks','🇿🇦','https://a.espncdn.com/i/teamlogos/rugby/500/15.png'],['Lions','🇿🇦','https://a.espncdn.com/i/teamlogos/rugby/500/10.png']
];
const PREDICTOR_COMPETITIONS=['Rugby Championship','Six Nations','Autumn Nations Series','World Rugby Tests','Rugby World Cup','United Rugby Championship','Super Rugby Pacific','Currie Cup','Premiership Rugby','Top 14','European Rugby Champions Cup','European Rugby Challenge Cup','Major League Rugby','Japan Rugby League One','Super Rugby Americas'];
let predictorSession=localStorage.getItem('lekkerRugbyPredictorSession')||'';
let predictorUser=null;
function predictorApi(path,opts={}){if(!API_URL)throw new Error('Sentrale API is nie ingestel nie.');opts.headers={...(opts.headers||{}),'content-type':'application/json',...(predictorSession?{authorization:'Bearer '+predictorSession}:{})};return fetch(API_URL.replace(/\/$/,'')+path,opts)}
function renderPredictorTeams(){const h=$('#predictorTeamPicker');if(!h)return;const chosen=predictorUser?.team||localStorage.getItem('lekkerRugbyPredictorTeam')||'';const map=new Map(PREDICTOR_TEAMS.map(t=>[t[0],t]));(predictorFixtures||[]).forEach(f=>{[f.home,f.away].forEach(name=>{if(name&&!map.has(name))map.set(name,[name,'🏉',''])})});h.innerHTML=[...map.values()].map(t=>`<button type="button" class="predictor-team-choice ${chosen===t[0]?'selected':''}" data-pred-team="${esc(t[0])}"><img src="${t[2]||''}" alt="" ${t[2]?'':'style="display:none"'} onerror="this.style.display='none'"><span>${t[1]} ${esc(t[0])}</span></button>`).join('')}
function setPredictorAuthUI(){const logged=!!predictorUser;$('#predictorAuthBox')?.toggleAttribute('hidden',logged);$('#predictorUserBox')?.toggleAttribute('hidden',!logged);if(logged){$('#predictorUserName').textContent=predictorUser.username||'';$('#predictorName').value=predictorUser.displayName||predictorUser.username||'';$('#predictorTeam').value=predictorUser.team||'';renderPredictorTeams();} }
async function predictorAuth(mode){const u=$('#predictorLoginName')?.value.trim(),p=$('#predictorLoginPassword')?.value;if(!u||!p){$('#predictorStatus').textContent='Voer gebruikersnaam en wagwoord in.';return}try{const r=await predictorApi('/predictor/auth',{method:'POST',body:JSON.stringify({action:mode,username:u,password:p})});const d=await r.json();if(!r.ok)throw new Error(d.message||'Aanmelding het misluk.');predictorSession=d.token;predictorUser=d.user;localStorage.setItem('lekkerRugbyPredictorSession',predictorSession);localStorage.setItem('lekkerRugbyPredictorName',predictorUser.displayName||predictorUser.username);localStorage.setItem('lekkerRugbyPredictorTeam',predictorUser.team||'');$('#predictorLoginPassword').value='';setPredictorAuthUI();$('#predictorStatus').textContent='✓ Jy is aangemeld as '+predictorUser.username;await renderPredictor()}catch(e){$('#predictorStatus').textContent='⚠️ '+e.message}}
async function predictorLoadUser(){if(!predictorSession){setPredictorAuthUI();return}try{const r=await predictorApi('/predictor/me');const d=await r.json();if(!r.ok)throw new Error('expired');predictorUser=d.user;setPredictorAuthUI()}catch(e){predictorSession='';predictorUser=null;localStorage.removeItem('lekkerRugbyPredictorSession');setPredictorAuthUI()}}
async function predictorSaveProfile(){if(!predictorSession)return;const displayName=$('#predictorName')?.value.trim(),team=$('#predictorTeam')?.value.trim();try{const r=await predictorApi('/predictor/me',{method:'POST',body:JSON.stringify({displayName,team})});const d=await r.json();if(r.ok){predictorUser=d.user;localStorage.setItem('lekkerRugbyPredictorName',displayName);localStorage.setItem('lekkerRugbyPredictorTeam',team);setPredictorAuthUI()}}catch(e){}}
function populatePredictorCompetitions(){const s=$('#predictorCompetition');if(!s)return;const leagues=new Set(PREDICTOR_COMPETITIONS);(predictorFixtures||[]).forEach(f=>{if(f.league)leagues.add(f.league)});const old=s.value||'all';s.innerHTML='<option value="all">Alle kompetisies</option>'+[...leagues].sort().map(x=>`<option value="${esc(x)}">${esc(x)}</option>`).join('');s.value=[...leagues].includes(old)?old:'all'}
function filterPredictorFixtures(){const c=$('#predictorCompetition')?.value||'all';if(c==='all')return predictorFixtures;return predictorFixtures.filter(f=>String(f.league||'').toLowerCase()===c.toLowerCase())}
function renderPredictorGamesFiltered(){const old=predictorFixtures;predictorFixtures=filterPredictorFixtures();predictorRenderGames();predictorFixtures=old}
function renderPredictorLeaderboardAwards(){const h=$('#predictorLeaderboard');if(!h)return;const pool=predictorPool();const rows=[];for(const m of predictorMembers){const ps=(predictorPredictions||[]).filter(x=>x.pool===pool&&x.deviceId===m.deviceId);let total=0,played=0,wins=0,margins=0,bonus=0;for(const p of ps){const f=predictorFixtures.find(x=>x.id===p.fixtureId);if(!f)continue;const z=predPoints(p,f,predictorPredictions.filter(x=>x.pool===pool&&x.fixtureId===p.fixtureId));total+=z.points;played+=z.played?1:0;wins+=z.win;margins+=z.margin;bonus+=z.bonus}rows.push({name:m.nickname||'Speler',total,played,wins,margins,bonus})}rows.sort((a,b)=>b.total-a.total||b.wins-a.wins||a.name.localeCompare(b.name));const leader=rows[0],last=rows.length>1?rows[rows.length-1]:null;h.innerHTML=`<h3>🏆 POOL: ${esc(pool)}</h3><p class="predictor-note">${rows.length} speler${rows.length===1?'':'s'} • ranglys volgens jou gekose kompetisie/pool.</p>${rows.map((r,i)=>`<div class="predictor-rank"><strong>#${i+1}</strong><span><b>${esc(r.name)}</b>${leader===r?'<span class="predictor-badge predictor-cap">🏉 CAP</span>':''}${last===r?'<span class="predictor-badge predictor-spoon">🥄 WOODEN SPOON</span>':''}<small class="votes">${r.played} klaar • ${r.wins} regte wenners • ${r.margins} marge-punte • ${r.bonus} bonus</small></span><strong>${r.total.toFixed(1)}</strong></div>`).join('')||'<p class="votes">Geen voorspellers in hierdie pool nie.</p>'}`}
// Voting search buttons: only filter after clicking, with Enter support.
function applyVoteSearch(pos){const inp=$(`.position-player-search[data-pos="${CSS.escape(String(pos))}"]`);const q=(inp?.value||'').toLowerCase().trim();$$(`#positions .player-list[data-pos="${CSS.escape(String(pos))}"] .player-option`).forEach(row=>{row.style.display=(!q||row.textContent.toLowerCase().includes(q))?'flex':'none'})}
document.addEventListener('click',e=>{const b=e.target.closest('[data-vote-search]');if(b)applyVoteSearch(b.dataset.voteSearch);const t=e.target.closest('[data-pred-team]');if(t){const name=t.dataset.predTeam;$('#predictorTeam').value=name;localStorage.setItem('lekkerRugbyPredictorTeam',name);$$('[data-pred-team]').forEach(x=>x.classList.toggle('selected',x===t));predictorSaveProfile()} });
document.addEventListener('keydown',e=>{const i=e.target.closest('.position-player-search');if(i&&e.key==='Enter'){e.preventDefault();applyVoteSearch(i.dataset.pos)}});
$('#predictorRegister')?.addEventListener('click',()=>predictorAuth('register'));$('#predictorLogin')?.addEventListener('click',()=>predictorAuth('login'));$('#predictorLogout')?.addEventListener('click',()=>{predictorSession='';predictorUser=null;localStorage.removeItem('lekkerRugbyPredictorSession');setPredictorAuthUI();$('#predictorStatus').textContent='Jy is uitgeteken.'});$('#predictorCompetition')?.addEventListener('change',()=>{renderPredictorGamesFiltered();renderPredictorLeaderboardAwards()});
const _oldPredictorFetchData=predictorFetchData;predictorFetchData=async function(){await _oldPredictorFetchData();populatePredictorCompetitions();if(predictorUser&&predictorUser.team)$('#predictorTeam').value=predictorUser.team};
const _oldRenderPredictor=renderPredictor;renderPredictor=async function(){await predictorLoadUser();await _oldRenderPredictor();populatePredictorCompetitions();setPredictorAuthUI();renderPredictorGamesFiltered();renderPredictorLeaderboardAwards()};

/* Final predictor UX overrides: Pool Naam on create, join by shared code, and competition-scoped play. */
function predictorSelectedCompetition(){return $('#predictorCompetition')?.value||localStorage.getItem('lekkerRugbyPredictorCompetition')||'all'}
async function predictorCreateJoin(mode){
  if(!predictorSession){$('#predictorStatus').textContent='Skep eers jou eie login en teken in.';return}
  const nickname=($('#predictorName')?.value.trim()||predictorUser?.displayName||'Speler');
  if(mode==='create'){
    const poolName=($('#predictorPool')?.value.trim()||'');
    if(!poolName){$('#predictorStatus').textContent='Gee jou pool ’n naam.';return}
    try{
      const r=await predictorApi('/predictor/pools',{method:'POST',body:JSON.stringify({action:'create',nickname,deviceId:predictorUser.username,poolName,name:poolName,competition:predictorSelectedCompetition()})});
      const d=await r.json();if(!r.ok)throw new Error(d.message||'Pool kon nie geskep word nie.');
      localStorage.setItem('lekkerRugbyPredictorPool',d.code);localStorage.setItem('lekkerRugbyPredictorPoolName',d.name||poolName);
      $('#predictorPool').value=d.name||poolName;$('#predictorStatus').innerHTML='✓ Pool geskep: <b>'+esc(d.name||poolName)+'</b> • Deel kode <b>'+esc(d.code)+'</b> met jou vriende.';await renderPredictor();return
    }catch(e){$('#predictorStatus').textContent='⚠️ '+e.message;return}
  }
  const code=prompt('Voer die pool-kode in om aan te sluit:','');if(!code)return;
  try{
    const r=await predictorApi('/predictor/pools',{method:'POST',body:JSON.stringify({action:'join',nickname,deviceId:predictorUser.username,code:code.trim().toUpperCase(),competition:predictorSelectedCompetition()})});
    const d=await r.json();if(!r.ok)throw new Error(d.message||'Pool kon nie gevind word nie.');
    localStorage.setItem('lekkerRugbyPredictorPool',d.code);localStorage.setItem('lekkerRugbyPredictorPoolName',d.name||d.code);
    $('#predictorPool').value=d.name||d.code;$('#predictorStatus').innerHTML='✓ Jy is by <b>'+esc(d.name||d.code)+'</b> • kode: <b>'+esc(d.code)+'</b>';await renderPredictor();return
  }catch(e){$('#predictorStatus').textContent='⚠️ '+e.message}
}
const _predRenderPredictorGames=predictorRenderGames;
predictorRenderGames=function(){const c=predictorSelectedCompetition();localStorage.setItem('lekkerRugbyPredictorCompetition',c);const old=predictorFixtures;predictorFixtures=c==='all'?old:old.filter(f=>String(f.league||'').toLowerCase()===c.toLowerCase());_predRenderPredictorGames();predictorFixtures=old}
const _predRenderPredictorFinal=renderPredictor;
renderPredictor=async function(){await _predRenderPredictorFinal();const name=localStorage.getItem('lekkerRugbyPredictorPoolName')||predictorPool();if($('#predictorPool'))$('#predictorPool').value=name;renderPredictorTeams();populatePredictorCompetitions();if($('#predictorCompetition'))$('#predictorCompetition').value=predictorSelectedCompetition();}
