<template>
  <el-col :span="15" class="sessionDetail">
    <div v-if="pageType==0"></div>
    <div v-else-if="pageType==1" class="sessionPage">
      <div class="sessionHead">
        <div class="chatLeft">
          <el-image :src="cur_session.avatar_url" class="chatAvatar" alt="用户头像"></el-image>
          <span
            class="friendName"
          >{{cur_session.group_name==undefined?(cur_session.friend_notes==undefined?cur_session.friend_nickname:cur_session.friend_notes):cur_session.group_name}}</span>
        </div>
        <el-button class="info" icon="el-icon-more"></el-button>
      </div>
      <div class="sessionArea" id="chat" ref='rightContent' @mousewheel="scrool">
        <div>加载中。。。</div>
        <div class="scrollContent">
          <div v-for="(i, index) in $store.state.temp_history[cur_session.session_id]" :key="index">
            <div class="sessionContentLeft" v-if="i.sender_id!=userInfo.user_id">
              <el-image :src="cur_session.avatar_url" class="chatAvatarUrl" alt="用户头像"></el-image>
              <div class="nameAndContent">
                <div style="font-size:1.6vh;font-weight:bold;">
                  <span style="padding-right:10px;">{{i.sender_name}}</span>
                  <span class="hoverTime">{{i.time}}</span>
                </div>
                <div class="chatContent">{{i.content}}</div>
              </div>
            </div>
            <div class="sessionContentRight" v-if="i.sender_id==userInfo.user_id">
              <div class="nameAndContent">
                <div style="font-size:1.6vh;font-weight:bold;">
                  <span class="hoverTime">{{i.time}}</span>
                  <span style="padding-left:10px;">{{i.sender_name}}</span>
                </div>
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
            <el-popover placement="top-start" width="400" trigger="click" class="emoBox">
              <div class="emotionList">
                <a href="javascript:void(0);" @click="getEmo(index)" v-for="(item,index) in faceList" :key="index"
                   class="emotionItem">{{item}}</a>
              </div>
              <el-button
                class="emotionSelect"
                icon="iconfont icon-biaoqing"
                slot="reference"
              ></el-button>
            </el-popover>
            <!-- <i class="el-icon-chat-dot-square"></i> -->
          </div>
          <!-- <div class="chatIcon">
            <i class="el-icon-phone-outline"></i>
            <i class="el-icon-video-camera"></i>
          </div>-->
        </div>
        <el-input
          v-model="textarea"
          class="chatText"
          resize="none"
          type="textarea"
          id='textarea'
          rows="5"
          @keyup.enter.native="sendInfo"
        ></el-input>

        <div class="chatBottom">
          <el-button icon="el-icon-s-promotion" class="sendButton" @click.native="sendInfo">发送(S)</el-button>
        </div>
      </div>
    </div>
    <div v-else-if="pageType==2" class="createGroup">
      <!-- 两个按钮，一个是创建群聊，另一个是查看被邀请加入群聊的申请列表 -->
      <div class="navTab">
        <el-button class="navBut" @click="toCreate">创建群聊</el-button>
        <el-button class="navBut" @click="toApply">新的邀请</el-button>
      </div>
      <div v-if="!navSelected" class="emptyPage">
        <p>请选择功能</p>
      </div>
      <!-- 创建群聊 -->
      <div v-if="navSelected==1" class="funcOne">
        <el-transfer
          class="mytransfer"
          v-model="value"
          filterable
          filter-placeholder="搜索好友"
          :render-content="renderFunc"
          :titles="['我的好友', '聊天室成员']"
          :format="{
        noChecked: '${total}',
        hasChecked: '${checked}/${total}'
      }"
          @change="handleChange"
          :data="transferData"
        >
        </el-transfer>
        <!-- 创建聊天室弹窗，填写详细资料 -->
        <el-dialog title="填写聊天室资料" :visible.sync="groupInfoVisible" class="groupDialog">
          <el-form :model="acceptForm">
            <el-form-item label="聊天室名称">
              <el-input v-model="groupName" clearable maxlength="10" show-word-limit class="groupNameInput" type="text"
                        autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="聊天室简介">
              <el-input v-model="groupIntro" clearable maxlength="50" show-word-limit class="groupNameInput"
                        type="textarea" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="groupInfoVisible = false">取 消</el-button>
            <el-button type="primary" @click="createGroup">确 定</el-button>
          </div>
        </el-dialog>
        <div>
          <el-button style="margin-top:10px;background: yellowgreen;font-weight: bold;" size="middle"
                     @click="toGroupInfo">创建聊天室
          </el-button>
        </div>
      </div>

      <div v-if="navSelected==2" class="applyList">
        <div class="friendApplyInfo" v-for="i in applicantList" :key="i.applicant_id">
          <el-image :src="i.avatar_url" class="head" alt="好友头像"></el-image>
          <div class="nameAndVerify">
            <div class="name">{{i.applicant_name}} 申请加入 {{i.group_name}}</div>
            <div
              class="verify"
            >{{i.verify_msg.length>25?i.verify_msg.slice(0,25)+"......":i.verify_msg}}
            </div>
          </div>
          <div class="state">
            <el-button v-if="i.flag==1" class="toAccept" @click="acceptApply(i)">接受</el-button>
            <el-button v-if="i.flag==1" class="toRefuse" @click="refuseApply(i)">拒绝</el-button>

            <div v-if="i.flag==2" class="refused">已拒绝</div>
            <div v-if="i.flag==3" class="accepted">已接受</div>
          </div>
        </div>
      </div>
    </div>
  </el-col>
</template>
<script>
    import {mapState, mapMutations} from "vuex";

    const appData = require("../static/utils/emoji.json");
    export default {
        name: "right-session",
        props: ["debugMode", "pageType"], // 获取父组件的传值
        computed: mapState({
            userInfo: state => state.user,
            cur_session: state => state.cur_session,
        }),
        mounted() {
            this.$api.main.getContacts({
                user_id: this.$store.state.user["user_id"]
            }).then(res => {
                    if (res.data.state == "0") {
                        this.$store.commit("getContacts", res.data);
                    } else {
                        this.$message.error("获取通讯录失败");
                    }
                });
            for (let i in appData) {
                this.faceList.push(appData[i].char);
            }
        },
        updated() {
            this.$refs.rightContent.addEventListener('scroll', this.scrool);
            this.$nextTick(function() {
                if (this.pageType == 1 ) {
                    console.log("sdsd````")
                    let msg = document.getElementById("chat"); // 获取对象
                    msg.scrollTop = msg.scrollHeight; // 滚动高度
                }
            })

        },
        watch:{
            cur_session(newValue, oldValue) {
            }
        },
        data() {
            return {
                firstChangeScro: 1,
                // 当前会话历史记录条数
                curHisCount: 0,
                ifGetExtra: true,
                navSelected: 0,
                applicantList: [],
                groupInfoVisible: false,
                textarea: "",
                faceList: [],
                groupName: '',
                groupIntro: '',
                msgObj: null,
                transferData: [],
                value: [this.$store.state.user.user_id],
                renderFunc(h, option) {
                    return <div style="display: flex;align-items: center;"><el-image style="min-height:20px;min-width: 20px;height: 20px;width: 20px;margin-right: 5px;border-radius: 100%;"
                    src={option.avatar_url}></el-image><span>{ option.label }</span></div>;
                }
            };
        },
        methods: {
            scrool() {
                let scrolled = this.$refs.rightContent.scrollTop;
                let temp = this.$store.state.temp_history[this.$store.state.cur_session.session_id]
                if(!temp) return;
                this.curHisCount = temp.length;
                if (scrolled == 0 && this.ifGetExtra){
                    let that = this
                    this.ifGetExtra = !this.ifGetExtra;
                    this.$api.main.getSessionsContent({
                            session_id: this.cur_session.session_id,
                            start: this.curHisCount + 1,
                            end: this.curHisCount + 11
                        }).then(res => {
                            console.log(res)
                                // 将获得的新数据连接到temp前端
                                res.data.history_list.push.apply(
                                 res.data.history_list,
                                 that.$store.state.temp_history[this.cur_session.session_id]
                            );
                          that.$store.state.temp_history[that.cur_session.session_id] = res.data.history_list;
                          that.curHisCount += 10;
                          let msg = document.getElementById("chat");
                          msg.scrollTop = msg.scrollHeight * 10/this.curHisCount;
                          setTimeout(function () {
                              that.ifGetExtra = !that.ifGetExtra;
                          }, 1000)  // 避免重复刷新
                        })
                }

            },
            handleChange(value, direction, movedKeys) {
                console.log(value, direction, movedKeys);
                console.log(this.value);
            },
            toCreate() {
                this.navSelected = 1;
                if (!this.$store.state.contacts.friend_list) {
                    this.$api.main.getContacts({
                        user_id: this.$store.state.user["user_id"]
                    })
                        .then(res => {
                            if (res.data.state == "0") {
                                this.$store.commit("getContacts", res.data);
                                const data = [];
                                let Data = res.data.friend_list;
                                data.push({
                                    key: this.userInfo.user_id,
                                    label: this.userInfo.nickname,
                                    disabled: true,
                                    avatar_url: this.userInfo.avatar_url
                                });
                                for (let i = 1; i <= Data.length; i++) {
                                    data.push({
                                        key: Data[i - 1].friend_id,
                                        label: (Data[i - 1].friend_note == undefined || Data[i - 1].friend_note == '') ? Data[i - 1].friend_name : Data[i - 1].friend_note,
                                        disabled: false,
                                        avatar_url: Data[i - 1].avatar_url
                                    });
                                }
                                this.transferData = data;
                                return;
                            } else {
                                this.$message.error("获取通讯录失败");
                            }
                        });
                } else {
                    const data = [];
                    let Data = this.$store.state.contacts.friend_list;
                    data.push({
                        key: this.userInfo.user_id,
                        label: this.userInfo.nickname,
                        disabled: true,
                        avatar_url: this.userInfo.avatar_url
                    });
                    for (let i = 1; i <= Data.length; i++) {
                        data.push({
                            key: Data[i - 1].friend_id,
                            label: (Data[i - 1].friend_note == undefined || Data[i - 1].friend_note == '') ? Data[i - 1].friend_name : Data[i - 1].friend_note,
                            disabled: false,
                            avatar_url: Data[i - 1].avatar_url
                        });
                    }
                    this.transferData = data;
                    return;
                }
            },
            toGroupInfo() {
                let member_list = [];
                for (let i = 0; i < this.value.length; i++) {
                    member_list.push({member_user_id: this.value[i]});
                }
                if (member_list.length > 1) {
                    this.groupInfoVisible = true;
                } else if (member_list.length <= 1) {
                    this.$message({
                        showClose: true,
                        message: "聊天室至少要两人才能组成",
                        type: 'warning'
                    });
                }
            },
            createGroup() {
                // console.log(JSON.parse(JSON.stringify(this.value)));
                let member_list = [];
                for (let i = 0; i < this.value.length; i++) {
                    member_list.push({member_user_id: this.value[i]});
                }
                if (this.groupName != "" && member_list.length > 1) {
                    this.$confirm('您将创建一个名为 “' + this.groupName + '” 的聊天室, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        center: true,
                        type: 'warning'
                    }).then(() => {
                        this.$api.group
                            .createGroup({
                                group_name: this.groupName,
                                member_list: member_list,
                                group_introduction: this.groupIntro
                            })
                            .then(res => {
                                console.log(res.data)
                                if (res.data.state == "0") {
                                    this.$message({
                                        type: 'success',
                                        message: '创建成功!'
                                    });
                                    this.groupInfoVisible = false;
                                    this.$api.main
                                        .getSessions({
                                            user_id: this.$store.state.user["user_id"]
                                        })
                                        .then(res => {
                                            if (res.data.state == "0") {
                                                this.$store.commit("getSessions", res.data);
                                            } else {
                                                this.$message.error("获取会话列表失败");
                                            }
                                        });
                                    this.toCreate();
                                } else {
                                    this.$message.error("群成员ID非法");
                                }
                            });
                    }).catch(() => {
                        this.$message({
                            showClose: true,
                            type: 'info',
                            message: '已取消'
                        });
                    });
                } else if (this.groupName == "") {
                    this.$message({
                        showClose: true,
                        message: "聊天室名称不能为空",
                        type: 'warning'
                    });
                } else if (member_list.length <= 1) {
                    this.$message({
                        showClose: true,
                        message: "聊天室至少要两人才能组成",
                        type: 'warning'
                    });
                }

            },
            toApply() {
                this.navSelected = 2;
                this.$api.user
                    .getGroupApplication({
                        user_id: this.$store.state.user["user_id"]
                    })
                    .then(res => {
                        console.log(res.data)
                        if (res.data.state == "0") {
                            this.applicantList = res.data.applicant_list;
                        } else {
                            this.$message({
                                showClose: true,
                                message: res.data.msg,
                                type: 'info'
                            });
                        }
                    });
            },
            acceptApply(i) {
                this.$api.group
                    .acceptGroupApplication({
                        group_id: i.group_id,
                        user_id: this.userInfo.user_id,
                        member_user_id: i.applicant_id,
                        if_accept: true
                    })
                    .then(res => {
                        console.log(res.data);
                        if (res.data.state == 0) {
                            this.$message.success("已接受对方申请");
                            // 更新通讯录
                            this.$api.main.getContacts({
                                user_id: this.$store.state.user["user_id"]
                            })
                                .then(res => {
                                    if (res.data.state == "0") {
                                        this.$store.commit("getContacts", res.data);
                                    } else {
                                        this.$message.error("获取通讯录失败");
                                    }
                                });
                            this.toApply(); // 刷新被申请表
                        } else if (res.data.state == 1) {
                            this.$message.error("对方已经是聊天室的成员");
                        }
                    });
            },
            refuseApply(i) {
                this.$api.group
                    .acceptGroupApplication({
                        group_id: i.group_id,
                        user_id: this.userInfo.user_id,
                        member_user_id: i.applicant_id,
                        if_accept: false
                    })
                    .then(res => {
                        console.log(res.data);
                        if (res.data.state == 0) {
                            this.$message.success("已拒绝对方的请求");
                            this.toApply(); // 刷新被申请表
                        } else if (res.data.state == 1) {
                            this.$message.error("对方已经是聊天室的成员");
                        }
                    });
            },
            getEmo(index) {
                var textArea = document.getElementById('textarea');

                function changeSelectedText(obj, str) {
                    if (window.getSelection) {
                        // 非IE浏览器
                        textArea.setRangeText(str);
                        // 在未选中文本的情况下，重新设置光标位置
                        textArea.selectionStart += str.length;
                        textArea.focus()
                    } else if (document.selection) {
                        // IE浏览器
                        obj.focus();
                        var sel = document.selection.createRange();
                        sel.text = str;
                    }
                }

                changeSelectedText(textArea, this.faceList[index]);
                this.textarea = textArea.value;
                return;
            },
            sendInfo() {
                if (this.textarea != "") {
                    this.$store.state.socket_instance.send(
                        JSON.stringify({
                            user_id: this.$store.state.user.user_id,
                            content: this.textarea,
                            session_id: this.cur_session.session_id,
                            sender_name: this.$store.state.user.nickname,
                            type: "chat"
                        })
                    );
                    this.textarea = "";
                    if (this.pageType == 1) {
                        let msg = document.getElementById("chat"); // 获取对象
                        msg.scrollTop = msg.scrollHeight; // 滚动高度
                    }
                    this.$store.commit("changeFirstSession", this.cur_session.session_id);
                    // console.log("success");
                }
            },
        }

    };
</script>

<style lang="scss">
  /* el-popover是和app同级的，所以scoped的局部属性设置了无效 */
  /* 需要设置全局style */
  .el-popover {
    height: 200px;
    width: 400px;
    overflow: scroll;
    overflow-x: auto;
  }
</style>

<style scoped>
  /* 会话窗口样式 */
  .sessionDetail {
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
    height: calc(10% - 1px);
    min-height: calc(10% - 1px);
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
    height: calc(65% - 1px);
    min-height: calc(65% - 1px);
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
    margin-bottom: 1.5vh;
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
    min-height: 6vh;
    min-width: 6vh;
    border-radius: 100%;
    margin-right: 15px;
  }

  .sessionContentLeft .nameAndContent .chatContent {
    word-break: break-all;
    text-align: left;
    margin-top: 1.2vh;
    margin-right: 2vh;
    padding: 1.2vh 1.8vh;
    background: #ffffff;
    border-radius: 5px;
    border: 1px solid #a4a6a9;
  }

  .hoverTime {
    display: none;
  }

  .sessionContentLeft:hover .hoverTime {
    display: contents;
  }

  .sessionContentRight {
    margin-top: 1.2vh;
    margin-bottom: 1.5vh;
    margin-right: 10px;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
  }

  .sessionContentRight .nameAndContent {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    text-align: right;
  }

  .sessionContentRight .chatAvatarUrl {
    height: 6vh;
    width: 6vh;
    min-height: 6vh;
    min-width: 6vh;
    border-radius: 100%;
    margin-left: 15px;
  }

  .sessionContentRight .nameAndContent .chatContent {
    word-break: break-all;
    text-align: left;
    margin-top: 1.2vh;
    margin-left: 2vh;
    padding: 1.2vh 1.8vh;
    background: #ffffff;
    border-radius: 5px;
    border: 1px solid #a4a6a9;
  }

  .sessionContentRight:hover .hoverTime {
    display: contents;
  }

  /* 底部发送框 */
  .sessionBottom {
    background: #ffffff;
    height: 25%;
    min-height: 25%;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-end;
  }

  .chatOption {
    background: #e7e7e7;
    width: 100%;
    min-height: 15%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .emotionSelect {
    background: #e7e7e7;
    height: 4vh;
    width: 4vh;
    text-align: center;
    cursor: default;
    padding: 0;
    border: none;
  }

  .chatIcon {
    padding: 0 10px;
    font-size: 25px;
  }

  .emotionList {
    display: flex;
    flex-wrap: wrap;
    padding: 5px;
  }

  .emotionItem {
    width: 10%;
    font-size: 20px;
    text-align: center;
  }

  /*包含以下四种的链接*/
  .emotionItem {
    text-decoration: none;
  }

  /*正常的未被访问过的链接*/
  .emotionItem:link {
    text-decoration: none;
  }

  /*已经访问过的链接*/
  .emotionItem:visited {
    text-decoration: none;
  }

  /*鼠标划过(停留)的链接*/
  .emotionItem:hover {
    text-decoration: none;
  }

  /* 正在点击的链接*/
  .emotionItem:active {
    text-decoration: none;
  }

  .chatText {
    height: 65%;
    min-height: 65%;
  }

  .chatText >>> .el-textarea__inner {
    border: none;
    height: 100%;
    font-size: 16px;
  }

  .chatBottom {
    height: 19%;
    min-height: 19%;
  }

  .sendButton {
    height: 100%;
    float: right;
  }

  /* 拉群 */
  .createGroup {
    height: 100%;
    width: 100%;
  }

  .groupDialog {
    margin: 0 auto;
    width: 70vw;
  }

  /* 顶部菜单 */
  .navTab {
    background: #ececec;
    padding: 3%;
    margin-bottom: 10px;
    width: 94%;
    border-radius: 10 rpx;
  }

  .navTab .navBut {
    width: 45%;
    background: #e2e2e2;
  }

  .funcOne {
    text-align: center;
    overflow: scroll;
    overflow-x: auto;
    overflow-y: auto;
  }

  .mytransfer {
    text-align: left;
    display: inline-block;
  }

  .mytransfer >>> .el-transfer-panel {
    border: 1px solid #ebeef5;
    border-radius: 4px;
    overflow: hidden;
    display: inline-block;
    vertical-align: middle;
    width: 240px;
    height: 38vh;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    position: relative;
  }

  .groupNameInput {
    margin-top: 10px;
  }

  /* 群被申请表 */
  .applyList {
    height: auto;
    width: 100%;
  }

  .friendApplyInfo {
    display: flex;
    flex-direction: row;
    justify-content: left;
    align-items: center;
    height: auto;
    margin-bottom: 20px;
  }

  .friendApplyInfo .head {
    margin-left: 20px;
    height: 4vw;
    width: 4vw;
    margin-right: 20px;
    border-radius: 100%;
  }

  .friendApplyInfo .nameAndVerify {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
  }

  .name {
    font-size: 1.6vh;
    font-weight: bold;
    margin-bottom: 4px;
  }

  .verify {
    font-size: 1.2vh;
  }

  /* 申请信息状态栏 */
  .state {
    position: absolute;
    right: 20px;
  }

  .state .toAccept {
    background: yellowgreen;
    font-weight: bold;
  }

  .state .toRefuse {
    background: salmon;
    font-weight: bold;
  }

  .state .refused {
    padding: 10px 10px;
    width: 50px;
    font-size: 14px;
    font-weight: bold;
    background: #e2e2e2;
  }

  .state .accepted {
    padding: 10px 10px;
    width: 50px;
    font-size: 14px;
    font-weight: bold;
    background: #e2e2e2;
  }
</style>
