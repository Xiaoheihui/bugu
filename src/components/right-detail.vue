<template>
  <el-col :span="15" class="detailPage">
    <div v-if="pageType==0" class="emptyPage">
        暂无内容
    </div>
    <div v-if="pageType==1" class="friendDetail">
        <div class="friendInfo">
            <el-image :src="friendHead" class="head" alt="好友头像"></el-image>
            <span  class="name">{{friendName}}</span>
        </div>
        <div class="diviveLine">
        </div>
    </div>
</el-col>
</template>
<script>
export default {
  name: "right-detail",
  props: ["pageType"], // 获取父组件的传值
  data() {
    return {
      // 好友详情
		friendHead:require('../static/img/logo.png'),
		friendName:"性感荷官"
    };
  },
  methods: {
    
  }
};
</script>
<style scoped>
/* 详情页样式 */
  .detailPage {
    background: #f4f4f4;
	height:100%;
	width:62.5%;
	display:flex;
	flex-direction:column;
	justify-content: center;
	align-items: center;
	border-top-right-radius:3px;
	border-bottom-right-radius:3px; 
  }
  .friendDetail{
	width:100%;
	display:flex;
	flex-direction:column;
	justify-content: center;
	align-items: center;
  }
  .friendDetail .friendInfo{
	display:flex;
	align-items: center;
  }
  .friendDetail .friendInfo .head{
	height:7vh;
	width:7vh;
	border-radius:100%;
  }
  .friendDetail .friendInfo .name{
	margin-left:20px;
	font-size:2vh;
  }
  .friendDetail .diviveLine{
	width:70%;
	height:5px;
	background:#000000;
  }
</style>