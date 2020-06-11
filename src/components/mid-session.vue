<template>
	<el-col :span="6" class="list">
		<!-- 搜索框 -->
		<div class="searchNav">
			<el-select v-model="searchInput" filterable placeholder="请搜索" style="width:11.5vw;">
				<el-option-group
				v-for="group in options"
				:key="group.label"
				:label="group.label">
					<el-option
						v-for="item in group.options"
						:key="item.value"
						:label="item.label"
						:value="item.value"
						@click.native="chooseOptions(item)">
						<div style="display: flex;align-items: center;">
							<el-image style="min-height:20px;min-width: 20px;height: 20px;width: 20px;margin-right: 5px;border-radius: 100%;"
           :src="item.avatar"></el-image>
		   					<span style="float: right; color: #8492a6; font-size: 13px">{{ item.label }}</span>
						</div>
					</el-option>
				</el-option-group>
			</el-select>
			<el-button class="addfriend_button" title="新建群聊" @click="groupApply">
				<i class="iconfont icon-jiaoyou_B"></i>
			</el-button>
		</div>
		<!-- 会话列表 -->
		<div class="sessionList">
			<div class="sheetList" v-for="i in $store.state.sessions.session_list" :key="i.session_id" @click="sessionDetail(i)">
				<div class='access' :style="{'background-color': i.session_id==currSessId?'#bdbdbd':''}">
					<div class="sheetLeft">
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
									(!i.last_record.indexOf('http')&&
					((i.last_record.length-i.last_record.lastIndexOf('.gif')==4)||
					(i.last_record.length-i.last_record.lastIndexOf('.jpeg')==5)||
					(i.last_record.length-i.last_record.lastIndexOf('.png')==4))?"[图片]":(i.last_record.length>9?i.last_record.slice(0,6)+"...":i.last_record))
									:""}}</span>
							</div>
						</div>
					</div>
					<div class="sheetTime">
						{{new Date().toLocaleDateString()==new Date(i.last_time).toLocaleDateString()?
						'今天 '+new Date(i.last_time).getHours()+':'+new Date(i.last_time).getMinutes():
						new Date().toLocaleDateString()==new Date(new Date(i.last_time).getTime()+24*60*60*1000).toLocaleDateString()?
						'昨天 '+new Date(i.last_time).getHours()+':'+(!new Date(i.last_time).getMinutes()?'00':new Date(i.last_time).getMinutes()):(new Date(i.last_time).getMonth()+1)+'月'+(new Date(i.last_time).getDate()+'日')}}
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
				options:[],
				// 搜索框输入
				searchInput: "",
				// 判断右边的页面类型（1：单聊，2：拉群）
				detailType: 0,
				selectedSessionHistory: [],
				currSessId: 0,
			};
		},
		mounted(){
			let group_arr=[];
			let friend_arr=[];
			let source=JSON.parse(JSON.stringify(this.$store.state.sessions.session_list));
			for(let i=0;i<source.length;i++){
				if(source[i]["is_group"]){
					group_arr.push({
						value:source[i]["session_id"],
						label:source[i].group_name,
						avatar:source[i].avatar_url
					})
				}else{
					friend_arr.push({
						value:source[i]["session_id"],
						label:(source[i].friend_notes==""||source[i].friend_notes==undefined)?source[i].friend_nickname:source[i].friend_notes,
						avatar:source[i].avatar_url
					})
				}
			}
			this.options=[{
				label:'聊天室',
				options:group_arr
				},{
					label:'好友',
					options:friend_arr
				}];
		},
		methods: {
			chooseOptions(info){
				let source=JSON.parse(JSON.stringify(this.$store.state.sessions.session_list));
				for(let i=0;i<source.length;i++){
					if(source[i]["session_id"]==info.value){
						this.sessionDetail(source[i]);

						break;
					}
				}
			},
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
				this.$emit("pageTpye_", this.detailType);
				if(lastSessId != this.currSessId){
            this.getSessionsContent(this.currSessId);
            this.$api.user.updateLeaveTime({
                user_id:this.$store.state.user.user_id,
                session_id:info.session_id,
                updatetime:time_1
            }).then(res=>{
                console.log(res.data);
            }).catch(e => {
                this.$message.error(e);
            });
        }
				if(this.$store.state.temp_history[lastSessId]){
				    this.$store.commit("cleanTempHistory", lastSessId);
				}
			},
			groupApply: function(info) {
				this.detailType = 2;
				this.$emit("pageTpye_",this.detailType);
			},
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
		width:3vw;
		min-width:40px;
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
		justify-content: space-between;
	}

	.sheetLeft{
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-start;
	}

	.sheetImage {
		height: auto;
		width: auto;
		margin-right:10px;
	}

	.sheetImage .myAvatar {
		height: 6.3vh;
		width: 6.3vh;
		min-height:54px;
		min-width:54px;
		border-radius: 100%;
	}

	.sheetContent {
		width:auto;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
	}

	.sheetName {
		width: auto;
		font-size: 1.8vh;
		font-weight: bolder;
		margin-bottom: 0.6vh;
	}

	.sheetRecord {
		height: auto;
		width: auto;
		font-size: 1.4vh;
		text-align: left;
	}

	.sheetTime{
		width:4.8vw;
		text-align: right;
		font-size:11px;
		font-weight: normal;
    align-self:center;
    margin-right: 6px;
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
