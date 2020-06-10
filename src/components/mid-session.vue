<template>
	<el-col :span="6" class="list">
		<!-- 搜索框 -->
		<div class="searchNav">
			<el-input class="searchInput" v-model="searchInput" clearable placeholder="搜索" prefix-icon="el-icon-search"
			 @keyup.enter.native="searchSession"></el-input>
			<el-button class="addfriend_button" title="新建群聊" @click="groupApply">
				<i class="iconfont icon-jiaoyou_B"></i>
			</el-button>
		</div>
		<!-- 会话列表 -->
		<div class="sessionList">
			<div class="sheetList" v-for="i in $store.state.sessions.session_list" :key="i.session_id" @click="sessionDetail(i)">
				<div class="access">
					<div class="sheetImage">
						<el-badge :is-dot="!i.if_read && currSessId != i.session_id" class="item">
							<el-image :src="i.avatar_url" class="myAvatar" alt="用户头像或群头像"></el-image>
						</el-badge>
					</div>
					<div class="sheetContent">
						<div class="sheetName">
							{{i.group_name==undefined?((i.friend_notes==""||i.friend_notes==undefined)?i.friend_nickname:i.friend_notes):i.group_name}}
						</div>

						<div class="sheetRecord">
							<span>{{i.last_record?
								(!i.last_record.indexOf('data:image')?"[图片]":(i.last_record.length>20?i.last_record.slice(0,20)+"......":i.last_record))
								:""}}</span>
						</div>
					</div>

				</div>
			</div>
		</div>
	</el-col>
</template>
<script>
	var moment = require("moment");
	export default {
		name: "mid-session",
		data() {
			return {
				// 搜索框输入
				searchInput: "",
				// 判断右边的页面类型（1：单聊，2：拉群）
				detailType: 0,
				selectedSessionHistory: [],
				currSessId: 0,
			};
		},
		methods: {
			getSessionsContent(s_id) {
				this.$api.main
					.getSessionsContent({
						session_id: s_id,
                        start: 0,
                        end: 20
					})
					.then(res => {
						let historyAndSid = [res.data.history_list, s_id];
                        this.$store.commit("setTempHistory", historyAndSid)
					})
					.catch(e => {
						this.$message.error(e);
					});
			},
			sessionDetail: function(info) {
				this.detailType = 1;
				let lastSessId = this.currSessId;
				this.$emit("transfer",this.detailType);
				this.$emit("changeSess", true);
				this.$store.commit("getCurSession", info);
				this.currSessId = info.session_id;
				this.$store.commit("readCurSessionMessage", this.currSessId);
				let time_1 = moment().add(1, 's').utcOffset(+8).format('YYYY-MM-DD HH:mm:ss');
				this.$api.user.updateLastTime({
					session_id:info.session_id,
					updatetime:time_1
				}).then(res=>{
					console.log(res.data);
				}).catch(e => {
					this.$message.error(e);
				});
				this.$emit("pageTpye_", this.detailType);
				if(!this.$store.state.temp_history[info.session_id]){
                    this.getSessionsContent(this.currSessId);
                }
                if(this.$store.state.temp_history[lastSessId]){
                    this.$store.commit("cleanTempHistory", lastSessId);
                }
			},
			groupApply: function(info) {
				this.detailType = 2;
				this.$emit("pageTpye_",this.detailType);
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
		overflow: scroll;
		overflow-x: auto;
		overflow-y: auto;
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
