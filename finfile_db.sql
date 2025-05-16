-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 15, 2025 at 04:52 PM
-- Server version: 10.4.27-MariaDB
-- PHP Version: 7.4.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `finfile_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `access_logs`
--

CREATE TABLE `access_logs` (
  `log_id` int(11) NOT NULL,
  `file_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `actions` varchar(255) DEFAULT NULL,
  `timestampx` timestamp NOT NULL DEFAULT current_timestamp(),
  `is_trashed` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `files`
--

CREATE TABLE `files` (
  `file_id` int(11) NOT NULL,
  `owner_id` int(11) DEFAULT NULL,
  `team_id` int(11) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `shared_id` int(11) DEFAULT NULL,
  `file_name` varchar(255) DEFAULT NULL,
  `file_type` varchar(100) DEFAULT NULL,
  `file_path` varchar(500) DEFAULT NULL,
  `file_location` varchar(255) DEFAULT NULL,
  `file_size` int(11) DEFAULT NULL,
  `is_favorite` tinyint(1) DEFAULT 0,
  `is_trashed` tinyint(1) DEFAULT 0,
  `uploaded_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `last_modified` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `last_updated_by` int(11) DEFAULT NULL,
  `module_type` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `file_access_logs`
--

CREATE TABLE `file_access_logs` (
  `log_id` int(11) NOT NULL,
  `file_id` int(11) DEFAULT 0,
  `user_id` int(11) DEFAULT 0,
  `types` varchar(255) DEFAULT NULL,
  `remarks` varchar(255) DEFAULT NULL,
  `actions` varchar(255) DEFAULT NULL,
  `logsdate` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `file_categories`
--

CREATE TABLE `file_categories` (
  `category_id` int(11) NOT NULL,
  `owner_id` int(11) DEFAULT NULL,
  `category_name` varchar(100) NOT NULL,
  `category_path` varchar(500) DEFAULT NULL,
  `category_location` varchar(255) DEFAULT NULL,
  `category_size` int(11) DEFAULT NULL,
  `shared_id` int(11) DEFAULT NULL,
  `is_favorite` tinyint(1) DEFAULT 0,
  `is_trashed` tinyint(1) NOT NULL DEFAULT 0,
  `last_modified` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `last_updated_by` int(11) DEFAULT NULL,
  `module_type` tinyint(1) DEFAULT 2
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `ntfctns_id` int(11) NOT NULL,
  `recipient_id` int(11) DEFAULT NULL,
  `sender_id` int(11) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `messages` text DEFAULT NULL,
  `types` varchar(50) NOT NULL,
  `entity_id` int(11) DEFAULT NULL,
  `entity_type` varchar(255) DEFAULT NULL,
  `actions` varchar(255) DEFAULT NULL,
  `urls` varchar(255) DEFAULT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `shared_files`
--

CREATE TABLE `shared_files` (
  `shared_id` int(11) NOT NULL,
  `file_id` int(11) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `shared_by` int(11) DEFAULT NULL,
  `shared_with` int(11) DEFAULT NULL,
  `permission` enum('view','edit') DEFAULT 'view',
  `shared_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `is_favorite` tinyint(4) DEFAULT 0,
  `shared_location` varchar(255) DEFAULT NULL,
  `module_type` tinyint(1) DEFAULT 3
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `teams`
--

CREATE TABLE `teams` (
  `team_id` int(11) NOT NULL,
  `team_name` varchar(100) DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `team_size` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `is_trashed` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `team_members`
--

CREATE TABLE `team_members` (
  `team_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `added_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `user_name` varchar(255) DEFAULT NULL,
  `password_hash` varchar(255) DEFAULT NULL,
  `avatar_url` varchar(255) DEFAULT NULL,
  `role` enum('staff') DEFAULT 'staff',
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `is_trashed` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `full_name`, `email`, `user_name`, `password_hash`, `avatar_url`, `role`, `status`, `created_at`, `is_trashed`) VALUES
(1, 'Emily Carters', 'emily.carter123@gmail.com', 'emily', 'ddf1d4b3aa7d445f4ceaaada6ecd026b', 'src/assets/images/emily_carters_1.jpg', 'staff', 'active', '2025-05-11 06:58:17', 0),
(2, 'Jason Reed', ' jason.reed987@gmail.com', 'jason', 'd25ffc8d6db524c17f3e701cd989a58a', NULL, 'staff', 'active', '2025-05-11 07:10:35', 0),
(3, 'Sofia Bennett', 'sofia.bennett22@gmail.com', 'sofia', 'a0734c7ec07d25795ad022c40f9e6ad8', NULL, 'staff', 'active', '2025-05-11 07:11:59', 0),
(7, 'Mark Sibug', 'marksibug@gmail.com', 'mark', 'c47b960361fd951c86e4dadf05f0ad52', 'src/assets/images/mark_sibug_7.jpg', 'staff', 'active', '2025-05-13 13:34:54', 0),
(9, 'sarah labotaw', 'sarahlabotaw@gmail.com', 'sarah', 'ea61b9447a8739e383b2c04b9bb50175', 'src/assets/images/sarah_labotaw_9.jpg', 'staff', 'active', '2025-05-13 13:56:22', 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `access_logs`
--
ALTER TABLE `access_logs`
  ADD PRIMARY KEY (`log_id`),
  ADD KEY `access_logs_ibfk_1` (`file_id`),
  ADD KEY `access_logs_ibfk_2` (`user_id`);

--
-- Indexes for table `files`
--
ALTER TABLE `files`
  ADD PRIMARY KEY (`file_id`),
  ADD KEY `owner_id` (`owner_id`),
  ADD KEY `team_id` (`team_id`),
  ADD KEY `category_id` (`category_id`),
  ADD KEY `shared_id` (`shared_id`),
  ADD KEY `last_updated_by` (`last_updated_by`);

--
-- Indexes for table `file_access_logs`
--
ALTER TABLE `file_access_logs`
  ADD PRIMARY KEY (`log_id`);

--
-- Indexes for table `file_categories`
--
ALTER TABLE `file_categories`
  ADD PRIMARY KEY (`category_id`),
  ADD UNIQUE KEY `category_name` (`category_name`),
  ADD KEY `shared_id` (`shared_id`),
  ADD KEY `last_updated_by` (`last_updated_by`),
  ADD KEY `owner_id` (`owner_id`),
  ADD KEY `is_favorite` (`is_favorite`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`ntfctns_id`),
  ADD KEY `recipient_id` (`recipient_id`),
  ADD KEY `sender_id` (`sender_id`);

--
-- Indexes for table `shared_files`
--
ALTER TABLE `shared_files`
  ADD PRIMARY KEY (`shared_id`),
  ADD KEY `file_id` (`file_id`),
  ADD KEY `shared_by` (`shared_by`),
  ADD KEY `shared_with` (`shared_with`),
  ADD KEY `category_id` (`category_id`);

--
-- Indexes for table `teams`
--
ALTER TABLE `teams`
  ADD PRIMARY KEY (`team_id`),
  ADD KEY `created_by` (`created_by`);

--
-- Indexes for table `team_members`
--
ALTER TABLE `team_members`
  ADD PRIMARY KEY (`team_id`,`user_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `access_logs`
--
ALTER TABLE `access_logs`
  MODIFY `log_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `files`
--
ALTER TABLE `files`
  MODIFY `file_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `file_access_logs`
--
ALTER TABLE `file_access_logs`
  MODIFY `log_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `file_categories`
--
ALTER TABLE `file_categories`
  MODIFY `category_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `ntfctns_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `shared_files`
--
ALTER TABLE `shared_files`
  MODIFY `shared_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `teams`
--
ALTER TABLE `teams`
  MODIFY `team_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `access_logs`
--
ALTER TABLE `access_logs`
  ADD CONSTRAINT `access_logs_ibfk_1` FOREIGN KEY (`file_id`) REFERENCES `files` (`file_id`),
  ADD CONSTRAINT `access_logs_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `files`
--
ALTER TABLE `files`
  ADD CONSTRAINT `files_ibfk_1` FOREIGN KEY (`owner_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `files_ibfk_2` FOREIGN KEY (`team_id`) REFERENCES `teams` (`team_id`),
  ADD CONSTRAINT `files_ibfk_3` FOREIGN KEY (`category_id`) REFERENCES `file_categories` (`category_id`),
  ADD CONSTRAINT `files_ibfk_4` FOREIGN KEY (`last_updated_by`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `shared_files`
--
ALTER TABLE `shared_files`
  ADD CONSTRAINT `shared_files_ibfk_1` FOREIGN KEY (`file_id`) REFERENCES `files` (`file_id`),
  ADD CONSTRAINT `shared_files_ibfk_2` FOREIGN KEY (`shared_by`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `shared_files_ibfk_3` FOREIGN KEY (`shared_with`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `teams`
--
ALTER TABLE `teams`
  ADD CONSTRAINT `teams_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `team_members`
--
ALTER TABLE `team_members`
  ADD CONSTRAINT `team_members_ibfk_1` FOREIGN KEY (`team_id`) REFERENCES `teams` (`team_id`),
  ADD CONSTRAINT `team_members_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
