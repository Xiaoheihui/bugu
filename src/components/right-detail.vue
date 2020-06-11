<template>
  <el-col :span="15" class="detailPage">
    <!-- pageType代表右边展示页面的类型 -->
    <!-- 0表示无内容 -->
    <div v-if="pageType==0" class="emptyPage"></div>
    <!-- 1表示好友信息的详情页 -->
    <div v-if="pageType==1" class="friendDetail">
      <el-popover
        placement="top-end"
        width="150"
        height="100"
        v-model="deleteFriendVisible">
        <p>您希望删除好友吗？</p>
        <div style="text-align: center;">
          <el-button size="mini" type="primary" @click="deleteFriendVisible = false">取消</el-button>
          <el-button type="primary" size="mini" @click="deleteFriend">确定</el-button>
        </div>
        <el-button class="info" icon="el-icon-more" slot="reference"></el-button>
      </el-popover>
      <div class="friendIcon">
        <el-image :src=$store.state.avatar_list[selectedFriendInfo.friend_id] class="head" alt="好友头像"></el-image>
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
          <el-input class="friendNoteInput"
  show-word-limit v-model="selectedFriendInfo.friend_note" :disabled="!isEdit" maxlength="8">{{selectedFriendInfo.friend_note}}</el-input>
          <div>{{selectedFriendInfo.phone}}</div>
          <div>{{selectedFriendInfo.gender?'男':'女'}}</div>
          <div>{{selectedFriendInfo.location==''?'无':selectedFriendInfo.location}}</div>
          <div>{{selectedFriendInfo.signature==''?'这个人什么都没有留下':selectedFriendInfo.signature}}</div>
        </div>
      </div>
      <div class="editNote">
        <el-button type="primary" :disabled="isEdit" @click="isEdit=true">
          修改备注
        </el-button>
        <el-button type="primary" :disabled="!isEdit" @click="saveNote">
          保存
        </el-button>
      </div>
      <div class="toSessionRouter">
        <router-link :to="{name:'main',params:{id:targetSessionId}}">
          <el-button type="primary" plain round v-on:click="toSession(selectedFriendInfo.friend_id ,1)">发起会话</el-button>
        </router-link>
      </div>
    </div>
    <!-- 2表示群消息的详情页 -->
    <div v-if="pageType===2" class="groupDetail">
      <div class="groupHeader">
        <el-image :src="selectedGroupInfo.group_avatar" class="groupAvatar"></el-image>
        <div class="groupTitle">{{selectedGroupInfo.group_name}}({{selectedGroupInfo.member_num}})</div>
      </div>
      <div class="memberList">
        <div class="memberIcon">
          <el-image @click="toAddMember" class="memberAvatar" src="https://bugu-1300789911.cos.ap-guangzhou.myqcloud.com/1591878363000.jpeg"></el-image>
          <div class="memberName">添加成员</div>
        </div>
        <div class="memberIcon" v-for="i in selectedGroupInfo.member_list" :key="i.group_id">
          <el-image class="memberAvatar" :src="i.avatar_url"></el-image>
          <div class="memberName">{{i.user_notes==undefined?i.nickname.slice(0,4)+'...':i.user_notes.slice(0,4)+'...'}}</div>
        </div>
      </div>
      <div class="groupIntroduct">
        <div class="groupTitle">聊天室简介：</div>
      </div>
      <div class="intro">
        {{selectedGroupInfo.introduction==""?"群主很懒，什么都没有留下。":selectedGroupInfo.introduction}}
      </div>
      <div class="toSessionRouter2">
        <router-link :to="{name:'main',params:{id:targetSessionId}}">
          <el-button type="primary" plain round v-on:click="toSession(selectedGroupInfo.group_id ,2)">发起会话</el-button>
        </router-link>
      </div>
    </div>
    <!-- 3表示添加好友和查看好友申请的详情页 -->
    <div v-if="pageType==3" class="applyPage">
      <!-- 两个按钮，一个是搜索并添加好友，另一个是查看被申请列表 -->
      <div class="navTab">
        <el-button class="navBut" @click="toAdd">添加好友</el-button>
        <el-button class="navBut" @click="toApply">
          <el-badge :is-dot="applicantLen!=0" class="item">
          <div style="padding-right:5px;">新的朋友</div>
          </el-badge>
        </el-button>
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
        <div class="friendApplyInfo" v-for="(i, index) in applicantList" :key="index">
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
                  <el-button @click="acceptApplyVisible = false;">取 消</el-button>
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
    <el-dialog title="邀请新成员" :visible.sync="inviteMemberVisible">
      <div class="inviteForm">
        <el-transfer
          class="mytransfer"
          v-model="value"
          filterable
          filter-placeholder="搜索好友"
          :render-content="renderFunc"
          :titles="['可邀请好友', '聊天室成员']"
          :format="{
            noChecked: '${total}',
            hasChecked: '${checked}/${total}'
          }"
          :data="transferData"
        >
        </el-transfer>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="inviteMemberVisible = false">取 消</el-button>
        <el-button type="primary" @click="addNewMember">确 定</el-button>
      </div>
    </el-dialog>
  </el-col>
</template>
<script>
export default {
  name: "right-detail",
  props: ["pageType", "selectedFriendInfo", "selectedGroupInfo"], // 获取父组件的传值
  data() {
    return {
      isEdit:false,
      navSelected: 0,
      targetSessionId: -1,
      searchInput: "",
      inviteMemberVisible:false,
      group:[{avatar_url:'',friend_name:"sss"},{avatar_url:'',friend_name:"sss"},{avatar_url:'',friend_name:"sss"},
      {avatar_url:'',friend_name:"sss"},
      {avatar_url:'',friend_name:"sss"},
      {avatar_url:'',friend_name:"sss"}],
      deleteFriendVisible:false,
      applyFormVisible: false,
      acceptApplyVisible: false,
      searchFriendResult: null,
      applicantList: [],
      applicantLen: 0,
      applicant_id_selected: 0,
      applyForm: {
        verify: "",
        notes: ""
      },
      acceptForm: {
        notes: ""
      },
      transferData: [],
      value: [],
      renderFunc(h, option) {
        return <div style="display: flex;align-items: center;"><el-image style="min-height:20px;min-width: 20px;height: 20px;width: 20px;margin-right: 5px;border-radius: 100%;"
          src={option.avatar_url}></el-image><span>{ option.label }</span></div>;
      }
    };
  },
  mounted(){
    this.$api.user
    .getFriendApplication({
      user_id: this.$store.state.user["user_id"]
    })
    .then(res => {
      if (res.data.state == "0") {
        this.applicantList = res.data.applicant_list;
        this.applicantLen = res.data.unApplyLen;
      } else {
        this.$message.error("获取好友申请列表失败");
      }
    });
  },
  methods: {
    toAddMember() {
      this.inviteMemberVisible=true;
      const data = [];
      let Data=this.$store.state.contacts.friend_list;
      let groupMem=[];
      for(let j = 0; j < this.selectedGroupInfo.member_list.length; j++){
        groupMem.push(this.selectedGroupInfo.member_list[j].user_id)
      }
      for (let i = 0; i < Data.length; i++) {
        if(groupMem.indexOf(Data[i].friend_id)==-1){
          data.push({
            key: Data[i].friend_id,
            label: (Data[i].friend_note==undefined||Data[i].friend_note=='')?Data[i].friend_name:Data[i].friend_note,
            disabled: false,
            avatar_url: this.$store.state.avatar_list[Data[i].friend_id]
          })
        }
      }
      this.transferData=data;
    },
    addNewMember(){
      let member_list=[];
      for(let i = 0;i<this.value.length;i++){
        member_list.push({member_user_id: this.value[i]});
      }
      console.log(member_list)
      if(member_list.length){
        this.$confirm('确定邀请这些用户加入名为 “'+this.selectedGroupInfo.group_name+'” 的聊天室吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          center: true,
          type: 'warning'
        }).then(() => {
          this.$api.group
          .addGroupMember({
            user_id: this.$store.state.user.user_id,
            group_id: this.selectedGroupInfo.group_id,
            new_member_list: member_list,
          })
          .then(res => {
            if (res.data.state == "0") {
              this.$message({
                type: 'success',
                message: '邀请成功，好友已加入聊天室!'
              });
              this.inviteMemberVisible=false;
              this.selectedGroupInfo=res.data.groupInfo;
            } else {
              this.$message.error(res.data.msg);
            }
          });
        }).catch(() => {
          this.$message({
            showClose: true,
            type: 'info',
            message: '已取消'
          });
        });
      }else if(!member_list.length){
        this.$message({
          showClose: true,
          message: "至少要邀请一人",
          type: 'warning'
        });
      }
    },
    getContacts() {
      this.$api.main.getContacts({
          user_id: this.$store.state.user["user_id"]
        })
        .then(res => {
          if (res.data.state == "0") {
            this.$store.commit("getContacts", res.data);
            this.$emit("updateContact",res.data);
          } else {
            this.$message.error("获取通讯录失败");
          }
        });
    },
    saveNote(){
      this.$api.friend.changeNotes({
        user_id:this.$store.state.user.user_id,
        friend_id:this.selectedFriendInfo.friend_id,
        friend_notes:this.selectedFriendInfo.friend_note
      }).then(res=>{
        if(res.data.state=="0"){
          this.$message.success("备注修改成功");
        }
      })
      this.$emit("changeNote_",this.selectedFriendInfo);
      this.isEdit=false;
    },
    deleteFriend() {
      var This=this;
      This.$confirm('此操作将删除您该好友之间的好友关系与聊天记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        This.$api.friend.deleteUser({
          user_id:This.$store.state.user["user_id"],
          friend_id:This.selectedFriendInfo["friend_id"]
        }).then(res=>{
          if(res.data.state=="0"){
            This.$message({
              type: 'success',
              message: '删除成功!'
            });
            This.deleteFriendVisible = false;
            This.getContacts();
            This.pageType=0;
            This.$emit("pageType_",This.pageType);
          }
        }).catch(err=>{
          This.$message.warning("出现异常");
        })
      }).catch((e) => {
        This.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    toSession(id, Id_type){
        // console.log(id)
        // get sessionId by friendId(type==1) / groupId(type==2)
        const sessionList = this.$store.state.sessions.session_list;
        for(let i=0;i<sessionList.length;i++){
            if((sessionList[i].friend_id == id && Id_type==1)
            ||(sessionList[i].group_id == id && Id_type==2)){
                this.targetSessionId = sessionList[i].session_id;
                this.$store.state.cur_session = sessionList[i];
                break;
            }
        }
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
            this.applicantLen = res.data.unApplyLen;
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
            if(--this.applicantLen==0){
              this.$emit("redPointCancel");
            }
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
          if (res.data.state == 0) {
            this.$message.success("已拒绝对方的请求");
            this.toApply(); // 刷新被申请表
            if(--this.applicantLen==0){
              this.$emit("redPointCancel");
            }
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
/* 好友详情 */
.friendDetail {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
}
.info{
  font-size:3vh;
  border:none;
  background: #f4f4f4;
  position: absolute;
  right:0;
  top:0;
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
.friendNoteInput{
  font-size:1.8vh;
  height:auto;
  width:12vw;
}
.friendNoteInput >>> .el-input__inner{
  height:26px;
  font-weight: bold;
  text-align: left;
  padding-left:0;
  min-height:26px;
}
.editNote{
  padding-top: 6%;
  height:12%;
  display: flex;
  position: relative;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  width: 100%;
}
.editNote >>> .el-button--primary{
  margin:20px;
  height:4vh;
  font-size:1.6vh;
  line-height:1vh;
  min-height:30px;
  width: 21%;
  border-radius: 30px;
}
.toSessionRouter{
  width:100%;
  height:12%;
}
.toSessionRouter >>> .el-button--primary{
  background:#409EFF;
  color:#ffffff;
  margin:10px;
  height:4vh;
  font-size:1.6vh;
  line-height:1vh;
  min-height:30px;
  width: 21%;
  border-radius: 30px;
}
/* 聊天室详情 */
.groupDetail {
  width: 100%;
  height:100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
}
.groupHeader{
  width:100%;
  height:10vh;
  display: flex;
  align-items: center;
  justify-content: left;
  background:#ececec;
}
.groupAvatar{
  margin-left:1.5vw;
  height: 6vh;
  width: 6vh;
  border-radius: 100%;
}
.groupTitle{
  margin-left:1.5vw;
  font-size:2.4vh;
}
.memberList{
  height:auto;
  flex-wrap:wrap;
  max-height:50vh;
  width:100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: left;
  overflow-x:hidden;
  overflow-y:auto;
}
.memberIcon{
  height:auto;
  margin:3%;
  width:5.4vw;
  min-width:90px;
}
.memberAvatar{
  height: 7vh;
  width: 7vh;
  border-radius: 100%;
}
.memberName{
  margin-top:1vh;
  font-size:2vh;
}
.groupIntroduct{
  width:100%;
  height:7vh;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  background:#ececec;
}
.intro{
  width:92%;
  margin-top:2%;
  margin-bottom:4%;
  margin-left: 4%;
  margin-right: 4%;
  text-align: left;
  font-size:1.8vh;
}
.toSessionRouter2{
  width:100%;
  height:12%;
}
.toSessionRouter2 >>> .el-button--primary{
  background:#409EFF;
  color:#ffffff;
  margin:10px;
  height:4vh;
  font-size:1.6vh;
  line-height:1vh;
  min-height:30px;
  width: 21%;
  border-radius: 30px;
}
/* 邀请新成员 */
.inviteForm{
  width:auto;
  height:40vh;
}
.mytransfer{
  text-align: left;
  display: inline-block;
}
.mytransfer >>> .el-transfer-panel{
  width:13vw;
  height:40vh;
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
