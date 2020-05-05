<template>
	<el-col :span="6" class="list">
		<!-- 搜索框 -->
		<div class="searchNav">
			<el-input class="searchInput" v-model="searchInput" clearable placeholder="搜索" prefix-icon="el-icon-search"></el-input>
			<el-button class="addfriend_button" title="添加好友" @click="friendApply">
				<i class="iconfont icon-addFriend_B"></i>
			</el-button>
		</div>
		<!-- 会话列表 -->
		<div class="sessionList">
			<div class="sheetList" v-for="i in sessions.session_list" :key="i.last_time" @click="groupDetail(i)">
				<div class="access">
					<div class="sheetImage">
						<el-image :src="i.avatar_url" class="myAvatar" alt="用户头像或群头像"></el-image>
					</div>
					<span class="sheetContent">{{i.group_name==undefined?(i.friend_notes==""?i.friend_nickname:i.friend_notes):i.group_name}}</span>
				</div>
			</div>
		</div>

	</el-col>
</template>
<script>
	export default {
		name: "mid-contact",
		props: ["sessions"], // 获取父组件的传值
		data() {
			return {
				// 搜索框输入
				searchInput: "",
				// 是否显示群聊和好友列表
				showSheets1: false,
				showSheets2: false,
				detailType: 0,
				selectedFriendInfo: {},
				selectedGroupInfo: {}
			};
		},
		methods: {
			toggleSheet1: function(index) {
				this.$refs.toggleicon1.style.transform = !this.showSheets1 ?
					"rotate(90deg)" :
					"rotate(0)";
				this.showSheets1 = !this.showSheets1;
			},
			toggleSheet2: function(index) {
				this.$refs.toggleicon2.style.transform = !this.showSheets2 ?
					"rotate(90deg)" :
					"rotate(0)";
				this.showSheets2 = !this.showSheets2;
			},
			friendDetail: function(info) {
				this.detailType = 1;
				this.selectedFriendInfo = JSON.parse(JSON.stringify(info));
			},
			groupDetail: function(info) {
				this.detailType = 2;
				this.selectedGroupInfo = JSON.parse(JSON.stringify(info));
				// console.log(JSON.parse(JSON.stringify(info)));
				//更新当前会话
				console.log(info);
				this.$store.commit("getCurSession", info);
			},
			friendApply: function() {
				this.detailType = 3;
			}

		}
	};
</script>
<style scoped>
	/* 主菜单 */
	.list {
		background: #ececec;
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
	.sessionList {
		width: 100%;
		height: auto;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.sessionList .header {
		background: #e2e2e2;
		width: 100%;
		height: auto;
		font-size: 2.5vh;
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.sessionList .header i {
		padding: 10px;
	}

	.sessionList .header .header-span {
		padding: 10px;
	}

	.sessionList .sheetList {
		height: auto;
		width: 100%;
	}

	.sessionList .sheetList .access {
		padding: 10px 5px;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-start;
	}

	.sessionList .sheetList .access .sheetImage {
		height: auto;
		width: auto;
		margin-right: 20px;
	}

	.sessionList .sheetList .access .sheetImage .myAvatar {
		height: 4vw;
		width: 4vw;
		border-radius: 100%;
	}

	.sessionList .sheetList .access .sheetContent {
		width: auto;
		font-size: 1.8vh;
		font-weight: bold;
	}
</style>
