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

CREATE VIEW games (id, timestamp, player1, player2, player1_score, player2_score, winner) AS
    SELECT *, 
    CASE 
        WHEN player1_score > player2_score THEN player1
        ELSE player2
    END winner
    FROM games_raw;

CREATE VIEW leaderboard (name, elo, games, wins, losses) AS
    SELECT p.name, p.elo,
        COUNT(g.id) games,
        SUM((p.name = g.winner)::INT) wins,
        SUM((p.name <> g.winner)::INT) losses
    FROM players_raw p
    JOIN games g ON p.name = g.player1 OR p.name = g.player2
    GROUP BY p.name, p.elo
    ORDER BY elo DESC;

-- See https://en.wikipedia.org/wiki/Elo_rating_system#:~:text=FIDE%20uses%20the%20following%20ranges
-- For K-Factor ranges
CREATE VIEW player_k_factors (name, k) AS
    SELECT sub.name,
    CASE
        WHEN games_count < 30 AND elo < 2300 THEN 40
        WHEN games_count >= 30 AND elo >= 2400 THEN 10
        ELSE 20
    END k
    FROM
       (SELECT p.name, p.elo, COUNT(g.*) games_count
        FROM players_raw p
        LEFT JOIN games_raw g ON g.player1 = p.name OR g.player2 = p.name
        GROUP BY p.name, p.elo) sub;

-- See https://en.wikipedia.org/wiki/Elo_rating_system#:~:text=Supposing%20player%C2%A0A,player%27s%20rating%20is
-- for calculation logic and variable names
CREATE OR REPLACE FUNCTION calculate_elo(
    the_player_name 	TEXT,
    the_opponent        TEXT,
    the_game_id         INT8,
    is_winner           BOOLEAN -- S_A
) RETURNS INT
AS
$$
DECLARE
    the_K_factor       INT; -- K
    the_current_elo    INT; -- R_A
    the_opponent_elo   INT; -- R_B
BEGIN
    -- Validation
    IF (SELECT COUNT(*) FROM games_raw
          JOIN players_raw p1 ON p1.name = the_player_name
          JOIN players_raw p2 ON p2.name = the_opponent
          WHERE id = the_game_id
        ) = 0
    THEN
        RAISE 'game with id % does not exist with players % (winner: %) and %', the_game_id, the_player_name, is_winner, the_opponent;
    END IF;

    -- Retrieve variables
    SELECT k INTO the_k_factor FROM player_k_factors WHERE name = the_player_name;
    SELECT elo INTO the_current_elo FROM players_raw WHERE name = the_player_name;
    SELECT elo INTO the_opponent_elo FROM players_raw WHERE name = the_opponent;

    -- Calculate elo
    RETURN ROUND(
        -- Players score 1 for a win and 0 for a loss (the numeric equivalent of is_winner::INT)
        the_current_elo + the_K_factor * (is_winner::INT - 
            -- S_A (expected score)
            1::NUMERIC(16) / (1 + POWER(10, (the_opponent_elo - the_current_elo)::NUMERIC(16) / 400))
        )
    );
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION new_game_trigger_fn()
    RETURNS TRIGGER
    LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE players_raw
    SET	elo = calculate_elo(
        NEW.player1,
        NEW.player2,
        NEW.id,
        NEW.player1_score > NEW.player2_score
    ) WHERE name = NEW.player1;
    
    UPDATE players_raw
    SET	elo = calculate_elo(
        NEW.player2,
        NEW.player1,
        NEW.id,
        NEW.player2_score > NEW.player1_score
    ) WHERE name = NEW.player2;
    
    RETURN NEW;
END;
$$;

CREATE TRIGGER new_game_trigger
   AFTER INSERT
   ON games_raw
   FOR EACH ROW
       EXECUTE PROCEDURE new_game_trigger_fn();
