-- ============================================================
-- TaskForge — Schéma PostgreSQL (MPD, documentation/database-mcd-mld.html)
-- Chargé automatiquement au premier démarrage du conteneur
-- (docker-entrypoint-initdb.d). Ordre : roles → users → tickets → comments
-- ============================================================

-- ---------- ROLES ----------
CREATE TABLE roles (
  id          SERIAL       PRIMARY KEY,
  name        VARCHAR(50)  NOT NULL UNIQUE,
  description TEXT,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT now()
);

-- Rôles imposés par le cahier des charges (§4)
INSERT INTO roles (name, description) VALUES
  ('utilisateur', 'Crée des tickets et suit leur avancement'),
  ('technicien',  'Résout les tickets qui lui sont assignés'),
  ('admin',       'Gère tout : utilisateurs, tickets, configuration');

-- ---------- USERS ----------
CREATE TABLE users (
  id            SERIAL       PRIMARY KEY,
  name          VARCHAR(100) NOT NULL,
  email         VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,  -- bcrypt, jamais en clair (RG6)
  role_id       INTEGER      NOT NULL REFERENCES roles(id),
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ
);

-- ---------- TICKETS ----------
CREATE TABLE tickets (
  id          SERIAL       PRIMARY KEY,
  title       VARCHAR(200) NOT NULL,
  description TEXT         NOT NULL,
  priority    VARCHAR(10)  NOT NULL CHECK (priority IN
                ('basse', 'moyenne', 'haute', 'critique')),
  status      VARCHAR(15)  NOT NULL DEFAULT 'ouvert' CHECK (status IN
                ('ouvert', 'en_cours', 'resolu', 'ferme')),
  creator_id  INTEGER      NOT NULL REFERENCES users(id),
  assignee_id INTEGER      REFERENCES users(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT now(),
  resolved_at TIMESTAMPTZ,  -- renseigné au passage en 'resolu' (RG4)
  updated_at  TIMESTAMPTZ
);

-- ---------- COMMENTS ----------
CREATE TABLE comments (
  id         SERIAL      PRIMARY KEY,
  ticket_id  INTEGER     NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
  author_id  INTEGER     NOT NULL REFERENCES users(id),
  content    TEXT        NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------- INDEX (filtrage / tri / recherche — §3 du CDC) ----------
CREATE INDEX idx_tickets_status    ON tickets (status);
CREATE INDEX idx_tickets_priority  ON tickets (priority);
CREATE INDEX idx_tickets_assignee  ON tickets (assignee_id);
CREATE INDEX idx_tickets_created   ON tickets (created_at DESC);
CREATE INDEX idx_comments_ticket   ON comments (ticket_id);

-- Recherche textuelle titre + description : trigrammes
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX idx_tickets_search ON tickets
  USING gin ((title || ' ' || description) gin_trgm_ops);

-- ---------- TRIGGER updated_at ----------
CREATE OR REPLACE FUNCTION set_updated_at() RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated   BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_tickets_updated BEFORE UPDATE ON tickets
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
