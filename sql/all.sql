SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";

CREATE TABLE `anchor` (
  `id` varchar(50) COLLATE utf8mb4_bin NOT NULL COMMENT '主播id',
  `im_id` varchar(50) COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'imsdkid',
  `nick` varchar(50) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '主播名',
  `status` int(16) DEFAULT NULL COMMENT '在线状态',
  `desc` varchar(200) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '描述',
  `avtar` varchar(200) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '头像',
  `attention_num` int(16) NOT NULL COMMENT '关注量'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='主播表' ROW_FORMAT=DYNAMIC;

CREATE TABLE `follow` (
  `id` int(11) NOT NULL,
  `from_id` varchar(50) COLLATE utf8mb4_bin DEFAULT NULL,
  `to_id` varchar(50) COLLATE utf8mb4_bin DEFAULT NULL,
  `create_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

CREATE TABLE `gift` (
  `id` int(11) NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  `detail` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  `url` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '礼物图片地址',
  `price` decimal(10,2) DEFAULT NULL,
  `thumbnail` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '礼物缩略图地址'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

INSERT INTO `gift` (`id`, `name`, `detail`, `url`, `price`, `thumbnail`) VALUES
(1, '火箭', '送主播一个火箭吧', 'https://scf-deploy-ap-guangzhou-1257969821.cos.ap-guangzhou.myqcloud.com/rocket.png', '100.00', 'https://scf-deploy-ap-guangzhou-1257969821.cos.ap-guangzhou.myqcloud.com/rocket.png'),
(2, '玫瑰花', '送主播一个玫瑰花吧', 'https://scf-deploy-ap-guangzhou-1257969821.cos.ap-guangzhou.myqcloud.com/WX20200628-111638.png', '1.00', 'https://scf-deploy-ap-guangzhou-1257969821.cos.ap-guangzhou.myqcloud.com/WX20200628-111638.png');

CREATE TABLE `like` (
  `id` int(11) NOT NULL,
  `from_id` varchar(50) COLLATE utf8mb4_bin DEFAULT NULL,
  `to_id` varchar(50) COLLATE utf8mb4_bin DEFAULT NULL,
  `create_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

CREATE TABLE `room` (
  `id` varchar(50) COLLATE utf8mb4_bin NOT NULL COMMENT '房间id',
  `im_id` varchar(50) COLLATE utf8mb4_bin NOT NULL COMMENT '房间绑定的IMSDKID',
  `room_name` varchar(50) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '房间名字',
  `room_desc` varchar(200) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '房间描述',
  `room_owner` varchar(50) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '房间创建者',
  `room_cover` varchar(200) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '房间封面',
  `room_live_link` varchar(200) COLLATE utf8mb4_bin NOT NULL COMMENT '房间直播链接',
  `room_cover_s` varchar(200) COLLATE utf8mb4_bin NOT NULL COMMENT '房间封面、小图',
  `room_status` varchar(50) COLLATE utf8mb4_bin NOT NULL COMMENT '房间状态'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='直播间房间列表' ROW_FORMAT=DYNAMIC;

INSERT INTO `room` (`id`, `im_id`, `room_name`, `room_desc`, `room_owner`, `room_cover`, `room_live_link`, `room_cover_s`, `room_status`) VALUES
('123', '填入IM的直播群id', '体验直播间', '这是一个体验直播间，欢迎大家来观看我的直播。', NULL, 'https://upload-dianshi-1255598498.file.myqcloud.com/owner-cca99e7107aa45123e9514336b0785463757f242.png', 'rtmp://www.imfaker.cn/live/im_live_demo', 'https://upload-dianshi-1255598498.file.myqcloud.com/owner-cca99e7107aa45123e9514336b0785463757f242.png', '0');

CREATE TABLE `send_gift` (
  `id` int(11) NOT NULL,
  `from_id` varchar(50) COLLATE utf8mb4_bin NOT NULL,
  `to_id` varchar(50) COLLATE utf8mb4_bin NOT NULL,
  `create_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `gift_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

CREATE TABLE `user` (
  `id` varchar(50) COLLATE utf8mb4_bin NOT NULL COMMENT '用户id，这里用来存微信的openid',
  `nick` varchar(50) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '用户名，这里就是微信昵称',
  `avatar` varchar(200) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '用户头像',
  `phone` varchar(50) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '用户电话',
  `gender` varchar(10) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '用户性别',
  `addr` varchar(50) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '微信地址',
  `create_time` datetime(6) DEFAULT NULL COMMENT '注册时间',
  `update_time` datetime(6) DEFAULT NULL COMMENT '最近更新时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='用户表';

ALTER TABLE `anchor`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `follow`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_from_user` (`from_id`),
  ADD KEY `FK_to_user` (`to_id`);

ALTER TABLE `gift`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `like`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_from_user` (`from_id`),
  ADD KEY `FK_to_user` (`to_id`);

ALTER TABLE `room`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `send_gift`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_from_user` (`from_id`),
  ADD KEY `FK_to_user` (`to_id`),
  ADD KEY `FK_gift_id` (`gift_id`);

ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `follow`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=233;

ALTER TABLE `gift`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

ALTER TABLE `like`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

ALTER TABLE `send_gift`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

ALTER TABLE `follow`
  ADD CONSTRAINT `follow_ibfk_1` FOREIGN KEY (`from_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `follow_ibfk_2` FOREIGN KEY (`to_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `like`
  ADD CONSTRAINT `FK_from_user` FOREIGN KEY (`from_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `FK_to_user` FOREIGN KEY (`to_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `send_gift`
  ADD CONSTRAINT `FK_gift_id` FOREIGN KEY (`gift_id`) REFERENCES `gift` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `send_gift_ibfk_1` FOREIGN KEY (`from_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `send_gift_ibfk_2` FOREIGN KEY (`to_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;