<template>
  <div class="welcome">
	  <div class="page">
		  <el-row :gutter="1" class="container">
			<!-- 侧边栏菜单 -->
			<el-col :span="3" class="aside" :model="userInfo">
				<el-image :src="userInfo.avatarUrl" class="myAvatar" alt="用户头像"></el-image>
				<div class="menu">
					<el-row v-for="menu in menuList" :key="menu.name">
						<el-button :class="{menuOnClick:menu.style,menuUnClick:!menu.style}" :icon="menu.selected" 
						@click="changeMenu(menu.path)"></el-button>
					</el-row>
				</div>
			</el-col>
			<el-col :span="6" class="list">
				<!-- 搜索框 -->
				<div class="searchNav">
					<el-input class="searchInput" v-model="searchInput" clearable placeholder="搜索" prefix-icon="el-icon-search">
					</el-input>
					<el-button class="addfriend_button">
						<i class="iconfont icon-addFriend_B"></i>
					</el-button>
				</div>
				<!-- 聊天室列表 -->
				<div class="groupList">
					<div class="header" @click="toggleSheet1">
					  	<i class="el-icon-caret-right" ref="toggleicon1"></i>
						<span class="header-span">{{group_item.name}}</span>
					</div>
					<div v-if="showSheets1" style="width:100%;">
						<div class="sheetList" v-for="i in group_item.details" :key="i.details_id">
							<div class="access" @click="showInfo(i.details_id)">
								<div class="sheetImage">
									<img :src="i.details_image" width="50" height="50">
							  	</div>
							  	<span class="sheetContent">{{i.details_name}}</span>
							</div>
						</div>	 
					</div> 
				</div>
				<!-- 好友列表 -->
				<div class="groupList">
					<div class="header" @click="toggleSheet2">
					  	<i class="el-icon-caret-right" ref="toggleicon2"></i>
						<span class="header-span">{{friend_item.name}}</span>
					</div>
					<div v-if="showSheets2" style="width:100%;">
						<div class="sheetList" v-for="i in friend_item.details" :key="i.details_id">
							<div class="access" @click="showInfo(i.details_id)">
								<div class="sheetImage">
									<img :src="i.details_image" width="50" height="50">
							  	</div>
							  	<span class="sheetContent">{{i.details_name}}</span>
							</div>
						</div>
					</div>	  
				</div>
			</el-col>
			<!-- 好友申请主页/详情页面 -->
			<el-col :span="15" class="detailPage">
				<div v-if="!showDetail" class="emptyPage">
					暂无内容
				</div>
				<div v-if="showDetail" class="friendDetail">
					<div class="friendInfo">
						<el-image :src="friendHead" class="head" alt="好友头像"></el-image>
						<span  class="name">{{friendName}}</span>
					</div>
					<div class="diviveLine">
					</div>
				</div>
			</el-col>
		  </el-row>
	  </div>
  </div>
</template>

<script>
  export default {
    name: 'welcome',
    data () {
	  var getContact=(user_id)=>{

	  };
      return {
		// 用户信息
        userInfo:{
		  avatarUrl:require('../static/img/logo.png')
		},
		// 搜索框输入
		searchInput:'',
		// 菜单列表
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
		// 是否显示群聊和好友列表
		showSheets1:false,
		showSheets2:false,
		// 聊天室列表
		group_item:{
			name:"聊天室",
			details:[
				{
		          details_id:1,
		          details_name:'女装讨论群',
		          details_image:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1521191038714&di=117b8f1d83605767e8a7faf01cb9be9b&imgtype=0&src=http%3A%2F%2Fimgsrc.baidu.com%2Fimgad%2Fpic%2Fitem%2F8435e5dde71190efc4376916c41b9d16fcfa602f.jpg'
		        },{
		          details_id:2,
		          details_name:'课设交流群',
		          details_image:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1521190642670&di=67822ec270160c1fb21e67d49e95a97f&imgtype=0&src=http%3A%2F%2Fpic30.nipic.com%2F20130615%2F2861027_140302450156_2.jpg'
		        },
			]
		},
		// 好友列表
		friend_item:{
			name:"好友",
			details:[
				{
		          details_id:1,
		          details_name:'王总',
		          details_image:require('../static/img/logo.png')
		        },{
		          details_id:2,
		          details_name:'王总的小弟',
		          details_image:require('../static/img/bg.jpg')
		        },
			]
		},
		// 是否显示详情
		showDetail:false,
		// 好友详情
		friendHead:require('../static/img/logo.png'),
		friendName:"性感荷官"
		}
	},
    methods:{
	  changeMenu(path){
		  this.$router.replace(path);
	  },
	  toggleSheet1:function(index){
		this.$refs.toggleicon1.style.transform = !this.showSheets1 ? 'rotate(90deg)' : 'rotate(0)'
		this.showSheets1 = !this.showSheets1;
	  },
	  toggleSheet2:function(index){
		this.$refs.toggleicon2.style.transform = !this.showSheets2 ? 'rotate(90deg)' : 'rotate(0)'
		this.showSheets2 = !this.showSheets2;
	  },
	  showInfo(key){
		this.showDetail=true;
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
	box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .34);
  }
  .container{
	height:100%;
	width:100%;
  }
  /* 侧边栏菜单 */
  .aside{
	background: #505559;
	height: 100%;
	width:12.5%;
	display:flex;
	flex-direction:column;
	justify-content: center;
	align-items: center;
	z-index:3;
	border-top-left-radius:3px;
	border-bottom-left-radius:3px; 
  }
  .myAvatar{
	position:absolute;
	top:4%;
	height:6vw;
	width:6vw;
	border-radius:100%;
  }
  .menu{
	position: absolute;
	top:23vh;
	height:32vh;
	width:12.5%;
  }
  .menuOnClick{
	background:#FFFFFF;
	width:100%;
	height:100%;
	border-radius:0;
	border:0;
	font-size:30px;  
  }
  .menuUnClick{
	background:#c2ced6;
	width:100%;
	height:100%;
	border-radius:0;
	border:0;
	font-size:30px;
  }
  /* 主菜单 */
  .list{
	background: #FFFFFF;
	height: 100%;
	width:25%;
	display:flex;
	flex-direction:column;
	justify-content: flex-start;
	align-items: center;
	z-index:3;
  }
  .searchNav{
	width:100%;
  }
  .searchNav .searchInput{
	width:75%;
	height:auto;
  }
  .searchNav .addfriend_button{
	margin-left:2px;
	padding: 10px;
  }
  /* 聊天室收拉菜单 */
  .groupList{
	width:100%;
	height:auto;
	display:flex;
	flex-direction:column;
	align-items:center;
  }
  .groupList .header{
	background:#FFFFFF;
	width:100%;
	height:auto;
	font-size:2.5vh;
	display:flex;
	flex-direction:row;
	align-items:center;
  }
  .groupList .header i{
  	padding:10px;
  }
  .groupList .header .header-span{
	padding:10px;
  }
  .groupList .sheetList{
	height:auto;
	width:100%;
  }
  .groupList .sheetList .access{
	padding:10px 5px;
	display:flex;
	flex-direction:row;
	align-items:center; 
	justify-content:flex-start;
  }
  .groupList .sheetList .access .sheetImage{
  	height:auto;
	width:auto;
	margin-right:20px;
  }
  .groupList .sheetList .access .sheetImage img{
  	border-radius:100%;
  }
  .groupList .sheetList .access .sheetContent{
	width:auto;
	font-size:18px;
  }
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
