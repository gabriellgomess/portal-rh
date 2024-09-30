-- phpMyAdmin SQL Dump
-- version 4.3.7
-- http://www.phpmyadmin.net
--
-- Host: mysql26-farm10.kinghost.net
-- Tempo de geração: 30/09/2024 às 15:13
-- Versão do servidor: 10.6.19-MariaDB-log
-- Versão do PHP: 5.3.29

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Banco de dados: `amigosdacasa`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(150) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Fazendo dump de dados para tabela `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`) VALUES
(1, 'Gabriel Gomes', 'gabriel.gomes@outlook.com', '$2y$10$BWyl189k7uFf5RWFLu3SIeoo.Vdh1oAjsuWOeR5L8Ka2nyr.bx.16'),
(2, 'Master User', 'boletos@casadomenino.org.br', '$2y$10$xUrmURIDyMKk.eZ/KuwnweBUeiF77gvogZb9R7X3N28V6MmpHJRN6'),
(3, 'Sara Linhar Gomes', 'sara.linhargomes@gmail.com', '$2y$10$HfNEtHZPSAVWHDagtajHbevLtuOHWAUTKbfVJaQWXVf201vP2wzPG'),
(4, 'Sara Gomes', 'sara.gomes@teste.com.br', '$2y$10$C3XXPy5.9nAow9wBz6h.guqYLlIvyd4CTAnLawfQ2kWv/aPIXSatC'),
(5, 'Isadora Gomes', 'isadora.gomes@outlook.com', '$2y$10$A8hZ5rh1JPVSSikMaPwtdeEu3EMA7NZB1gd4s0oK2Gs3yE65im.R.'),
(7, 'Gabriel Junior', 'gabriel.junior@teste.com.br', '$2y$10$GGLyrsoZLnDQwUmE/aJODuy6NiGAhAjRWB/xxGX9J7RRxfCBAxvGG'),
(8, 'Lorena Linhar', 'lorena@gmail.com', '$2y$10$jMaw8D2RDjgNaiQuwS7xn.v4ipD/Ja2jpwRTyYNz8ixurkE0pNuHm'),
(9, 'Sara Gomes', 'sara.gabriel@gmail.com', '$2y$10$VdA6hLa01jQBEWae4w3QlOAAW8U.RqvVaQM5hCcucyAddvki9l5ri'),
(10, 'Sara Gomes', 'sara.gabriel@gmaild.com', '$2y$10$GUvWhGVzn11knz.Svuc51uER0E4I/ZEReQ3epZUU4/x4N40urizqu'),
(13, 'Henrique Machado', 'henrique.machado@casadomenino.org.br', '$2y$10$SbjWQBBG.5KFAp8.jFL4ZucqV1PON4lqy3q7pV6feRlOYq.eyrcV.'),
(14, 'Carolina Volpatto', 'carolina.volpatto@casadomenino.org.br', '$2y$10$prT6Pf8.WN5zAmrzOpBufOnQYg.CNPyPZQmsjuX9ltzND38EOnNCq');

--
-- Índices de tabelas apagadas
--

--
-- Índices de tabela `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de tabelas apagadas
--

--
-- AUTO_INCREMENT de tabela `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=15;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
