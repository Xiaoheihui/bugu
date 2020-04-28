import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {
      user_id: window.localStorage.getItem('user' || '[]') == null ? '' : JSON.parse(window.localStorage.getItem('user' || '[]')).user_id,
      avatar_url: window.localStorage.getItem('user' || '[]') == null ? '' : JSON.parse(window.localStorage.getItem('user' || '[]')).avatar_url
    },
    contacts:{
      friend_list: window.localStorage.getItem('contacts' || '[]') == null ? '' : JSON.parse(window.localStorage.getItem('contacts' || '[]')).friend_list,
      group_list: window.localStorage.getItem('contacts' || '[]') == null ? '' : JSON.parse(window.localStorage.getItem('contacts' || '[]')).group_list,
    }
  },
  mutations: {
    login (state, user) {
      state.user = user
      window.localStorage.setItem('user', JSON.stringify(user))
    },
    getContacts (state,contacts){
      state.contacts=contacts
      window.localStorage.setItem('contacts', JSON.stringify(contacts))
    }
  }
})
