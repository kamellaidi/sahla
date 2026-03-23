-- ============================================================
-- SAHLA — Script SQL Supabase
-- Colle ce script dans : Dashboard → SQL Editor → New Query → Run
-- ============================================================

-- ============================================================
-- TABLES
-- ============================================================

CREATE TABLE mots (
  id          SERIAL PRIMARY KEY,
  mot_arabizi TEXT NOT NULL,
  slug        TEXT UNIQUE NOT NULL,
  traduction_fr TEXT NOT NULL,
  traduction_en TEXT,
  categorie   TEXT,
  exemple_arabizi TEXT,
  exemple_fr  TEXT,
  notes       TEXT,
  source      TEXT DEFAULT 'Manuel',
  verb_id     TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE verbes (
  id           SERIAL PRIMARY KEY,
  verb_id      TEXT UNIQUE NOT NULL,
  verbe_arabizi TEXT NOT NULL,
  sens_fr      TEXT NOT NULL
);

CREATE TABLE conjugaisons (
  id      SERIAL PRIMARY KEY,
  verb_id TEXT REFERENCES verbes(verb_id) ON DELETE CASCADE,
  temps   TEXT NOT NULL CHECK (temps IN ('Passé', 'Présent', 'Impératif')),
  ana     TEXT,
  nta     TEXT,
  nti     TEXT,
  howa    TEXT,
  hiya    TEXT,
  hna     TEXT,
  ntouma  TEXT,
  houma   TEXT,
  UNIQUE (verb_id, temps)
);

CREATE TABLE dialogues (
  id             SERIAL PRIMARY KEY,
  dial_id        TEXT UNIQUE NOT NULL,
  theme          TEXT NOT NULL,
  theme_slug     TEXT NOT NULL,
  sous_theme     TEXT,
  phrase_arabizi TEXT NOT NULL,
  traduction_fr  TEXT NOT NULL,
  mot_a_mot      TEXT,
  contexte       TEXT
);

CREATE TABLE grammaire (
  id              SERIAL PRIMARY KEY,
  theme           TEXT NOT NULL,
  theme_slug      TEXT NOT NULL,
  regle           TEXT NOT NULL,
  explication     TEXT,
  exemple_arabizi TEXT,
  exemple_fr      TEXT,
  notes           TEXT
);

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX idx_mots_slug       ON mots(slug);
CREATE INDEX idx_mots_categorie  ON mots(categorie);
CREATE INDEX idx_mots_verb_id    ON mots(verb_id);
CREATE INDEX idx_mots_search     ON mots USING gin(
  to_tsvector('simple', mot_arabizi || ' ' || traduction_fr)
);
CREATE INDEX idx_conj_verb       ON conjugaisons(verb_id);
CREATE INDEX idx_dial_theme      ON dialogues(theme_slug);
CREATE INDEX idx_gram_theme      ON grammaire(theme_slug);

-- ============================================================
-- RLS — Lecture publique (Phase 1, pas d'auth)
-- ============================================================

ALTER TABLE mots         ENABLE ROW LEVEL SECURITY;
ALTER TABLE verbes       ENABLE ROW LEVEL SECURITY;
ALTER TABLE conjugaisons ENABLE ROW LEVEL SECURITY;
ALTER TABLE dialogues    ENABLE ROW LEVEL SECURITY;
ALTER TABLE grammaire    ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read" ON mots         FOR SELECT USING (true);
CREATE POLICY "Public read" ON verbes       FOR SELECT USING (true);
CREATE POLICY "Public read" ON conjugaisons FOR SELECT USING (true);
CREATE POLICY "Public read" ON dialogues    FOR SELECT USING (true);
CREATE POLICY "Public read" ON grammaire    FOR SELECT USING (true);
