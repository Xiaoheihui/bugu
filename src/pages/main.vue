<template>
  <div class="welcome">
    <div class="page">
      <el-row :gutter="1" class="container">
        <!-- 侧边栏菜单 -->
        <left-menu :menuList="menuList" :userInfo="userInfo"></left-menu>
        <!-- 中间的会话列表 -->
        <mid-session ref="choose" @changeSess="selectSH" @pageTpye_="changePageType"></mid-session>
        <!-- 右侧的会话窗口，显示聊天记录与发送窗口 -->
        <right-session
          :pageType="pageType"
          :debugMode="something"
          v-on:lastText="updateHistory"
        ></right-session>
      </el-row>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import menu from "../components/left-menu";
import midSession from "../components/mid-session";
import rightSession from "../components/right-session";
export default {
  computed: mapState({
    userInfo: state => state.user
  }),
  name: "welcome",
  created() {
    this.$api.main
      .getSessions({
        user_id: this.$store.state.user["user_id"]
      })
      .then(res => {
        if (res.data.state == "0") {
          this.$store.commit("getSessions", res.data);
          //   console.log(res.data);
        } else {
          this.$message.error("获取会话列表失败");
        }
      });
  },
  components: {
    "left-menu": menu,
    "mid-session": midSession,
    "right-session": rightSession
  },
  data() {
    return {
      currSessId:0,
        something: [],
      menuList: [
        {
          name: 0,
          selected: "el-icon-chat-dot-round",
          path: "/main",
          style: true
        },
        {
          name: 1,
          selected: "el-icon-notebook-2",
          path: "/contact",
          style: false
        },
        {
          name: 2,
          selected: "el-icon-guide",
          path: "/guide",
          style: false
        },
        {
          name: 3,
          selected: "el-icon-setting",
          path: "/setting",
          style: false
        }
      ],
      // 用于判断右边的页面类型（1：单聊，2：拉群）
      pageType: 0
    };
  },
  methods: {
    changePageType(res) {
      this.pageType = res;
    },
    selectSH(res) {
      this.something = res;
    },
    updateHistory(params) {
        this.$api.main
        .getSessionsContent({
          session_id: this.$store.state.cur_session.session_id
        })
        .then(res => {
          this.selectedSessionHistory = res.data.history_list;
        })
        .catch(e => {
          this.$message.error(e);
        });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/* 背景样式 */
.welcome {
  position: relative;
  height: 100%;
  width: 100%;
}
.welcome::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background: transparent url(../static/img/bg.jpg) center center no-repeat;
  filter: blur(25px);
  z-index: -1;
  background-size: cover;
}
/* 窗口样式 */
.page {
  position: absolute;
  margin: 0vh 18vw;
  height: 99vh;
  width: 64vw;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.34);
}
.container {
  height: 100%;
  width: 100%;
}
</style>
