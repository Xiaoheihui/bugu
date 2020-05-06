<template>
  <el-col :span="15" class="sessionDetail">
    <div v-if="pageType==1" class="sessionPage">
      <div class="sessionHead">
        <div class="chatLeft">
          <el-image :src="cur_session.avatar_url" class="chatAvatar" alt="用户头像"></el-image>
          <span
            class="friendName"
          >{{cur_session.group_name==undefined?(cur_session.friend_notes==undefined?cur_session.friend_nickname:cur_session.friend_notes):cur_session.group_name}}</span>
        </div>
        <el-button class="info" icon="el-icon-more"></el-button>
      </div>
      <div class="sessionArea" id="chat">
        <div class="scrollContent">
          <div v-for="i in selectedSessionHistory" :key="i.time">
            <div class="sessionContentLeft" v-if="i.sender_id!=userInfo.user_id">
              <el-image :src="cur_session.avatar_url" class="chatAvatarUrl" alt="用户头像"></el-image>
              <div class="nameAndContent">
                <div style="font-size:1.6vh;font-weight:bold;">{{i.sender_name}}</div>
                <div class="chatContent">{{i.content}}</div>
              </div>
            </div>
            <div class="sessionContentRight" v-if="i.sender_id==userInfo.user_id">
              <div class="nameAndContent">
                <div style="font-size:1.6vh;font-weight:bold;">{{i.sender_name}}</div>
                <div class="chatContent">{{i.content}}</div>
              </div>
              <el-image :src="userInfo.avatar_url" class="chatAvatarUrl" alt="用户头像"></el-image>
            </div>
          </div>
        </div>
      </div>
      <div class="sessionBottom">
        <div class="chatOption">
          <div class="chatIcon">
            <i class="el-icon-folder-opened"></i>
            <i class="el-icon-scissors"></i>
            <i class="el-icon-chat-dot-square"></i>
          </div>
          <div class="chatIcon">
            <i class="el-icon-phone-outline"></i>
            <i class="el-icon-video-camera"></i>
          </div>
        </div>
        <el-input v-model="textarea" class="chatText" resize="none" type="textarea" rows="5" @keyup.enter.native="sendInfo"></el-input>

        <div class="chatBottom">
          <el-button class="sendButton" @click="sendInfo">发送(S)</el-button>
        </div>
      </div>
    </div>
  </el-col>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {

  name: "right-session",
  props: ["pageType", "selectedSessionHistory"], // 获取父组件的传值
  computed: mapState({
    userInfo: state => state.user,
    cur_session: state => state.cur_session
  }),
  updated() {
    this.$nextTick(() => {
      let msg = document.getElementById("chat"); // 获取对象
      msg.scrollTop = msg.scrollHeight; // 滚动高度
    });
  },
  data() {
    return {
      textarea: ""
    };
  },
  methods: {
    sendInfo() {
      this.$store.state.socket_instance.send(
        JSON.stringify({
          user_id: this.$store.state.user.user_id,
          content: this.textarea,
          session_id: this.cur_session.session_id,
          sender_name: this.$store.state.user.nickname,
          type: "chat"
        })
      );

      this.$emit("lastText", this.textarea);
        this.$store.commit("updateSessionHistory",
            {
              session_id: this.cur_session.session_id,
              last_record:this.textarea,
              last_time: this.$moment().utcOffset(+8).format('YYYY-MM-DD HH:mm:ss')
            }
         )
        this.textarea = "";
      console.log("success");
    },
  }
};
</script>

<style scoped>
/* 会话窗口样式 */
.sessionDetail{
  border-left: 1px solid #a4a6a9;
  background: #e7e7e7;
  height: 100%;
  width: 62.5%;
  display: flex;
  flex-direction: column;
  z-index: 3;
  border-top-right-radius: 3px;
  border-bottom-right-radius: 3px;
}
.sessionPage {
  height: 100%;
  width: auto;
}
.sessionHead {
  background: #e0e0e0;
  height: 10%;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #a4a6a9;
}
.chatLeft {
  left: 5%;
  position: relative;
  height: 100%;
  display: flex;
  align-items: center;
}
.chatAvatar {
  height: 7vh;
  width: 7vh;
  border-radius: 100%;
  margin-right: 30px;
}
.friendName {
  font-size: 18px;
  font-weight: bold;
}
.info {
  background: none;
  border: none;
  font-size: 20px;
  position: relative;
  right: 5%;
}
/* 聊天区域展示的聊天记录 */
.sessionArea {
  height: 70%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  border-bottom: 1px solid #a4a6a9;
  overflow: scroll;
  overflow-x: auto;
  overflow-y: auto;
}
.scrollContent {
  max-height: 100%;
  width: 100%;
}
.sessionContentLeft {
  margin-top: 1.2vh;
  margin-bottom: 1vh;
  margin-left: 10px;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  text-align: left;
}
.sessionContentLeft .nameAndContent {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.sessionContentLeft .chatAvatarUrl {
  height: 6vh;
  width: 6vh;
  border-radius: 100%;
  margin-right: 15px;
}
.sessionContentLeft .nameAndContent .chatContent {
  margin-top: 1.2vh;
  padding: 1.2vh 1.8vh;
  background: #ffffff;
  border-radius: 5px;
  border: 1px solid #a4a6a9;
}
.sessionContentRight {
  margin-top: 1.2vh;
  margin-bottom: 1vh;
  margin-right: 10px;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}
.sessionContentRight .nameAndContent {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
.sessionContentRight .chatAvatarUrl {
  height: 6vh;
  width: 6vh;
  border-radius: 100%;
  margin-left: 15px;
}
.sessionContentRight .nameAndContent .chatContent {
  margin-top: 1.2vh;
  padding: 1.2vh 1.8vh;
  background: #ffffff;
  border-radius: 5px;
  border: 1px solid #a4a6a9;
}
.sessionBottom {
  background: #ffffff;
  width: 100%;
  display: flex;
  flex-direction:column;
  justify-content: space-between;
  align-items: flex-end;
}
.chatOption {
  background: #e7e7e7;
  width: 100%;
  height:auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.chatIcon {
  padding: 0 10px;
  font-size: 25px;
}
.chatText{
  height:auto;
}
.chatText >>> .el-textarea__inner {
  border: none;
}
.chatBottom{
  height: auto;
}
.sendButton {
  float: right;
}
</style>
