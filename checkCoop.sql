-- Tabla de empresas
CREATE TABLE `empresas` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(255) NOT NULL,
  `razon_social` VARCHAR(255) DEFAULT NULL,
  `nif_cif` VARCHAR(20) DEFAULT NULL,
  `direccion` TEXT,
  `email_contacto` VARCHAR(255) DEFAULT NULL,
  `telefono` VARCHAR(50) DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_empresas_nombre` (`nombre`),
  UNIQUE KEY `uk_empresas_nif_cif` (`nif_cif`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla de usuarios
CREATE TABLE `usuarios` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `empresa_id` BIGINT UNSIGNED NOT NULL,
  `nombre` VARCHAR(100) NOT NULL,
  `apellidos` VARCHAR(100) DEFAULT NULL,
  `email` VARCHAR(255) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `rol` ENUM('superadmin','admin','usuario') NOT NULL,
  `activo` TINYINT(1) NOT NULL DEFAULT 1,
  `last_login` DATETIME DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_usuario_empresa_email` (`empresa_id`,`email`),
  UNIQUE KEY `uk_usuarios_email` (`email`),
  KEY `idx_usuarios_empresa_id` (`empresa_id`),
  KEY `idx_usuarios_rol` (`rol`),
  CONSTRAINT `fk_usuarios_empresas`
    FOREIGN KEY (`empresa_id`) REFERENCES `empresas` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
