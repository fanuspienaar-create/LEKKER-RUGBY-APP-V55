CREATE TABLE IF NOT EXISTS players (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  country TEXT NOT NULL,
  position INTEGER NOT NULL,
  active INTEGER NOT NULL DEFAULT 1,
  UNIQUE(name,country,position)
);
CREATE TABLE IF NOT EXISTS votes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  round_id TEXT NOT NULL,
  ip_hash TEXT NOT NULL,
  submitted_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  pos_1 TEXT NOT NULL,pos_2 TEXT NOT NULL,pos_3 TEXT NOT NULL,pos_4 TEXT NOT NULL,pos_5 TEXT NOT NULL,
  pos_6 TEXT NOT NULL,pos_7 TEXT NOT NULL,pos_8 TEXT NOT NULL,pos_9 TEXT NOT NULL,pos_10 TEXT NOT NULL,
  pos_11 TEXT NOT NULL,pos_12 TEXT NOT NULL,pos_13 TEXT NOT NULL,pos_14 TEXT NOT NULL,pos_15 TEXT NOT NULL,
  UNIQUE(round_id,ip_hash)
);
CREATE INDEX IF NOT EXISTS votes_round_idx ON votes(round_id);

-- V2: each voter ranks a personal Top 10 for every position.
CREATE TABLE IF NOT EXISTS votes_v2 (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  round_id TEXT NOT NULL,
  ip_hash TEXT NOT NULL,
  submitted_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  pos_1 TEXT NOT NULL,pos_2 TEXT NOT NULL,pos_3 TEXT NOT NULL,pos_4 TEXT NOT NULL,pos_5 TEXT NOT NULL,
  pos_6 TEXT NOT NULL,pos_7 TEXT NOT NULL,pos_8 TEXT NOT NULL,pos_9 TEXT NOT NULL,pos_10 TEXT NOT NULL,
  pos_11 TEXT NOT NULL,pos_12 TEXT NOT NULL,pos_13 TEXT NOT NULL,pos_14 TEXT NOT NULL,pos_15 TEXT NOT NULL,
  UNIQUE(round_id,ip_hash)
);
CREATE INDEX IF NOT EXISTS votes_v2_round_idx ON votes_v2(round_id);

-- Match archive for live/history statistics and venue records.
CREATE TABLE IF NOT EXISTS rugby_matches (
  event_id TEXT PRIMARY KEY,
  league_id TEXT,
  league_name TEXT,
  played_at TEXT,
  status TEXT,
  home_team TEXT,
  away_team TEXT,
  home_score INTEGER,
  away_score INTEGER,
  venue TEXT,
  venue_city TEXT,
  attendance INTEGER,
  neutral_site INTEGER DEFAULT 0,
  raw_json TEXT,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS rugby_matches_date_idx ON rugby_matches(played_at);
CREATE INDEX IF NOT EXISTS rugby_matches_home_idx ON rugby_matches(home_team);
CREATE INDEX IF NOT EXISTS rugby_matches_away_idx ON rugby_matches(away_team);


-- LEKKER Rugby Voorspel: private pools and score predictions.
CREATE TABLE IF NOT EXISTS predictor_pools (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS predictor_members (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  pool_id INTEGER NOT NULL,
  device_id TEXT NOT NULL,
  nickname TEXT NOT NULL,
  joined_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(pool_id,device_id),
  FOREIGN KEY(pool_id) REFERENCES predictor_pools(id)
);
CREATE TABLE IF NOT EXISTS predictor_predictions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  pool_id INTEGER NOT NULL,
  device_id TEXT NOT NULL,
  nickname TEXT NOT NULL,
  fixture_id TEXT NOT NULL,
  league TEXT NOT NULL,
  match_date TEXT NOT NULL,
  home_team TEXT NOT NULL,
  away_team TEXT NOT NULL,
  venue TEXT,
  pred_home INTEGER NOT NULL,
  pred_away INTEGER NOT NULL,
  saved_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(pool_id,device_id,fixture_id),
  FOREIGN KEY(pool_id) REFERENCES predictor_pools(id)
);
CREATE INDEX IF NOT EXISTS predictor_predictions_pool_idx ON predictor_predictions(pool_id);
CREATE INDEX IF NOT EXISTS predictor_predictions_fixture_idx ON predictor_predictions(fixture_id);

-- Admin-managed voting competitions and settings.
CREATE TABLE IF NOT EXISTS voting_competitions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  round_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  active INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS voting_competitions_active_idx ON voting_competitions(active);
CREATE TABLE IF NOT EXISTS app_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- LEKKER Rugby Voorspel accounts, favourite teams, competitions and sessions.
CREATE TABLE IF NOT EXISTS predictor_users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  password_salt TEXT NOT NULL,
  display_name TEXT NOT NULL,
  favourite_team TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS predictor_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  token_hash TEXT NOT NULL UNIQUE,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES predictor_users(id)
);
CREATE INDEX IF NOT EXISTS predictor_sessions_user_idx ON predictor_sessions(user_id);
CREATE INDEX IF NOT EXISTS predictor_sessions_expiry_idx ON predictor_sessions(expires_at);
