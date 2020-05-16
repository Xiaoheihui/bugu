<template>
	<el-col :span="6" class="list">
		<!-- 搜索框 -->
		<div class="searchNav">
			<el-input class="searchInput" v-model="searchInput" clearable placeholder="搜索" prefix-icon="el-icon-search"
			 @keyup.enter.native="searchSession"></el-input>
			<el-button class="addfriend_button" title="添加好友" @click="groupApply">
				<i class="iconfont icon-addFriend_B"></i>
			</el-button>
		</div>
		<!-- 会话列表 -->
		<div class="sessionList">
			<div class="sheetList" v-for="i in $store.state.sessions.session_list" :key="i.last_time" @click="sessionDetail(i)">
				<div class="access">
					<div class="sheetImage">
						<el-image :src="i.avatar_url" class="myAvatar" alt="用户头像或群头像"></el-image>
					</div>
					<div class="sheetContent">
						<div class="sheetName">
							{{i.group_name==undefined?((i.friend_notes==""||i.friend_notes==undefined)?i.friend_nickname:i.friend_notes):i.group_name}}
						</div>

						<div class="sheetRecord">
							<span>{{i.last_record?(i.last_record.length>20?i.last_record.slice(0,20)+"......":i.last_record):""}}</span>
						</div>
					</div>

					<button v-if="!i.if_read && currSessId != i.session_id" class="redPoint" disabled></button>

				</div>
			</div>
		</div>
	</el-col>
</template>
<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'
	export default {
		name: "mid-session",
		watch: {
			'$store.state.messgaeReceive'() {
				if (this.$store.state.temp_history.length >= 8) {
					this.sessionDetail(this.$store.state.cur_session)
				}
			}
		},
		// mounted() {
		// 	this.sessionList = this.$store.state.sessions.session_list;
		// },
		data() {
			return {
				// 搜索框输入
				searchInput: "",
				// sessionList: [],
				// 判断右边的页面类型（1：单聊，2：拉群）
				detailType: 0,
				selectedSessionHistory: [],
				currSessId: 0,
			};
		},
		methods: {
			/* 列表搜索功能，与即时渲染冲突，待修改 */
			// searchSession() {
			// 	if (this.searchInput != "") {
			// 		let newArr = this.$store.state.sessions.session_list.filter(
			// 			item => {
			// 				console.log(item["group_name"])
			// 				if (item["group_name"] !== undefined)
			// 					return item["group_name"].search(this.searchInput) != -1;
			// 				else if (item["friend_nickname"] !== undefined) {
			// 					return (item["friend_nickname"].search(this.searchInput) != -1) ? true :
			// 						(item["friend_notes"] !== undefined ? ((item["friend_notes"].search(this.searchInput) != -1) ? true : false) :
			// 							false);
			// 				}
			// 			})
			// 		this.sessionList = newArr;
			// 	} else {
			// 		this.sessionList = this.$store.state.sessions.session_list;
			// 	}
			// },
			getSessionsContent(s_id) {
				this.$api.main
					.getSessionsContent({
						session_id: s_id
					})
					.then(res => {
						this.$emit("pageTpye_", this.detailType)
						this.$emit("selectSessionHis", res.data.history_list)
						this.$store.commit("clearTempHis", ''); // 发消息发得太快会有吞消息的现象出现
					})
					.catch(e => {
						this.$message.error(e);
					});
			},
			sessionDetail: function(info) {
				this.detailType = 1;
				this.$store.commit("getCurSession", info);
				this.currSessId = info.session_id;
				this.$store.commit("readCurSessionMessage", this.currSessId);
				this.getSessionsContent(this.currSessId);
			},
			groupApply: function() {
				this.detailType = 2;
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

	.sheetContent {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
	}

	.sheetName {
		width: auto;
		font-size: 1.8vh;
		font-weight: bold;
		margin-bottom: 0.6vh;
	}

	.sheetRecord {
		width: auto;
		font-size: 1.5vh;
		text-align: left;
	}

	.redPoint {
		margin-left: auto;
		margin-right: 0.5vw;
		border-radius: 100%;
		border: none;
		background: indianred;
		width: 1.5vh;
		height: 1.5vh;
		min-width: 1.5vh;
		min-height: 1.5vh;
	}
</style>
