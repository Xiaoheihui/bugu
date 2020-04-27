import axios from './http';

const user = {
  //用户注册
  register(params){
    return axios.post('/register', JSON.stringify(params))
  },
  //用户登录
  login(params){
    return axios.post('/login', JSON.stringify(params))
  },

}

export default user;
