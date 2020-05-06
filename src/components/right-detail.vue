<template>
  <el-col :span="15" class="detailPage">
    <!-- pageType代表右边展示页面的类型 -->
    <!-- 0表示无内容 -->
    <div v-if="pageType==0" class="emptyPage">暂无内容</div>
    <!-- 1表示好友信息的详情页 -->
    <div v-if="pageType==1" class="friendDetail">
      <div class="friendIcon">
        <el-image :src="selectedFriendInfo.avatar_url" class="head" alt="好友头像"></el-image>
        <span class="name">{{selectedFriendInfo.friend_name}}</span>
      </div>
      <div class="diviveLine"></div>
      <div class="friendInfo">
        <div class="infoHeader">
          <div>备注</div>
          <div>手机号</div>
          <div>性别</div>
          <div>地区</div>
          <div>个性签名</div>
        </div>
        <div class="infoContent">
          <div>{{selectedFriendInfo.friend_note}}</div>
          <div>{{selectedFriendInfo.phone}}</div>
          <div>{{selectedFriendInfo.gender?'男':'女'}}</div>
          <div>{{selectedFriendInfo.location}}</div>
          <div>{{selectedFriendInfo.signature}}</div>
        </div>
      </div>
    </div>
    <!-- 2表示群消息的详情页 -->
    <div v-if="pageType===2" class="groupDetail">
      <div class="groupTitle">{{selectedGroupInfo.group_name}}</div>
    </div>
    <!-- 3表示添加好友和查看好友申请的详情页 -->
    <div v-if="pageType==3" class="applyPage">
      <!-- 两个按钮，一个是搜索并添加好友，另一个是查看被申请列表 -->
      <div class="navTab">
        <el-button class="navBut" @click="toAdd">添加好友</el-button>
        <el-button class="navBut" @click="toApply">新的朋友</el-button>
      </div>
      <div v-if="!navSelected" class="addFriend">
        <el-input
          clearable
          v-model="searchInput"
          class="navInput"
          placeholder="搜索手机号并回车"
          prefix-icon="el-icon-search"
          @keyup.enter.native="searchEnterFun"
        ></el-input>
        <div class="result" v-if="this.searchFriendResult!=null">
          <div class="friendIcon">
            <el-image :src="searchFriendResult.avatar_url" class="head" alt="好友头像"></el-image>
            <span class="name">{{searchFriendResult.nickname}}</span>
          </div>
          <div class="diviveLine"></div>
          <div class="friendInfo">
            <div class="infoHeader">
              <div>手机号</div>
              <div>性别</div>
              <div>地区</div>
              <div>个性签名</div>
            </div>
            <div class="infoContent">
              <div>{{searchFriendResult.phone}}</div>
              <div>{{searchFriendResult.gender?'男':'女'}}</div>
              <div>{{searchFriendResult.location}}</div>
              <div>{{searchFriendResult.signature}}</div>
            </div>
          </div>
          <el-button class="toAddBut" @click="applyFormVisible = true">添加为联系人</el-button>
          <!-- 好友申请弹窗，发送验证消息以及设置好友备注 -->
          <el-dialog title="好友申请" :visible.sync="applyFormVisible">
            <el-form :model="applyForm">
              <el-form-item label="验证信息">
                <el-input v-model="applyForm.verify" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="好友备注">
                <el-input v-model="applyForm.notes" autocomplete="off"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="applyFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="addUser(searchFriendResult.phone)">确 定</el-button>
            </div>
          </el-dialog>
        </div>
      </div>
      <div v-if="navSelected" class="applyList">
        <div class="friendApplyInfo" v-for="i in applicantList" :key="i.applicant_id">
          <el-image :src="i.avatar_url" class="head" alt="好友头像"></el-image>
          <div class="nameAndVerify">
            <div class="name">{{i.applicant_name}}</div>
            <div
              class="verify"
            >{{i.verify_msg.length>25?i.verify_msg.slice(0,25)+"......":i.verify_msg}}</div>
          </div>
          <div class="state">
            <el-button v-if="i.flag==1" class="toAccept" @click="toDialog(i.applicant_id)">接受</el-button>
              <!-- 接受申请弹窗，对好友设置备注 -->
              <el-dialog title="接受申请" :visible.sync="acceptApplyVisible">
                <el-form :model="acceptForm">
                  <el-form-item label="好友备注">
                    <el-input v-model="acceptForm.notes" autocomplete="off"></el-input>
                  </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                  <el-button @click="acceptApplyVisible = false">取 消</el-button>
                  <el-button type="primary" @click="acceptApply()">确 定</el-button>
                </div>
              </el-dialog>
            <el-button v-if="i.flag==1" class="toRefuse" @click="refuseApply(i.applicant_id)">拒绝</el-button>

            <div v-if="i.flag==2" class="refused">已拒绝</div>
            <div v-if="i.flag==3" class="accepted">已接受</div>
          </div>
        </div>
      </div>
    </div>
  </el-col>
</template>
<script>
export default {
  name: "right-detail",
  props: ["pageType", "selectedFriendInfo", "selectedGroupInfo"], // 获取父组件的传值
  data() {
    return {
      navSelected: 0,
      searchInput: "",
      applyFormVisible: false,
      acceptApplyVisible: false,
      searchFriendResult: null,
      applicantList: [],
      applicant_id_selected: 0,
      applyForm: {
        verify: "",
        notes: ""
      },
      acceptForm: {
        notes: ""
      }
    };
  },
  methods: {
    getContacts() {
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
    },
    toAdd() {
      this.navSelected = 0;
    },
    toDialog(id){
      this.applicant_id_selected=id;
      this.acceptApplyVisible=true;
    },
    toApply() {
      this.navSelected = 1;
      this.$api.user
        .getFriendApplication({
          user_id: this.$store.state.user["user_id"]
        })
        .then(res => {
          if (res.data.state == "0") {
            this.applicantList = res.data.applicant_list;
          } else {
            this.$message.error("获取好友申请列表失败");
          }
        });
    },
    searchEnterFun: function(e) {
      var keyCode = window.event ? e.keyCode : e.which;
      if (keyCode == 13 && this.searchInput) {
        let reg = new RegExp("^1(3|4|5|7|8)\\d{9}$");
        if (!reg.test(this.searchInput)) {
          this.$message.error("请输入正确的手机号码");
        } else if (this.$store.state.user["phone"] == this.searchInput) {
          this.$message.error("你输入了自己的账号，请换一个");
        } else {
          this.$api.user
            .searchUser({
              phone: this.searchInput
            })
            .then(res => {
              let result = res.data.result;
              if (res.data.state == "0") {
                let list = this.$store.state.contacts.friend_list;
                for (let i = 0; i < list.length; i++) {
                  if (result["phone"] == list[i]["phone"]) {
                    this.$message.success("你们已经是好友了");
                    return;
                  }
                }
                this.$message.success("找到目标好友");
                this.searchFriendResult = result;
                // console.log(this.searchFriendResult);
              } else if (res.data.state == "1") {
                this.$message.error("没找到目标好友");
              } else {
                this.$message.error("请求超时");
              }
            });
        }
      }
    },
    addUser(phone) {
      this.$api.friend
        .addUser({
          user_id: this.$store.state.user["user_id"],
          friend_phone: phone,
          verify_msg: this.applyForm.verify,
          friend_notes: this.applyForm.notes
        })
        .then(res => {
          // console.log(res.data);
          if (res.data.state == 0) {
            this.$message.success("已发出申请");
            this.applyFormVisible = false;
          } else {
            this.$message.error("申请失败，请重试");
          }
        });
    },
    acceptApply() {
      this.$api.friend
        .acceptFriendApplication({
          apply_user_id: this.applicant_id_selected,
          applyed_user_id: this.$store.state.user["user_id"],
          if_accept: true,
          friend_notes: this.acceptForm.notes
        })
        .then(res => {
          // console.log(res.data);
          if (res.data.state == 0) {
            this.$message.success("好友添加成功");
            this.getContacts(); // 更新通讯录
            this.toApply(); // 刷新被申请表
            this.acceptApplyVisible = false;
          } else if (res.data.state == 1) {
            this.$message.success("好友关系已存在");
          }
        });
    },
    refuseApply(applicant_id) {
      this.$api.friend
        .acceptFriendApplication({
          apply_user_id: applicant_id,
          applyed_user_id: this.$store.state.user["user_id"],
          if_accept: false
        })
        .then(res => {
          // console.log(res.data);
          if (res.data.state == 0) {
            this.$message.success("已拒绝对方的请求");
            this.toApply(); // 刷新被申请表
          }
        });
    }
  }
};
</script>
<style scoped>
/* 详情页样式 */
.detailPage {
  border-left:1px solid #a4a6a9;
  background: #f4f4f4;
  height: 100%;
  width: 62.5%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  border-top-right-radius: 3px;
  border-bottom-right-radius: 3px;
}
.friendDetail {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
}
.friendIcon {
  display: flex;
  align-items: center;
  position: relative;
  margin-left: 10%;
  margin-top: 10%;
  height: auto;
}
.friendIcon .head {
  height: 7vh;
  width: 7vh;
  border-radius: 100%;
}
.friendIcon .name {
  margin-left: 20px;
  font-size: 1.8vh;
  font-weight: bold;
}
.diviveLine {
  margin: 10% 10%;
  width: 80%;
  height: 2px;
  border-radius: 50px;
  background: #bbbbbb;
}
.friendInfo {
  margin-left: 18%;
  margin-right: 12%;
  height: auto;
  display: flex;
  flex-direction: row;
  justify-content: left;
  align-items: flex-start;
}
.friendInfo .infoHeader {
  font-size: 1.8vh;
  font-weight: bold;
  text-align: left;
  width: 100px;
  line-height: 26px;
}

.friendInfo .infoContent {
  font-size: 1.8vh;
  font-weight: bold;
  text-align: left;
  line-height: 26px;
}
/* 添加好友页 */
.applyPage {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
/* 顶部菜单 */
.navTab {
  background: #ececec;
  padding: 3%;
  margin-bottom: 10px;
  width: 94%;
  border-radius: 10rpx;
}
.navTab .navBut {
  width: 45%;
  background: #e2e2e2;
}
.addFriend {
  width: 90%;
}
/* 好友被申请表 */
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
/* 添加好友按钮 */
.toAddBut {
  background: #e2e2e2;
  margin-top: 6vh;
  padding: 25px 30px;
  border-radius: 5%;
  font-size: 1.8vh;
  font-weight: bolder;
}
</style>