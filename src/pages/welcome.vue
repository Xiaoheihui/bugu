<template>
  <div class="welcome">
	  <el-row :gutter="1" class="page">
		<el-col :span="3" class="aside" :model="userInfo">
			<img :src="userInfo.avatarUrl" class="myAvatar" alt="用户头像"/>
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
				<el-button class="addFriendAccess">
					<i class="addIcon iconfont icon-addFriend_B"></i>
					<span class="addText">添加好友</span>
					</el-button>
			</div>
		</el-col>
		<el-col :span="15"><div class="bg-purple">sss</div></el-col>
	  </el-row>
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
		]
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
  .page{
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
  }
  .myAvatar{
	position:absolute;
	top:4vh;
	height:15vh;
	width:15vh;
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
	justify-content: center;
	align-items: center;
	z-index:3;
  }
  .searchNav{
	position: absolute;
	top:0.5vh;
	left:12.5%;
	width:25%;
  }
  .searchNav .searchInput{
	width:100%;
	border:0;
  }
  .addFriend{
	position: absolute;
	top:6vh;
	left:12.5%;
	width:25%;
  }
  .addFriend .addFriendAccess{
	width:100%;
	height:100%;
	font-size:16px;
	display:flex;
	flex-direction:row;
	align-items:center;
  }
  .addIcon{
	font-size:40px;
	padding:5px;
  }
  .addText{
	font-size:24px;
  }
  .bg-purple {
    background: #d3dce6;
	height:100%;
  }

</style>
