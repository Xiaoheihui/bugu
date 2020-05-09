import Vue from 'vue'
import Vuex from 'vuex'
var moment = require("moment");

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		user: {
			user_id: window.localStorage.getItem('user' || '[]') == null ? '' : JSON.parse(window.localStorage.getItem('user' ||
				'[]')).user_id,
			phone: window.localStorage.getItem('user' || '[]') == null ? '' : JSON.parse(window.localStorage.getItem('user' ||
				'[]')).phone,
			email: window.localStorage.getItem('user' || '[]') == null ? '' : JSON.parse(window.localStorage.getItem('user' ||
				'[]')).email,
			nickname: window.localStorage.getItem('user' || '[]') == null ? '' : JSON.parse(window.localStorage.getItem('user' ||
				'[]')).nickname,
			gender: window.localStorage.getItem('user' || '[]') == null ? '' : JSON.parse(window.localStorage.getItem('user' ||
				'[]')).gender,
			birthday: window.localStorage.getItem('user' || '[]') == null ? '' : JSON.parse(window.localStorage.getItem('user' ||
				'[]')).birthday,
			location: window.localStorage.getItem('user' || '[]') == null ? '' : JSON.parse(window.localStorage.getItem('user' ||
				'[]')).location,
			signature: window.localStorage.getItem('user' || '[]') == null ? '' : JSON.parse(window.localStorage.getItem(
				'user' || '[]')).signature,
			avatar_url: window.localStorage.getItem('user' || '[]') == null ? '' : JSON.parse(window.localStorage.getItem(
				'user' || '[]')).avatar_url
		},
		contacts: {
			friend_list: window.localStorage.getItem('contacts' || '[]') == null ? '' : JSON.parse(window.localStorage.getItem(
				'contacts' || '[]')).friend_list,
			group_list: window.localStorage.getItem('contacts' || '[]') == null ? '' : JSON.parse(window.localStorage.getItem(
				'contacts' || '[]')).group_list,
		},
		sessions: {
			session_list: window.localStorage.getItem('sessions' || '[]') == null ? '' : JSON.parse(window.localStorage.getItem(
				'sessions' || '[]')).session_list,
		},
		cur_session: window.localStorage.getItem('cur_session' || '[]') == null ? '' : JSON.parse(window.localStorage.getItem(
			'cur_session' || '[]')),
		socket_instance: null,
		path: "ws://localhost:8001",
		// 为使响应快速，暂存若干条消息并从本地渲染，本地消息达到一定数量再一起从服务器获取并渲染
		temp_history: []
		// 一个标志位，它被会话页面监听，每当收到他人消息他就会被改变，引起聊天记录的重新获取和渲染
	},
	mutations: {
		login(state, user) {
			state.user = user
			window.localStorage.setItem('user', JSON.stringify(user))
			const open = function() {
				console.log("socket连接成功")
				state.socket_instance.send(JSON.stringify({
					user_id: state.user.user_id,
					type: 'login'
				}))
			}
			const error = function() {
				console.log("连接错误")
			}
			const getMessage = function(msg) {
				console.log(msg.data)
			}
			const close = function() {
				console.log("socket已经关闭")
			}
			state.socket_instance = new WebSocket(state.path)
			state.socket_instance.onopen = open
			// 监听socket错误信息
			state.socket_instance.onerror = error
			// 监听socket消息
			state.socket_instance.onmessage = getMessage
		},
		getContacts(state, contacts) {
			state.contacts = contacts
			window.localStorage.setItem('contacts', JSON.stringify(contacts))
		},
		getSessions(state, sessions) {

			state.sessions = sessions
			window.localStorage.setItem('sessions', JSON.stringify(sessions))
		},
		getCurSession(state, cur_session) {
			state.cur_session = cur_session;
			window.localStorage.setItem('cur_session', JSON.stringify(cur_session));
		},
		editUser(state, new_user) {
			state.user = new_user;
			window.localStorage.setItem('user', JSON.stringify(new_user))
		},
		setConnect(state) {
			const open = function() {
				console.log("socket连接成功")
				state.socket_instance.send(JSON.stringify({
					user_id: state.user.user_id,
					type: 'login'
				}))
			}
			const error = function() {
				console.log("连接错误")
			}

			const getMessage = function(msg_) {
				let msg = JSON.parse(msg_.data);
				// 只要是在当前会话，不管是自己发出去还是别人发过来，都先存temp
				if (msg.session_id == state.cur_session.session_id) {
					if (state.temp_history.length > 12) {
						// 正常情况下，使用temp_his者会保证其长度不超过某一数量并重置它，此处兜底
						state.temp_history = []
					}
					state.temp_history.push({
						"sender_id": msg.user_id,
						"sender_name": msg.sender_name,
						"content": msg.content,
						"time": moment().utcOffset(+8).format('YYYY-MM-DD HH:mm:ss')
					})
					// 然后修改会话列表，主要是 显示最后一条消息
					for (let index in state.sessions.session_list) {
						if (state.sessions.session_list[index].session_id == msg.session_id) {
							state.sessions.session_list[index].last_time = msg.transmit_time;
							state.sessions.session_list[index].last_record = msg.content;
							window.localStorage.setItem('sessions', JSON.stringify(state.sessions));
						}		
					}
				} else if (msg.sender_id != state.user.user_id) {
					// 收到消息，但现在不在该会话的界面
					for (let index in state.sessions.session_list) {
						if (state.sessions.session_list[index].session_id == msg.session_id) {
							state.sessions.session_list[index].last_time = msg.transmit_time;
							state.sessions.session_list[index].last_record = msg.content;
							state.sessions.session_list[index].if_read = false;
							window.localStorage.setItem('sessions', JSON.stringify(state.sessions));
						}						
					}
				}

				console.log(msg)
			}
			const close = function() {
				console.log("socket已经关闭")
			}
			state.socket_instance = new WebSocket(state.path)
			state.socket_instance.onopen = open
			// 监听socket错误信息
			state.socket_instance.onerror = error
			// 监听socket消息
			state.socket_instance.onmessage = getMessage
		},

    
    	clearTempHis(state, data){
		  	state.temp_history = []
    	},
    	readCurSessionMessage(state, sessionId){
      		for(let index in state.sessions.session_list){
        		if(state.sessions.session_list[index].session_id == sessionId){
          			state.sessions.session_list[index].if_read = true;
        	}
        	window.localStorage.setItem('sessions', JSON.stringify(state.sessions))
			}
		}
	}

})
