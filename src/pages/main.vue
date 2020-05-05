<template>
  <div class="welcome">
	  <div class="page">
		  <el-row :gutter="1" class="container">
			<!-- 侧边栏菜单 -->
			<left-menu :menuList="menuList" :userInfo="userInfo"></left-menu>
			<!-- 中间的通讯录 -->
            <mid-session :sessions="sessions" ref="choose" @click.native="change"></mid-session>
			<el-col :span="15" class="bg-purple">
				<div class="sessionHead">
					<div class="chatLeft">
						<el-image :src="friendInfo.avatarUrl ? friendInfo.avatar_url : require('../static/img/logo.png')" class="chatAvatar" alt="用户头像"></el-image>
						<span class="friendName">{{friendInfo.friendname}}</span>
					</div>
					<el-button class="info" icon="el-icon-more"></el-button>
				</div>
				<div class="sessionArea">

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
					<el-input class="chatText" resize="none" type="textarea" rows="5" v-model="textarea"> </el-input>
					
					<el-button class="sendButton" @click="sendInfo">发送(S)</el-button>
				</div>
			</el-col>
		  </el-row>
	  </div>
  </div>
</template>

<script>
  import { mapState, mapMutations } from 'vuex';
  import menu from '../components/left-menu'
  import midSession from '../components/mid-session'
  export default {
	computed: mapState({
		userInfo: state => state.user
	}),
	name: 'welcome',
	created(){
		this.$api.main.getSessions({
          user_id: this.$store.state.user["user_id"]
        })
        .then((res) => {
          if (res.data.state == "0") {
			this.$store.commit("getSessions", res.data);
			this.sessions=this.$store.state.sessions;
          } else {
            this.$message.error("获取会话列表失败");
          }
        });
	},
	components:{
		'left-menu':menu,
		'mid-session':midSession,
    },
    data () {
      return {
		textarea: '',
		friendInfo:{
		  avatarUrl:require('../static/img/logo.png'),
		  friendname:"log李"
		},
		sessions:{},
		menuList:[
			{
				name:0,
				selected:"el-icon-chat-dot-round",
				path:"/main",
				style:true
			},
			{
				name:1,
				selected:"el-icon-notebook-2",
				path:"/contact",
				style:false
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
		sendInfo(){
			store.state.socket_instance.send(JSON.stringify({
				user_id:store.state.user.user_id,
				content:this.textarea,
				session_id:"",
				sender_name:store.state.user.nickname,
				type:'contact'
			}))
			this.textarea = ''
			console.log('success')
		},
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
  .welcome{
    position: relative;
    height:100%;
    width:100%;
  }
  .welcome::before{
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
	box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .34)
  }
  .container{
	height:100%;
	width:100%;
  }
  /* 会话窗口样式 */
  .bg-purple {
    background: #e0e0e0;
	height:100%;
	width:62.5%;
	display:flex;
	flex-direction:column;
	z-index:3;
 	border-top-right-radius:3px;
	border-bottom-right-radius:3px; 
  }
  .sessionHead{
	height:10%;
	width:100%;
	display: flex;
	justify-content: space-between;
	align-items: center;
	border-bottom: 1px solid #a4a6a9;
  }
  .chatLeft{
	left:5%;
	position: relative;
	height: 100%;
  	display: flex;
	align-items: center;
  }
  .chatAvatar{
	width:4vw;
	border-radius:100%;
	margin-right: 30px;
  }
  .friendName{
	font-size:18px;
  }
  .info{
	background: none;
	border: none;
	font-size: 20px;
	position: relative;
    right: 5%;
  }
  .sessionArea{
	height:65%;
	width:100%;
	display: flex;
	justify-content: space-between;
	align-items: center;
	border-bottom: 1px solid #a4a6a9;
  }
  .chatOption{
	width:100%;
	display: flex;
	justify-content: space-between;
	align-items: center;
   }
  .chatIcon{
	padding: 0 10px;
    font-size: 25px;
  }
  .chatText >>> .el-textarea__inner{
	border: none;
  }
  .sessionBottom{
	background: #FFFFFF;
  }
  .sendButton{
	float: right;
  }
</style>
