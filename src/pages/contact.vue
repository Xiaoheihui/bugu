<template>
  <div class="contact">
	  <div class="page">
		  <el-row :gutter="1" class="container">
			<!-- 侧边栏菜单 -->
			<left-menu :menuList="menuList" :userInfo="userInfo"></left-menu>
            <!-- 中间的通讯录 -->
            <mid-contact :contacts="contacts" ref="choose" @click.native="change"></mid-contact>
			<!-- 好友申请主页/详情页面 -->
			<right-detail :pageType="pageType"></right-detail>
		  </el-row>
	  </div>
  </div>
</template>

<script>
  import { mapState, mapMutations } from 'vuex';
  import menu from '../components/left-menu'
  import midContact from '../components/mid-contact'
  import rightDetail from '../components/right-detail'
  export default {
	computed: mapState({
		userInfo: state => state.user,
		contacts: state => state.contacts
	}),
    name: 'contact',
    components:{
        'left-menu':menu,
        'mid-contact':midContact,
        'right-detail':rightDetail
    },
    data () {
      return {
		menuList:[
			{
				name:0,
				selected:"el-icon-chat-dot-round",
				path:"/main",
				style:false
			},
			{
				name:1,
				selected:"el-icon-notebook-2",
				path:"/contact",
				style:true
			},
			{
				name:2,
				selected:"el-icon-guide",
				path:"/guide",
				style:false
			},
			{
				name:3,
				selected:"el-icon-setting",
				path:"/setting",
				style:false
			}
		],
		
		// 详情页的类型
		pageType:0,
		
		}
	},
    methods:{
        change(){
        return this.pageType = this.$refs.choose.detailType;
        //将组件mid-contact传来的detailType赋予this.pageType,从而改变right-detail的页面类型
        }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  /* 背景样式 */
  .contact{
    position: relative;
    height:100%;
    width:100%;
  }
  .contact::before{
    content:'';
    position: absolute;
    top:0;
    left:0;
    height:100%;
    width:100%;
    background:transparent url(../static/img/bg.jpg) center center no-repeat;
    filter: blur(25px);
    z-index: -1;
    background-size:cover;
  }
  /* 窗口样式 */
  .page{
	position: absolute;
	margin:0vh 18vw;
	height:99vh;
	width:64vw;
	box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .34);
  }
  .container{
	height:100%;
	width:100%;
  }

</style>