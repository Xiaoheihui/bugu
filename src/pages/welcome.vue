<template>
  <div class="welcome">
	  <div class="page">
		  <el-row :gutter="1" class="container">
			<el-col :span="3" class="aside" :model="userInfo">
				<el-image :src="userInfo.avatarUrl" class="myAvatar" :fit="fit" alt="用户头像"></el-image>
				<div class="menu">
					<el-row v-for="menu in menuList" :key="menu.name" class="menuSub">
						<el-button :class="{menuOnClick:menu.style,menuUnClick:!menu.style}" :icon="menu.selected" 
						@click="changeMenu(menu.name)"></el-button>
					</el-row>
				</div>
			</el-col>
			<el-col :span="6" class="list">
				<div class="searchNav">
					<el-input class="searchInput" v-model="searchInput" clearable placeholder="搜索" prefix-icon="el-icon-search">
						<el-button slot="append" icon="el-icon-search"></el-button>
					</el-input>
				</div>
				<div class="addFriend">
					<el-button class="addFriend">
					<div class="addFriendAccess">
						<i class="addIcon iconfont icon-addFriend_B"></i>
						<span class="addText">新的好友</span>
					</div>
					</el-button>
				</div>
			</el-col>
			<el-col :span="15" class="bg-purple"><div>sss</div></el-col>
		  </el-row>
	  </div>
  </div>
</template>

<script>
  export default {
    name: 'welcome',
    data () {
      return {
        userInfo:{
		  avatarUrl:require('../static/img/logo.png')
		},
		searchInput:'',
		menuList:[
			{
				name:0,
				selected:"el-icon-chat-dot-round",
				style:false
			},
			{
				name:1,
				selected:"el-icon-notebook-2",
				style:true
			},
			{
				name:2,
				selected:"el-icon-guide",
				style:false
			},
			{
				name:3,
				selected:"el-icon-setting",
				style:false
			}
		],
		activeNames: ['1']
      }
    },
    methods:{
	  changeMenu(key){
		  var that=JSON.parse(JSON.stringify(this.menuList));		  
		  let l=that.length;
		  for(let i=0;i<l;i++){
			  if(that[i].name===key){
				  that[i].style=true;
			  }else{
				  that[i].style=false;
			  }
		  }
		  this.menuList=that;
	  },
	  errorHandler() {
	      return true;
	  }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
  .page{
	position: absolute;
	margin:0vh 18vw;
	height:99vh;
	width:64vw;
	border:2px solid;
  }
  .container{
	height:100%;
	width:100%;
  }
  .aside{
	background: #505559;
	height: 100%;
	width:12.5%;
	display:flex;
	flex-direction:column;
	justify-content: center;
	align-items: center;
	z-index:3;
/* 	border-top-left-radius:20px;
	border-bottom-left-radius:20px; */
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
  .menuSub{
	width:100%;
	height:25%;
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
	width:100%;
	border:0;
  }
  .addFriend{
	width:100%;
  }
  .addFriend .addFriendAccess{
	width:100%;
	height:6vh;
	font-size:16px;
	display:flex;
	flex-direction:row;
	align-items:center;
  }
  .addIcon{
	font-size:40px;
	padding:5px;
	margin-right:20px;
  }
  .addText{
	font-size:18px;
  }
  .groupList{
	width:25%;
  }
  .bg-purple {
    background: #d3dce6;
	height:100%;
	width:62.5%;
	display:flex;
	flex-direction:column;
	justify-content: center;
	align-items: center;
	z-index:3;
/* 	border-top-right-radius:20px;
	border-bottom-right-radius:20px; */
  }

</style>
