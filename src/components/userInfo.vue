<template>
  <div class="userInfo">

    <el-form ref="form" :model="form" :rules="rules" label-width="80px" class="form">

      <el-form-item label="头像">

        <el-upload
          class="avatar-uploader"
          action=""
          ref="uploadAvatar"
          :show-file-list="false"
          :auto-upload="false"
          :on-change="changeFile">
          <img v-if="form.avatar_url" :src="form.avatar_url" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>

      <el-form-item label="昵称" prop="nickname">
        <el-input v-model="form.nickname" autocomplete="off" :disabled="!judge"></el-input>
      </el-form-item>

      <el-form-item label="手机" prop="phone">
        <el-tag>{{form.phone}}</el-tag>
      </el-form-item>

      <el-form-item label="邮箱" prop="email">
        <el-input v-model="form.email" autocomplete="off" :disabled="!judge"></el-input>
      </el-form-item>

      <el-form-item label="所在地" prop="location">
        <el-input v-model="form.location" autocomplete="off" :disabled="!judge"></el-input>
      </el-form-item>

      <el-form-item label="性别" prop="gender">
        <el-switch v-model="form.gender" active-text="男" inactive-text="女" inactive-color="#f56c6c"
                   :disabled="!judge"></el-switch>
      </el-form-item>

      <el-form-item label="生日" prop="birthday">
        <el-date-picker type="date" placeholder="选择日期" :picker-options="pickerOptions" v-model="form.birthday"
                        style="width:100%;" :disabled="!judge"></el-date-picker>
      </el-form-item>

      <el-form-item label="签名" prop="signature">
        <el-input type="textarea" v-model="form.signature" placeholder="最长不能超过150个字符" autocomplete="off"
                  :disabled="!judge"></el-input>
      </el-form-item>


    </el-form>
    <div class="buttonGroup">
      <el-button type="primary" @click="judge=true" :disabled="judge">编辑</el-button>
      <el-button type="primary" @click="submitForm('form')" :disabled="!judge">保存</el-button>
    </div>

  </div>
</template>


<script>
    import {mapState, mapMutations} from 'vuex';
    import store from '@/store'

    export default {
        name: "userinfo",
        created() {
            this.form.user_id = this.$store.state.user["user_id"]
            this.form.birthday = this.$store.state.user["birthday"]
            this.form.gender = this.$store.state.user["gender"]
            this.form.nickname = this.$store.state.user["nickname"]
            this.form.phone = this.$store.state.user["phone"]
            this.form.signature = this.$store.state.user["signature"]  // 签名
            this.form.avatar_url = this.$store.state.user["avatar_url"]
            this.form.location = this.$store.state.user["location"]
            this.form.email = this.$store.state.user["email"]
        },
        data() {
            var checkNickName = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('用户昵称不能为空'));
                }
                setTimeout(() => {
                    callback();
                }, 500);
            };
            return {
                store,
                judge: false,
                form: {
                    phone: '',
                    userId: null,
                    nickname: '',
                    gender: true,
                    birthday: '',
                    signature: '',
                    location: '',
                    email: '',
                    avatar_url: '',
                },
                rules: {
                    nickname: [
                        {validator: checkNickName, trigger: 'blur'}
                    ],
                },
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() > Date.now();
                    },
                }
            }
        },
        methods: {
            changeFile(file, fileList) {
                const isJPGORPNG = (file.raw.type === 'image/jpeg' || file.raw.type === 'image/png');
                const isLt1M = file.size / 1024 / 1024 < 1;

                if (!isJPGORPNG) {
                    this.$message.info('上传头像图片只能是 JPG 或 PNG 格式!');
                    return;
                }
                if (!isLt1M) {
                    this.$message.info('上传头像图片大小不能超过 1MB!');
                    return;
                }

                var This = this;
                var reader = new FileReader();
                reader.readAsDataURL(file.raw);
                reader.onload = function(e){
                    this.result; //base64编码
                    This.form.avatar_url = this.result
                }

            },
            submitForm(formName) {
                let _this = this
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$api.user.editUser({
                            user_id: _this.form.user_id,
                            email: _this.form.email,
                            gender: _this.form.gender,
                            avatar_url: _this.form.avatar_url,
                            signature: _this.form.signature,
                            birthday: _this.form.birthday,
                            location: _this.form.location,
                            nickname: _this.form.nickname
                        }).then((res) => {
                                if (res.data.state == "0") {
                                    _this.$store.commit('editUser', _this.form)
                                    this.$message.success('用户信息修改成功！')
                                    this.judge = false
                                } else {
                                    this.$message.error(res.data.msg);
                                }
                            }
                        )
                    } else {
                        this.$message.error('请完善信息！');
                    }
                })
            },
        }
    }
</script>

<style lang="scss">
  .userInfo {
    .avatar-uploader .el-upload {
      border: 1.5px dashed #d9d9d9;
      border-radius: 50%;
      cursor: pointer;
      position: relative;
      height: 80px;
      width: 80px;
      overflow: hidden;
    }

    .avatar-uploader .el-upload:hover {
      border-color: #409EFF;
      border-right: 10px;
    }

    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 40px;
      height: 10px;
      line-height: 85px;
      text-align: center;
    }

    .avatar {
      width: 80px;
      height: 80px;
      display: block;
    }

    .form {
      background-color: #eaeaea;
      position: relative;
      top: 90px;
      left: 10px;
      height: 60%;
      width: 70%;
      padding:40px 40px 20px 0px;
      font-weight: bolder;
      border-radius:8px;
      font-size: 65px;
    }

    .buttonGroup {
      display: flex;
      position: relative;
      justify-content: center;
      align-items: center;
      flex-direction: row;
      top: 160px;
      width: 70%;

      .el-button {
        margin-left: 30px;
        width: 30%;
        border-radius: 30px;
      }
    }

    .el-tag {
      font-size: 15px;
    }

    background: #f4f4f4;
    height: 100%;
    width: 62.5%;
    display: flex;
    flex-direction: column;
    align-items: center;
    border-top-right-radius: 3px;
    border-bottom-right-radius: 3px;

  }
</style>
