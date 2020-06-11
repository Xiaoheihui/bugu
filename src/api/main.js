import axios from "./http";

const main = {
  //获取聊天记录
  getSessionsContent(params) {
    return axios.post("/getSessionsContent", JSON.stringify(params));
  },
  //获取会话记录
  getSessions(params) {
    return axios.post("/getSessions", JSON.stringify(params));
  },
  //获取通讯录列表
  getContacts(params) {
    return axios.post("/getContacts", JSON.stringify(params));
  },
  // 获得群员头像列表
  getAvatarMap(params){
    return axios.post("/ID_to_avatar", JSON.stringify(params));
  },
};

export default main;
