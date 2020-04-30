<template>
  <el-col :span="3" class="aside" :model="userInfo">
    <el-image :src="userInfo.avatar_url ? userInfo.avatar_url: require('../static/img/logo.png')" class="myAvatar" alt="用户头像"></el-image>
    <div class="menu">
      <el-row v-for="menu in menuList" :key="menu.name">
        <el-button
          :class="{menuOnClick:menu.style,menuUnClick:!menu.style}"
          :icon="menu.selected"
          @click="changeMenu(menu.path)"
        ></el-button>
      </el-row>
    </div>
  </el-col>
</template>
<script>
export default {
  name: "my-menu",
  props: ["menuList", "userInfo"], // 获取父组件的传值
  data() {
    return {};
  },
  methods: {
    changeMenu(path) {
      this.$router.replace(path);
      // console.log(this.userInfo);
    }
  }
};
</script>
<style scoped>
.aside {
  display: flex;
  background: #505559;
  height: 100%;
  width: 12.5%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 3;
  border-top-left-radius: 3px;
  border-bottom-left-radius: 3px;
}
.myAvatar {
  position: absolute;
  top: 4%;
  height: 6vw;
  width: 6vw;
  border-radius: 100%;
}
.menu {
  position: absolute;
  top: 23vh;
  height: 32vh;
  width: 12.5%;
}
.menuOnClick {
  background: #ffffff;
  width: 100%;
  height: 100%;
  border-radius: 0;
  border: 0;
  font-size: 30px;
}
.menuUnClick {
  background: #c2ced6;
  width: 100%;
  height: 100%;
  border-radius: 0;
  border: 0;
  font-size: 30px;
}
</style>