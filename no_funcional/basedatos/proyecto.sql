-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost
-- Tiempo de generación: 06-09-2026 a las 01:24:22
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `proyecto`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `negocios`
--

CREATE TABLE `negocios` (
  `id_negocio` int(11) NOT NULL,
  `nombre` varchar(150) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `ubicacion` varchar(200) DEFAULT NULL,
  `municipio` varchar(100) NOT NULL,
  `UE` varchar(100) NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `correo` varchar(150) DEFAULT NULL,
  `estado` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `negocios`
--

INSERT INTO `negocios` (`id_negocio`, `nombre`, `descripcion`, `ubicacion`, `municipio`, `UE`, `telefono`, `correo`, `estado`) VALUES
(1, 'Balcón del Buila', 'Lugar turístico con actividades, hospedaje y restaurante.', 'Vereda El Buila', '', '', '3101234567', 'balcondelbuila@gmail.com', 1),
(2, 'Finca El Paraíso', 'Espacio natural para disfrutar de turismo y hospedaje.', 'Vereda La Cabaña', '', '', '3112345678', 'fincaelparaiso@gmail.com', 1),
(3, 'Restaurante La Casona', 'Restaurante con comida típica de la región.', 'Centro de Garzón', '', '', '3123456789', 'lacasona@gmail.com', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `negocio_servicio`
--

CREATE TABLE `negocio_servicio` (
  `id_negocio` int(11) NOT NULL,
  `id_tipo_servicio` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `negocio_servicio`
--

INSERT INTO `negocio_servicio` (`id_negocio`, `id_tipo_servicio`) VALUES
(1, 1),
(1, 2),
(1, 3),
(2, 1),
(2, 2),
(3, 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reservas`
--

CREATE TABLE `reservas` (
  `id_reserva` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `id_negocio` int(11) NOT NULL,
  `id_servicio` int(11) NOT NULL,
  `fecha_reserva` datetime DEFAULT current_timestamp(),
  `fecha_inicio` date NOT NULL,
  `fecha_fin` date NOT NULL,
  `cantidad_personas` int(11) NOT NULL DEFAULT 1,
  `cantidad_servicio` int(11) NOT NULL DEFAULT 1,
  `metodo_pago` varchar(50) NOT NULL,
  `precio_unitario` decimal(12,2) NOT NULL DEFAULT 0.00,
  `valor_total` decimal(12,2) NOT NULL DEFAULT 0.00,
  `abono` decimal(12,2) NOT NULL DEFAULT 0.00,
  `saldo_pendiente` decimal(12,2) NOT NULL DEFAULT 0.00,
  `estado` varchar(30) NOT NULL DEFAULT 'Pendiente'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `reservas`
--

INSERT INTO `reservas` (`id_reserva`, `id_usuario`, `id_negocio`, `id_servicio`, `fecha_reserva`, `fecha_inicio`, `fecha_fin`, `cantidad_personas`, `cantidad_servicio`, `metodo_pago`, `precio_unitario`, `valor_total`, `abono`, `saldo_pendiente`, `estado`) VALUES
(1, 2, 1, 1, '2026-09-01 10:11:57', '2026-09-10', '2026-09-12', 4, 2, 'Transferencia', 180000.00, 360000.00, 200000.00, 160000.00, 'Confirmada');

--
-- Disparadores `reservas`
--
DELIMITER $$
CREATE TRIGGER `calcular_reserva_insert` BEFORE INSERT ON `reservas` FOR EACH ROW BEGIN
    SET NEW.precio_unitario = (
        SELECT precio
        FROM servicios
        WHERE id_servicio = NEW.id_servicio
        LIMIT 1
    );

    SET NEW.valor_total =
        NEW.precio_unitario * NEW.cantidad_servicio;

    SET NEW.saldo_pendiente =
        NEW.valor_total - NEW.abono;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `calcular_reserva_update` BEFORE UPDATE ON `reservas` FOR EACH ROW BEGIN
    SET NEW.precio_unitario = (
        SELECT precio
        FROM servicios
        WHERE id_servicio = NEW.id_servicio
        LIMIT 1
    );

    SET NEW.valor_total =
        NEW.precio_unitario * NEW.cantidad_servicio;

    SET NEW.saldo_pendiente =
        NEW.valor_total - NEW.abono;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

CREATE TABLE `roles` (
  `id_rol` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `roles`
--

INSERT INTO `roles` (`id_rol`, `nombre`) VALUES
(1, 'Administrador'),
(2, 'Usuario');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `servicios`
--

CREATE TABLE `servicios` (
  `id_servicio` int(11) NOT NULL,
  `id_negocio` int(11) NOT NULL,
  `id_tipo_servicio` int(11) NOT NULL,
  `nombre` varchar(150) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `precio` decimal(12,2) NOT NULL,
  `estado` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `servicios`
--

INSERT INTO `servicios` (`id_servicio`, `id_negocio`, `id_tipo_servicio`, `nombre`, `descripcion`, `precio`, `estado`) VALUES
(1, 1, 2, 'Habitación doble', 'Habitación para dos personas.', 180000.00, 1),
(2, 1, 2, 'Habitación familiar', 'Habitación para grupos o familias.', 280000.00, 1),
(3, 1, 1, 'Caminata ecológica', 'Recorrido turístico por la zona natural.', 50000.00, 1),
(4, 1, 3, 'Almuerzo típico', 'Plato típico de la región.', 30000.00, 1),
(5, 2, 2, 'Habitación familiar', 'Habitación para cuatro personas.', 250000.00, 1),
(6, 2, 1, 'Recorrido turístico', 'Recorrido por los atractivos naturales.', 40000.00, 1),
(7, 3, 3, 'Almuerzo ejecutivo', 'Almuerzo completo.', 25000.00, 1),
(8, 3, 3, 'Cena típica', 'Cena con platos típicos de la región.', 30000.00, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipos_servicio`
--

CREATE TABLE `tipos_servicio` (
  `id_tipo_servicio` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `precio` int(9) NOT NULL,
  `tiposervicio` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tipos_servicio`
--

INSERT INTO `tipos_servicio` (`id_tipo_servicio`, `nombre`, `descripcion`, `precio`, `tiposervicio`) VALUES
(1, 'Turismo', 'Actividades y experiencias turísticas', 0, ''),
(2, 'Hospedaje', 'Servicio de alojamiento', 0, ''),
(3, 'Restaurante', 'Servicio de alimentación y gastronomico', 0, ''),
(5, '23', 'sewew', 232, 'turismo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id_usuario` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) DEFAULT NULL,
  `correo` varchar(150) NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `contrasena` varchar(255) NOT NULL,
  `id_rol` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id_usuario`, `nombre`, `apellido`, `correo`, `telefono`, `contrasena`, `id_rol`) VALUES
(1, 'Carlos', 'Rodriguez', 'carlos@gmail.com', '3001234567', '123456', 1),
(2, 'Maria', 'Gomez', 'maria@gmail.com', '3012345678', '123456', 2),
(3, 'Juan', 'Perez', 'juan@gmail.com', '3023456789', '123456', 1),
(4, 'Laura', 'Martinez', 'laura@gmail.com', '3034567890', '123456', 2),
(5, 'Johan', 'andres', 'Johan@gmail.com', '3000123456', '12345', 1);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `negocios`
--
ALTER TABLE `negocios`
  ADD PRIMARY KEY (`id_negocio`);

--
-- Indices de la tabla `negocio_servicio`
--
ALTER TABLE `negocio_servicio`
  ADD PRIMARY KEY (`id_negocio`,`id_tipo_servicio`),
  ADD KEY `fk_ns_tipo` (`id_tipo_servicio`);

--
-- Indices de la tabla `reservas`
--
ALTER TABLE `reservas`
  ADD PRIMARY KEY (`id_reserva`),
  ADD KEY `fk_reserva_usuario` (`id_usuario`),
  ADD KEY `fk_reserva_negocio` (`id_negocio`),
  ADD KEY `fk_reserva_servicio` (`id_servicio`);

--
-- Indices de la tabla `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id_rol`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- Indices de la tabla `servicios`
--
ALTER TABLE `servicios`
  ADD PRIMARY KEY (`id_servicio`),
  ADD KEY `fk_servicio_negocio` (`id_negocio`),
  ADD KEY `fk_servicio_tipo` (`id_tipo_servicio`);

--
-- Indices de la tabla `tipos_servicio`
--
ALTER TABLE `tipos_servicio`
  ADD PRIMARY KEY (`id_tipo_servicio`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `correo` (`correo`),
  ADD KEY `fk_usuario_rol` (`id_rol`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `negocios`
--
ALTER TABLE `negocios`
  MODIFY `id_negocio` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `reservas`
--
ALTER TABLE `reservas`
  MODIFY `id_reserva` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `roles`
--
ALTER TABLE `roles`
  MODIFY `id_rol` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `servicios`
--
ALTER TABLE `servicios`
  MODIFY `id_servicio` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `tipos_servicio`
--
ALTER TABLE `tipos_servicio`
  MODIFY `id_tipo_servicio` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `negocio_servicio`
--
ALTER TABLE `negocio_servicio`
  ADD CONSTRAINT `fk_ns_negocio` FOREIGN KEY (`id_negocio`) REFERENCES `negocios` (`id_negocio`),
  ADD CONSTRAINT `fk_ns_tipo` FOREIGN KEY (`id_tipo_servicio`) REFERENCES `tipos_servicio` (`id_tipo_servicio`);

--
-- Filtros para la tabla `reservas`
--
ALTER TABLE `reservas`
  ADD CONSTRAINT `fk_reserva_negocio` FOREIGN KEY (`id_negocio`) REFERENCES `negocios` (`id_negocio`),
  ADD CONSTRAINT `fk_reserva_servicio` FOREIGN KEY (`id_servicio`) REFERENCES `servicios` (`id_servicio`),
  ADD CONSTRAINT `fk_reserva_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `servicios`
--
ALTER TABLE `servicios`
  ADD CONSTRAINT `fk_servicio_negocio` FOREIGN KEY (`id_negocio`) REFERENCES `negocios` (`id_negocio`),
  ADD CONSTRAINT `fk_servicio_tipo` FOREIGN KEY (`id_tipo_servicio`) REFERENCES `tipos_servicio` (`id_tipo_servicio`);

--
-- Filtros para la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `fk_usuario_rol` FOREIGN KEY (`id_rol`) REFERENCES `roles` (`id_rol`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
