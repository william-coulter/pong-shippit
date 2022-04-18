CREATE TABLE players_raw (
    name    TEXT PRIMARY KEY,
    elo     INT DEFAULT 1600
);

CREATE TABLE games_raw (
    id              SERIAL PRIMARY KEY,
    timestamp       TIMESTAMP DEFAULT NOW(),

    player1         TEXT NOT NULL REFERENCES players_raw(name),
    player2         TEXT NOT NULL REFERENCES players_raw(name),
    player1_score   INT NOT NULL,
    player2_score   INT NOT NULL,

    player1_elo_change INT,
    player2_elo_change INT,

    CONSTRAINT player_uniqueness CHECK (player1 <> player2),
    CONSTRAINT score_uniqueness  CHECK (player1_score <> player2_score)
);

CREATE VIEW games (id, timestamp, winner, loser, winning_score, losing_score, winning_elo_change, losing_elo_change) AS
    WITH winners (id, is_player1) AS (
        SELECT id, player1_score > player2_score
        FROM games_raw
    )
    SELECT g.id, g.timestamp,
    CASE
        WHEN w.is_player1 IS TRUE THEN g.player1
        ELSE g.player2
    END winner,
    CASE
        WHEN w.is_player1 IS TRUE THEN g.player2
        ELSE g.player1
    END loser,
    CASE
        WHEN w.is_player1 IS TRUE THEN g.player1_score
        ELSE g.player2_score
    END winning_score,
    CASE
        WHEN w.is_player1 IS TRUE THEN g.player2_score
        ELSE g.player1_score
    END losing_score,
    CASE
        WHEN w.is_player1 IS TRUE THEN g.player1_elo_change
        ELSE g.player2_elo_change
    END winning_elo_change,
    CASE
        WHEN w.is_player1 IS TRUE THEN g.player2_elo_change
        ELSE g.player1_elo_change
    END losing_elo_change
    FROM games_raw g
    JOIN winners w ON w.id = g.id;

CREATE VIEW leaderboard (name, elo, games, wins, losses) AS
    SELECT p.name, p.elo,
        COUNT(g.id) games,
        SUM((p.name = g.winner)::INT) wins,
        SUM((p.name = g.loser)::INT) losses
    FROM players_raw p
    JOIN games g ON p.name = g.winner OR p.name = g.loser
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


-- Responsible for 2 changes:
--  1. Updates players' elos as a result of the new game
--  2. Marks players' elos change as a result of the new game
CREATE OR REPLACE FUNCTION new_game_trigger_fn()
    RETURNS TRIGGER
    LANGUAGE plpgsql
AS $$
DECLARE
    player1_old_elo INT;
    player2_old_elo INT;
BEGIN
    SELECT elo INTO player1_old_elo FROM players_raw
        WHERE name = NEW.player1;

    SELECT elo INTO player2_old_elo FROM players_raw
        WHERE name = NEW.player2;

    -- 1.
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

    -- 2.
    WITH p1(elo) AS (
        SELECT elo FROM players_raw WHERE name = NEW.player1
    ),
    p2(elo) AS (
        SELECT elo FROM players_raw WHERE name = NEW.player2
    )
    UPDATE games_raw
    SET
      player1_elo_change = (SELECT elo FROM p1) - player1_old_elo,
      player2_elo_change = (SELECT elo FROM p2) - player2_old_elo
    WHERE id = NEW.id;

    RETURN NEW;
END;
$$;

CREATE TRIGGER new_game_trigger
   AFTER INSERT
   ON games_raw
   FOR EACH ROW
       EXECUTE PROCEDURE new_game_trigger_fn();
