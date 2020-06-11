<template>
  <div class="contact">
	  <div class="page">
		  <el-row :gutter="1" class="container">
			<!-- 侧边栏菜单 -->
			<left-menu :menuList="menuList" :userInfo="userInfo"></left-menu>
            <!-- 中间的通讯录 -->
            <mid-contact :hasNewApplication="hasNewApplication_" :contacts="contacts" @pageType_="changePageType" 
			@selectedFriendInfo_="changeSelectedFriendInfo" @selectedGroupInfo_="changeSelectedGroupInfo"
			@editRecover="changeEdit"></mid-contact>
			<!-- 好友申请主页/详情页面 -->
			<right-detail ref="edit" @pageType_="changePageType" @updateContact="updateContacts" @redPointCancel="changeRedPoint" :pageType="pageType_" :selectedFriendInfo="selectedFriendInfo_" 
			:selectedGroupInfo="selectedGroupInfo_" @changeNote_="changeNote"></right-detail>
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
		userInfo: state => state.user
	}),
	name: 'contact',
	mounted(){
      this.$api.main.getContacts({
          user_id: this.$store.state.user["user_id"]
        })
        .then(res => {
          if (res.data.state == "0") {
			this.contacts = res.data
            this.$store.commit("getContacts", res.data);
          } else {
            this.$message.error("获取通讯录失败");
          }
		});
	  	let result=false;
		this.$api.user
		.getFriendApplication({
			user_id: this.$store.state.user["user_id"]
		})
		.then(res => {
			if (res.data.state == "0") {
			for(let i=0;i<res.data.applicant_list.length;i++){
				if(res.data.applicant_list[i].flag==1){
					result=true;
					break;
				}
			}
			this.hasNewApplication_=result;
			} else {
			result=false;
			this.hasNewApplication_=result;
			}
		});
	},
    components:{
        'left-menu':menu,
        'mid-contact':midContact,
        'right-detail':rightDetail
    },
    data () {
      return {
		contacts:{},
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
		pageType_:0,
		// 展示好友信息
		selectedFriendInfo_:{},
		// 展示聊天室信息
		selectedGroupInfo_:{},
		// 是否有新好友申请
		hasNewApplication_: false
		}
	},
    methods:{
		changeEdit(){
			this.$refs.edit.isEdit=false;
		},
		changeNote(res){
			var tempData=JSON.parse(JSON.stringify(this.contacts));
			for(let i=0;i<tempData.friend_list.length;i++){
				if(tempData.friend_list[i].friend_id==res.friend_id){
					this.contacts.friend_list[i].friend_note=res.friend_note;
					break;
				}
			}
		},
		updateContacts(res){
			this.contacts=res;
		},
		changeRedPoint(){
			this.hasNewApplication_=false;
		},
		changePageType(res){
			this.pageType_ = res;
		},
		changeSelectedFriendInfo(res){
        	this.selectedFriendInfo_ = res;
		},
		changeSelectedGroupInfo(res){
        	this.selectedGroupInfo_ = res;
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