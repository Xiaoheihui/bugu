<template>
  <el-col :span="6" class="list">
    <!-- 搜索框 -->
    <div class="searchNav">
      <el-input
        class="searchInput"
        v-model="searchInput"
        clearable
        placeholder="搜索"
        prefix-icon="el-icon-search"
      ></el-input>
      <el-button class="addfriend_button">
        <i class="iconfont icon-addFriend_B"></i>
      </el-button>
    </div>
    <!-- 聊天室列表 -->
    <div class="groupList">
      <div class="header" @click="toggleSheet1">
        <i class="el-icon-caret-right" ref="toggleicon1"></i>
        <span class="header-span">聊天室</span>
      </div>
      <div v-if="showSheets1" style="width:100%;">
        <div class="sheetList" v-for="i in contacts.group_list" :key="i.group_id" 
        @click="groupDetail">
          <div class="access" @click="showInfo(i.group_id)">
            <div class="sheetImage">
              <el-image :src="i.avatar_url" class="myAvatar" alt="群头像"></el-image>
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
        @click="friendDetail">
          <div class="access">
            <div class="sheetImage">
              <el-image :src="i.avatar_url" class="myAvatar" alt="好友头像"></el-image>
            </div>
            <span class="sheetContent">{{i.friend_note==""?i.friend_name:i.friend_note}}</span>
          </div>
        </div>
      </div>
    </div>
  </el-col>
</template>
<script>
export default {
  name: "mid-contact",
  props: ["contacts"], // 获取父组件的传值
  data() {
    return {
      // 搜索框输入
      searchInput: "",
      // 是否显示群聊和好友列表
      showSheets1: false,
      showSheets2: false,
      detailType:0
    };
  },
  methods: {
    toggleSheet1: function(index) {
      this.$refs.toggleicon1.style.transform = !this.showSheets1
        ? "rotate(90deg)"
        : "rotate(0)";
      this.showSheets1 = !this.showSheets1;
    },
    toggleSheet2: function(index) {
      this.$refs.toggleicon2.style.transform = !this.showSheets2
        ? "rotate(90deg)"
        : "rotate(0)";
      this.showSheets2 = !this.showSheets2;
    },
    groupDetail:function(){
      this.detailType=2;
    },
    friendDetail:function(){
      this.detailType=1;
    }
}
};
</script>
<style scoped>
/* 主菜单 */
.list {
  background: #f1f1f1;
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
  margin-left: 2px;
  padding: 10px;
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
  background: #f1f1f1;
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
.groupList .sheetList .access .sheetImage .myAvatar {
  height:72px;
  width:72px;
  border-radius: 100%;
}
.groupList .sheetList .access .sheetContent {
  width: auto;
  font-size: 18px;
}
</style>