<template>
  <el-col :span="6" class="list">
    <!-- 搜索框 -->
    <div class="searchNav">
      <el-select v-model="searchInput" filterable placeholder="请搜索" style="width:11.5vw;">
				<el-option-group
				v-for="group in options"
				:key="group.label"
				:label="group.label">
					<el-option
						v-for="item in group.options"
						:key="item.value"
						:label="item.label"
						:value="item.value"
						@click.native="chooseOptions(item)">
						<div style="display: flex;align-items: center;">
							<el-image style="min-height:20px;min-width: 20px;height: 20px;width: 20px;margin-right: 5px;border-radius: 100%;"
           :src="item.avatar"></el-image>
		   					<span style="float: right; color: #8492a6; font-size: 13px">{{ item.label }}</span>
						</div>
					</el-option>
				</el-option-group>
			</el-select>
      <el-button class="addfriend_button" title="添加好友" @click="friendApply">
        <el-badge :is-dot="hasNewApplication" class="item">
          <i class="iconfont icon-addFriend_B"></i>
        </el-badge>
      </el-button>
    </div>
    <div class="contactList">
    <!-- 聊天室列表 -->
    <div class="groupList">
      <div class="header" @click="toggleSheet1">
        <i class="el-icon-caret-right" ref="toggleicon1"></i>
        <span class="header-span">聊天室</span>
      </div>
      <div v-if="showSheets1" style="width:100%;">
        <div class="sheetList" v-for="i in contacts.group_list" :key="i.group_id"
        @click="groupDetail(i)">
           <div class="access" :style="{'background-color': i.group_id==currContactId&&currContactType==2?'#bdbdbd':''}">
            <div class="sheetImage">
              <el-image :src="i.group_avatar" class="myAvatar" alt="群头像"></el-image>
            </div>
            <span class="sheetContent">{{i.group_name}}</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 好友列表 -->
    <div class="groupList">
      <div class="header" @click="toggleSheet2">
        <i class="el-icon-caret-right" ref="toggleicon2"></i>
        <span class="header-span">好友</span>
      </div>
      <div v-if="showSheets2" style="width:100%;">
        <div class="sheetList" v-for="i in contacts.friend_list" :key="i.friend_id"
        @click="friendDetail(i)">
          <div class="access" :style="{'background-color': i.friend_id==currContactId&&currContactType==1?'#bdbdbd':''}">
            <div class="sheetImage">
              <el-image :src="$store.state.avatar_list[i.friend_id]" class="myAvatar" alt="好友头像"></el-image>
            </div>
            <span class="sheetContent">{{(i.friend_note==undefined||i.friend_note=='')?i.friend_name:i.friend_note}}</span>
          </div>
        </div>
      </div>
    </div>
    </div>
  </el-col>
</template>
<script>
export default {
  name: "mid-contact",
  props: ["contacts","hasNewApplication"], // 获取父组件的传值
  data() {
    return {
      //搜索项
      options:[],
      // 搜索框输入
      searchInput: "",
      // 是否显示群聊和好友列表
      showSheets1: false,
      showSheets2: false,
      // 页面类型
      detailType:0,
      selectedFriendInfo:{},
      selectedGroupInfo:{},
      currContactType: 1, // 1:friend | 2:group
      currContactId:-1
    };
  },
  mounted(){
    let group_arr=[];
    let friend_arr=[];
    let friend_source=JSON.parse(JSON.stringify(this.$store.state.contacts.friend_list));
    let group_source=JSON.parse(JSON.stringify(this.$store.state.contacts.group_list));
    for(let i=0;i<friend_source.length;i++){
      friend_arr.push({
        value:friend_source[i]["friend_id"],
        id:friend_source[i]["friend_id"],
        label:(friend_source[i].friend_note==""||friend_source[i].friend_note==undefined)?friend_source[i].friend_name:friend_source[i].friend_note,
        avatar:this.$store.state.avatar_list[friend_source[i]["friend_id"]]
      })
    }
    for(let j=0;j<group_source.length;j++){
      group_arr.push({
        value:"group"+group_source[j]["group_id"],
        id:group_source[j]["group_id"],
        label:group_source[j].group_name,
        avatar:group_source[j].group_avatar
      })
    }
    this.options=[{
      label:'聊天室',
      options:group_arr
      },{
        label:'好友',
        options:friend_arr
      }];
  },
  methods: {
    chooseOptions(info){
      let friend_source=JSON.parse(JSON.stringify(this.$store.state.contacts.friend_list));
      let group_source=JSON.parse(JSON.stringify(this.$store.state.contacts.group_list));
      for(let i=0;i<friend_source.length;i++){
        if(friend_source[i]["friend_id"]==info.id){
          this.friendDetail(friend_source[i]);
          break;
        }
      }
      for(let j=0;j<group_source.length;j++){
        if(group_source[j]["group_id"]==info.id){
          this.groupDetail(group_source[j]);
          break;
        }
      }
    },
    toggleSheet1(index) {
      this.$refs.toggleicon1.style.transform = !this.showSheets1
        ? "rotate(90deg)"
        : "rotate(0)";
      this.showSheets1 = !this.showSheets1;
    },
    toggleSheet2(index) {
      this.$refs.toggleicon2.style.transform = !this.showSheets2
        ? "rotate(90deg)"
        : "rotate(0)";
      this.showSheets2 = !this.showSheets2;
    },
    friendDetail(info){
      this.detailType=1;
      this.$emit("editRecover");
      this.$emit("pageType_",this.detailType);
      this.selectedFriendInfo=JSON.parse(JSON.stringify(info));
      this.$emit("selectedFriendInfo_",this.selectedFriendInfo);
      this.currContactType = 1;
      this.currContactId = info.friend_id;
    },
    groupDetail(info){
      this.detailType=2;
      this.$emit("editRecover");
      this.$emit("pageType_",this.detailType);
      this.selectedGroupInfo=JSON.parse(JSON.stringify(info));
      this.$emit("selectedGroupInfo_",this.selectedGroupInfo);
      this.currContactType = 2;
      this.currContactId = info.group_id;
    },
    friendApply(){
      this.detailType=3;
      this.$emit("editRecover");
      this.$emit("pageType_",this.detailType);
    }
  }
};
</script>
<style scoped>
/* 主菜单 */
.list {
  background: #ececec;
  height: 100%;
  width: 25%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  z-index: 3;
}
.searchNav {
  width: 100%;
}
.searchNav .searchInput {
  width: 75%;
  height: auto;
}
.searchNav .addfriend_button {
  width:3vw;
  min-width:40px;
  padding: 10px;
}
.contactList{
  height: 100%;
  width: 100%;
  overflow: scroll;
  overflow-x: auto;
  overflow-y: auto;
}
/* 聊天室收拉菜单 */
.groupList {
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.groupList .header {
  background: #e2e2e2;
  width: 100%;
  height: auto;
  font-size: 2.5vh;
  display: flex;
  flex-direction: row;
  align-items: center;
}
.groupList .header i {
  padding: 10px;
}
.groupList .header .header-span {
  padding: 10px;
}
.groupList .sheetList {
  height: auto;
  width: 100%;
}
.groupList .sheetList .access {
  padding: 10px 5px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
}
.groupList .sheetList .access .sheetImage {
  height: auto;
  width: auto;
  margin-right: 20px;
}
.access .sheetImage .myAvatar {
  height: 6.3vh;
  width: 6.3vh;
  min-height:54px;
  min-width:54px;
  border-radius: 100%;
}
.access .sheetContent {
  width: auto;
  font-size: 1.8vh;
  font-weight:bold;
}
</style>
