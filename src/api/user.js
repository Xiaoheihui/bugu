import axios from './http';

const user = {
  //用户注册
  register(params) {
    return axios.post("/register", JSON.stringify(params));
  },
  //用户登录
  login(params) {
    return axios.post("/login", JSON.stringify(params));
  },
  //获取用户信息
  getUser(params) {
    return axios.post("/getUser", JSON.stringify(params));
  },
  //修改用户信息
  editUser(params) {
    return axios.post("/editUser", JSON.stringify(params));
  },
  //获取好友被申请列表
  getFriendApplication(params) {
    return axios.post("/getFriendApplication", JSON.stringify(params));
  },
  //获取群被申请列表
  getGroupApplication(params) {
    return axios.post("/getGroupApplication", JSON.stringify(params));
  },
  //通过手机号搜索用户
  searchUser(params){
    return axios.post("/searchUser", JSON.stringify(params));
  },
  //更新会话最后一条消息的时间
  updateLastTime(params){
    return axios.post("/update_last_time", JSON.stringify(params));
  },
  //更新用户离开会话的时间
  updateLeaveTime(params){
    return axios.post("/update_leave_time", JSON.stringify(params));
  },
  //检测聊天消息是否涉嫌黄色暴力，涉及政治
  checkContent(params){
    return axios.post("/checkContent", JSON.stringify(params));
  },
  //检测聊天图片是否涉嫌黄色暴力，涉及政治
  checkPicture(params){
    return axios.post("/checkPicture", JSON.stringify(params));
  },
};

export default user;
