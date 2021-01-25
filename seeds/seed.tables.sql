BEGIN;

TRUNCATE
  "word",
  "language",
  "user";

INSERT INTO "user" ("id", "username", "name", "password")
VALUES
  (
    1,
    'admin',
    'Dunder Mifflin Admin',
    -- password = "pass"
    '$2a$10$fCWkaGbt7ZErxaxclioLteLUgg4Q3Rp09WW0s/wSLxDKYsaGYUpjG'
  );

INSERT INTO "language" ("id", "name", "user_id")
VALUES
  (1, 'Dutch', 1);

INSERT INTO "word" ("id", "language_id", "original", "translation", "next")
VALUES
  -- Time to insert my words
  (1, 1, 'hoi', 'hi', 2),
  (2, 1, 'appel', 'apple', 3),
  (3, 1, 'melk', 'milk', 4),
  (4, 1, 'wijn', 'wine', 5),
  (5, 1, 'goedenavond', 'good evening', 6),
  (6, 1, 'bier', 'beer', 7),
  (7, 1, 'alstublieft', 'please', 8),
  (8, 1, 'kaas', 'cheese', 9),
  (9, 1, 'aardappel', 'potato', null);

UPDATE "language" SET head = 1 WHERE id = 1;

-- because we explicitly set the id fields
-- update the sequencer for future automatic id setting
SELECT setval('word_id_seq', (SELECT MAX(id) from "word"));
SELECT setval('language_id_seq', (SELECT MAX(id) from "language"));
SELECT setval('user_id_seq', (SELECT MAX(id) from "user"));

COMMIT;
