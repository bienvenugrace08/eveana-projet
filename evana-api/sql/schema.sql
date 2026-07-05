-- =====================================================================
-- EVANA - Schéma de base de données MySQL
-- Correspond exactement aux entités TypeORM du backend NestJS (src/**/entities)
-- Compatible MySQL 8.0+
--
-- Import :
--   mysql -u root -p < schema.sql
-- =====================================================================

CREATE DATABASE IF NOT EXISTS evana_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE evana_db;

SET FOREIGN_KEY_CHECKS = 0;

-- ---------------------------------------------------------------------
-- Table : users
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id`         CHAR(36)      NOT NULL DEFAULT (UUID()),
  `username`   VARCHAR(100)  NOT NULL,
  `email`      VARCHAR(150)  NOT NULL,
  `password`   VARCHAR(255)  NOT NULL COMMENT 'Hash bcrypt, jamais le mot de passe en clair',
  `phone`      VARCHAR(30)   NULL,
  `role`       ENUM('admin','user') NOT NULL DEFAULT 'user',
  `created_at` DATETIME(6)   NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` DATETIME(6)   NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_users_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- Table : events
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `events`;
CREATE TABLE `events` (
  `id`                CHAR(36)       NOT NULL DEFAULT (UUID()),
  `name`              VARCHAR(150)   NOT NULL,
  `description`       TEXT           NOT NULL,
  `date`              DATE           NOT NULL,
  `location`          VARCHAR(150)   NOT NULL,
  `image`             VARCHAR(500)   NULL,
  `category`          ENUM('music','concert','festival','workshop','other') NOT NULL DEFAULT 'music',
  `tickets_available` INT            NOT NULL DEFAULT 0,
  `tickets_price`     DECIMAL(10,2)  NOT NULL DEFAULT 0.00,
  `status`            ENUM('upcoming','ongoing','completed','cancelled') NOT NULL DEFAULT 'upcoming',
  `created_at`        DATETIME(6)    NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at`        DATETIME(6)    NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  KEY `idx_events_date` (`date`),
  KEY `idx_events_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- Table : artists
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `artists`;
CREATE TABLE `artists` (
  `id`         CHAR(36)     NOT NULL DEFAULT (UUID()),
  `name`       VARCHAR(150) NOT NULL,
  `bio`        TEXT         NOT NULL,
  `image`      VARCHAR(500) NULL,
  `created_at` DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- Table : artist_genres (1 artiste -> N genres musicaux, relation normalisée)
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `artist_genres`;
CREATE TABLE `artist_genres` (
  `id`        CHAR(36)    NOT NULL DEFAULT (UUID()),
  `genre`     VARCHAR(80) NOT NULL,
  `artist_id` CHAR(36)    NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_artist_genres_artist` (`artist_id`),
  CONSTRAINT `fk_artist_genres_artist`
    FOREIGN KEY (`artist_id`) REFERENCES `artists` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- Table : tickets
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `tickets`;
CREATE TABLE `tickets` (
  `id`             CHAR(36)      NOT NULL DEFAULT (UUID()),
  `event_id`       CHAR(36)      NOT NULL,
  `user_id`        CHAR(36)      NULL COMMENT 'NULL si achat sans compte',
  `buyer_name`     VARCHAR(150)  NOT NULL,
  `buyer_email`    VARCHAR(150)  NOT NULL,
  `buyer_phone`    VARCHAR(30)   NULL,
  `ticket_type`    ENUM('early','standard') NOT NULL DEFAULT 'early',
  `quantity`       INT           NOT NULL DEFAULT 1,
  `total_price`    DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `notes`          TEXT          NULL,
  `status`         ENUM('valid','used','cancelled') NOT NULL DEFAULT 'valid',
  `purchase_date`  DATETIME(6)   NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  KEY `idx_tickets_event` (`event_id`),
  KEY `idx_tickets_user` (`user_id`),
  KEY `idx_tickets_status` (`status`),
  CONSTRAINT `fk_tickets_event`
    FOREIGN KEY (`event_id`) REFERENCES `events` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_tickets_user`
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;

-- =====================================================================
-- DONNÉES DE DÉMONSTRATION (facultatif, pratique pour tester l'API tout de suite)
-- Mots de passe déjà hashés avec bcrypt (10 rounds) :
--   admin@evana.com  / admin123
--   user@evana.com   / user123
-- =====================================================================

INSERT INTO `users` (`id`, `username`, `email`, `password`, `phone`, `role`) VALUES
('c0f347e8-5fef-4a1d-8c22-33e441be57ab', 'AdminEvana', 'admin@evana.com',
 '$2a$10$jibnOeqrRBdF.VAodGkL/.UyRhp9V1otXYWj3Y77imvQonF6O7EoW', '+221700000000', 'admin'),
('3ca8ed83-6797-4933-a749-a58c0fb3cce9', 'UserDemo', 'user@evana.com',
 '$2a$10$PmzMQljAnBMNA.ov/xsAy.ZCvwDW8fFAG4ynHUFXF6deUy6PYG9va', '+221700000001', 'user');

INSERT INTO `events`
  (`id`, `name`, `description`, `date`, `location`, `image`, `category`, `tickets_available`, `tickets_price`, `status`) VALUES
('fb8f25e1-25dd-44c1-a11b-8c1245633024', 'EVANA Music Festival 2026',
 'Le plus grand festival de musique urbaine et afrobeat de la région, sur deux scènes.',
 '2026-12-15', 'Dakar Arena, Dakar', 'https://images.example.com/evana-festival.jpg',
 'festival', 500, 15000.00, 'upcoming'),
('2f71f415-a415-4deb-8e6f-1db23d2075d1', 'Nuit Acoustique EVANA',
 'Une soirée intimiste avec des artistes locaux en formule acoustique.',
 '2026-09-20', 'Institut Français, Dakar', 'https://images.example.com/evana-acoustic.jpg',
 'concert', 150, 8000.00, 'upcoming');

INSERT INTO `artists` (`id`, `name`, `bio`, `image`) VALUES
('8ba9efa2-7f70-4f38-8fc5-813d16262591', 'DJ Yara', 'DJ et productrice sénégalaise reconnue pour ses sets afrobeat et amapiano.', 'https://images.example.com/dj-yara.jpg'),
('726fb501-6007-46a4-a33e-18556d37e3b1', 'Sané Kora', 'Auteur-compositeur mêlant kora traditionnelle et sonorités modernes.', 'https://images.example.com/sane-kora.jpg');

INSERT INTO `artist_genres` (`id`, `genre`, `artist_id`) VALUES
(UUID(), 'Afrobeat', '8ba9efa2-7f70-4f38-8fc5-813d16262591'),
(UUID(), 'Amapiano', '8ba9efa2-7f70-4f38-8fc5-813d16262591'),
(UUID(), 'World Music', '726fb501-6007-46a4-a33e-18556d37e3b1'),
(UUID(), 'Acoustique', '726fb501-6007-46a4-a33e-18556d37e3b1');
