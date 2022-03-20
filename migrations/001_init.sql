CREATE TABLE players_raw (
    name    TEXT PRIMARY KEY,
    elo     INT DEFAULT 1200
);

CREATE TABLE games_raw (
    id              SERIAL PRIMARY KEY,
    timestamp       TIMESTAMP DEFAULT NOW(),
    
    player1         TEXT NOT NULL REFERENCES players_raw(name),
    player2         TEXT NOT NULL REFERENCES players_raw(name),
    player1_score   INT NOT NULL,
    player2_score   INT NOT NULL,

    CONSTRAINT player_uniqueness CHECK (player1 <> player2),
    CONSTRAINT score_uniqueness  CHECK (player1_score <> player2_score)
);
