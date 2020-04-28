import axios from "./http";

const friend = {
  //添加好友
  addUser(params) {
    return axios.post("/addUser", JSON.stringify(params));
  },
  //删除好友
  deleteUser(params) {
    return axios.post("/deleteUser", JSON.stringify(params));
  },
  //获取好友信息
  getFriendInfo(params) {
    return axios.post("/getFriendInfo", JSON.stringify(params));
  },
  //接受好友申请
  acceptFriendApplication(params) {
    return axios.post("/acceptFriendApplication", JSON.stringify(params));
  }
};

export default friend;
