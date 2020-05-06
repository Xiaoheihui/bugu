import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		user: {
			user_id: window.localStorage.getItem('user' || '[]') == null ? '' : JSON.parse(window.localStorage.getItem('user' || '[]')).user_id,
			phone: window.localStorage.getItem('user' || '[]') == null ? '' : JSON.parse(window.localStorage.getItem('user' || '[]')).phone,
			email: window.localStorage.getItem('user' || '[]') == null ? '' : JSON.parse(window.localStorage.getItem('user' || '[]')).email,
			nickname: window.localStorage.getItem('user' || '[]') == null ? '' : JSON.parse(window.localStorage.getItem('user' || '[]')).nickname,
			gender: window.localStorage.getItem('user' || '[]') == null ? '' : JSON.parse(window.localStorage.getItem('user' || '[]')).gender,
			birthday: window.localStorage.getItem('user' || '[]') == null ? '' : JSON.parse(window.localStorage.getItem('user' || '[]')).birthday,
			location: window.localStorage.getItem('user' || '[]') == null ? '' : JSON.parse(window.localStorage.getItem('user' || '[]')).location,
			signature: window.localStorage.getItem('user' || '[]') == null ? '' : JSON.parse(window.localStorage.getItem('user' || '[]')).signature,
			avatar_url: window.localStorage.getItem('user' || '[]') == null ? '' : JSON.parse(window.localStorage.getItem('user' || '[]')).avatar_url
		},
		contacts: {
			friend_list: window.localStorage.getItem('contacts' || '[]') == null ? '' : JSON.parse(window.localStorage.getItem('contacts' || '[]')).friend_list,
			group_list: window.localStorage.getItem('contacts' || '[]') == null ? '' : JSON.parse(window.localStorage.getItem('contacts' || '[]')).group_list,
		},
		sessions: {
			session_list: window.localStorage.getItem('sessions' || '[]') == null ? '' : JSON.parse(window.localStorage.getItem('sessions' || '[]')).session_list,
		},
		cur_session: window.localStorage.getItem('cur_session' || '[]') == null ? '' : JSON.parse(window.localStorage.getItem(
			'cur_session' || '[]')),
		socket_instance: null,
		path: "ws://localhost:8001",
	},
	mutations: {
		login(state, user) {
			state.user = user
			window.localStorage.setItem('user', JSON.stringify(user))
			const open = function () {
				console.log("socket连接成功")
				state.socket_instance.send(JSON.stringify({
					user_id: state.user.user_id,
					type: 'login'
				}))
			}
			const error = function () {
				console.log("连接错误")
			}
			const getMessage = function (msg) {
				console.log(msg.data)
			}
			const close = function () {
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
			const open = function () {
				console.log("socket连接成功")
				state.socket_instance.send(JSON.stringify({
					user_id: state.user.user_id,
					type: 'login'
				}))
			}
			const error = function () {
				console.log("连接错误")
			}
			const getMessage = function (msg) {
				console.log(JSON.parse(msg.data))
			}
			const close = function () {
				console.log("socket已经关闭")
			}
			state.socket_instance = new WebSocket(state.path)
			state.socket_instance.onopen = open
			// 监听socket错误信息
			state.socket_instance.onerror = error
			// 监听socket消息
			state.socket_instance.onmessage = getMessage
		}
	}
})

