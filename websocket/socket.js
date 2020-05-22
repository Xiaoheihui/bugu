// 引入WebSocket模块
var ws = require("nodejs-websocket");
var axios = require("axios");
var moment = require("moment");
var PORT = 8001;

let to_json = function(str_text) {
	return JSON.parse(str_text);
}

let to_str = function(json_text) {
	return JSON.stringify(json_text);
}

// 实时聊天人数数组，通过随机数生成
let conns = {};
let message_welcome = {};
let message_member = {};
let message_between = {};
let heart_beat = 9999; //要求每个连接每9999秒心跳一次，否则断线,建议调到50

// on就是addListener，添加一个监听事件调用回调函数
// Scream server example:"hi"->"HI!!!",服务器把字母大写
var server = ws.createServer(function(conn) {
	let uid = ""; // 记录当前用户id
	//计算心跳时间
	conn.heart_time = 0
	let timer = setInterval(() => {
		if (conn.heart_time > heart_beat) {
			clearInterval(timer);
			conn.close()
		}
		conn.heart_time++
	}, 1000);

	conn.on('text', function(str) {
		//重置心跳
		conn.heart_time = 0;

		var data = to_json(str);
		console.log(data);

		switch (data.type) {
			case 'heart':
				message_between = {
					user_id: data.user_id,
					content: "Heart_Beat",
					type: "success"
				};
				conns[data.user_id].sendText(to_str(message_between));
			case 'login':
				uid = data.user_id;
				if (conns.hasOwnProperty(data.user_id)) { // 该用户已登录
					let change = async () => {
            			conns[data.user_id].close();
          			};
					change().then(()=> conns[data.user_id] = conn);
					console.log("已经登录了！！");
					return;
				}
				conns[data.user_id] = conn; //更新在线用户数组
				message_welcome = {
					user_id: data.user_id,
					type: "login"
				}
				//console.log(conns[data.user_id]);
				conn.sendText(to_str(message_welcome));
				console.log(data.user_id);
				console.log("" + data.user_id + ":" + (conns.hasOwnProperty(data.user_id)));
				break;
			case 'logout':
				message_bye = {
          			user_id: data.user_id,
          			type: "logout"
        		};
        		//console.log(conns[data.user_id]);
        		conn.sendText(to_str(message_bye));
				conns[data.user_id].close();
				break;
			case 'chat':
				let session = {};
				axios.post("https://af8ko6.toutiao15.com/get_meet_info", {
					session_id: data.session_id
				}).then((res) => {
					// console.log(res.data)
					if (res.data.state == "0") {
						console.log(res.data);
						console.log("111111111111111111");
						session = res.data.session;

						let time = moment().utcOffset(+8).format('YYYY-MM-DD HH:mm:ss');
						//判断是否为群聊
						let is_group = session.is_group;

						if (is_group) {
							//获取群中的用户列表
							let group_id = session.one_id;
							let memberlist = []
							axios.post("https://af8ko6.toutiao15.com/getGroupInfo", {
								user_id: data.user_id,
								group_id: group_id
							}).then((res) => {
								if (res.data.state == "0") {
									console.log(res.data);
									memberlist = res.data.memberlist;

									for (let i = 0; i < memberlist.length; i++) {
										let member_id = memberlist[i].user_id;
										//如果群成员在线
										if (conns.hasOwnProperty(member_id)) {
											//********待修改********
											message_between = {
												user_id: data['user_id'],
												session_id: data['session_id'],
												content: data['content'],
												transmit_time: time,
												type: "success"
											};
											console.log(to_str(message_between));
											//发送
											conns[member_id].sendText(to_str(message_between));
										}
									}
									//发给自己
									conns.sendText(to_str(message_between));

									//更新该会话的最后一条消息时间
									axios.post("https://af8ko6.toutiao15.com/update_last_time", {
										session_id: data['session_id'],
										updatetime: time,
									}).then((res) => {
										if (res.data.state == "0") {
											console.log("最后一条消息时间修改成功");
										} else {
											console.log("最后一条消息时间修改失败");
										}
									});

									//存储聊天记录
									axios.post("https://af8ko6.toutiao15.com/add_char_history", {
										session_id: data['session_id'],
										sender_id: data['user_id'],
										sender_name: data['sender_name'],
										content: data['content'],
										time: time,
									}).then((res) => {
										if (res.data.state == "0") {
											console.log("保存成功");
										} else {
											console.log("保存失败");
										}
									});
								} else {
									console.log(res.data.message);
								}
							});

						} else {
							//获取好友id
							let friend_id = "";
							if (session.one_id == data.user_id)
								friend_id = session.another_id;
							else if (session.another_id == data.user_id)
								friend_id = session.one_id;
							console.log("friend_id:" + friend_id);
							//如果用户在线
							if (conns.hasOwnProperty(friend_id)) {
								//********待修改********
								message_between = {
									user_id: data.user_id,
									session_id: data['session_id'],
									content: data['content'],
									transmit_time: time,
									sender_name: data['sender_name'],
									if_receive: false,
									type: "success"
								};
								console.log(to_str(message_between));
								//发给别人
								conns[friend_id].sendText(to_str(message_between));
								//发给自己
								conns[data.user_id].sendText(to_str(message_between));
							} else {
								//发给自己
								message_between = {
									user_id: data.user_id,
									session_id: data['session_id'],
									content: data['content'],
									transmit_time: time,
									sender_name: data['sender_name'],
									if_receive: false,
									type: "success"
								};
								console.log(conns[data.user_id].readyState);
								conns[data.user_id].sendText(to_str(message_between));
							}


							//更新该会话的最后一条消息时间
							axios.post("https://af8ko6.toutiao15.com/update_last_time", {
								session_id: data['session_id'],
								updatetime: time,
							}).then((res) => {
								if (res.data.state == "0") {
									console.log("最后一条消息时间修改成功");
								} else {
									console.log("最后一条消息时间修改失败");
								}
							});

							//存储聊天记录
							axios.post("https://af8ko6.toutiao15.com/add_char_history", {
								session_id: data['session_id'],
								sender_id: data['user_id'],
								sender_name: data['sender_name'],
								content: data['content'],
								time: time,
							}).then((res) => {
								if (res.data.state == "0") {
									console.log("保存成功");
								} else {
									console.log("保存失败");
								}
							});
						}
						let time_1 = moment().add(1, 's').utcOffset(+8).format('YYYY-MM-DD HH:mm:ss');  //加1s
						axios.post("https://af8ko6.toutiao15.com/update_leave_time", {
							user_id: uid,
							updatetime: time_1,
						}).then((res) => {
							if (res.data.state == "0") {
								console.log("聊天中-离开时间修改成功");
							} else {
								console.log("聊天中-离开时间修改失败");
							}
						});
					} else {
						console.log(res.data.message);
					}
				});
				break;

			default:
				break;
		}
	});

	//断开连接的回调
	conn.on('close', function() {
		//更新该用户所有会话的离开时间
		//console.log("close:   " + conns.hasOwnProperty(uid));
		delete conns[uid];
		//删除成员信息
		console.log("close:   " + conns.hasOwnProperty(uid));
		let time = moment().utcOffset(+8).format('YYYY-MM-DD HH:mm:ss');
		axios.post("https://af8ko6.toutiao15.com/update_leave_time", {
			user_id: uid,
			updatetime:   time,
		}).then((res) => {
			if (res.data.state == "0") {
				console.log("离开时间修改成功");
			} else {
				console.log("离开时间修改失败");
			}
			
		});
	});

	//处理错误事件信息
	conn.on('error', function(err) {
		//异常conn就直接删除
		//conn.close();
		delete conns[uid];
		console.log("异常发生");
		console.log(conns.hasOwnProperty(uid));
	});
}).listen(PORT);

console.log("websocket server listening on port " + PORT);
