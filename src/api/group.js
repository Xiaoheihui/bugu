import axios from "./http";

const group = {
  //加入聊天室
  addGroup(params) {
    return axios.post("/addGroup", JSON.stringify(params));
  },
  //退出聊天室
  deleteGroup(params) {
    return axios.post("/deleteGroup", JSON.stringify(params));
  },
  //获取聊天室信息
  getGroupInfo(params) {
    return axios.post("/getGroupInfo", JSON.stringify(params));
  },
  //获取群成员信息
  getGroupMemberInfo(params) {
    return axios.post("/getGroupMemberInfo", JSON.stringify(params));
  },
  //创建聊天室
  createGroup(params) {
    return axios.post("/createGroup", JSON.stringify(params));
  },
  //修改聊天室信息
  editGroupInfo(params) {
    return axios.post("/editGroupInfo", JSON.stringify(params));
  },
  //聊天室邀请新成员
  addGroupMember(params) {
    return axios.post("/addGroupMember", JSON.stringify(params));
  },
  //接受入群申请
  acceptGroupApplication(params) {
    return axios.post("/acceptGroupApplication", JSON.stringify(params));
  },
  //聊天室踢除成员
  deleteGroupMember(params) {
    return axios.post("/deleteGroupMember", JSON.stringify(params));
  },
  //解散聊天室
  dismissGroup(params) {
    return axios.post("/dismissGroup", JSON.stringify(params));
  }
};

export default group;