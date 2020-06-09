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
        <el-input class="editInput" v-model="form.nickname" autocomplete="off" :disabled="!judge"></el-input>
      </el-form-item>

      <el-form-item label="手机" prop="phone">
        <el-tag>{{form.phone}}</el-tag>
      </el-form-item>

      <el-form-item label="邮箱" prop="email">
        <el-input class="editInput" v-model="form.email" autocomplete="off" :disabled="!judge"></el-input>
      </el-form-item>

      <el-form-item label="所在地" prop="location">
        <el-input class="editInput" v-model="form.location" autocomplete="off" :disabled="!judge"></el-input>
      </el-form-item>

      <el-form-item label="性别" prop="gender">
        <el-switch v-model="form.gender" active-text="男" inactive-text="女" inactive-color="#f56c6c"
                   :disabled="!judge"></el-switch>
      </el-form-item>

      <el-form-item label="生日" prop="birthday">
        <el-date-picker class="editInput" type="date" placeholder="选择日期" :picker-options="pickerOptions" v-model="form.birthday"
                        style="width:100%;" :disabled="!judge"></el-date-picker>
      </el-form-item>

      <el-form-item label="签名" prop="signature">
        <el-input class="editInput" type="textarea" v-model="form.signature" placeholder="最长不能超过150个字符" autocomplete="off"
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
    import * as imageConversion from 'image-conversion'

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
                if (!isJPGORPNG) {
                    this.$message.info('上传头像图片只能是 JPG 或 PNG 格式!');
                    return;
                }
                console.log(typeof (file))

                var This = this;
                var reader = new FileReader();
                reader.readAsDataURL(file.raw);
                reader.onload = function (e) {
                    let result = e.target.result
                    let img = new Image()
                    img.src = result
                    // 大小检测，过大则并压缩
                    img.onload = function () {
                        This.form.avatar_url = This.compress(img, 600)
                    }
                }
            },
            // 压缩图片
            compress(img, maxWidth) {
                // 缩放图片需要的canvas
                var canvas = document.createElement('canvas');
                var context = canvas.getContext('2d');
                // 图片原始尺寸
                var originWidth = img.width;
                var originHeight = img.height;
                // 最大高由最大宽求得
                let maxHeight = maxWidth * originHeight / originWidth;
                // 目标尺寸
                var targetWidth = originWidth,
                    targetHeight = originHeight;
                // 图片尺寸超过400x400的限制
                if (originWidth > maxWidth || originHeight > maxHeight) {
                    if (originWidth / originHeight > maxWidth / maxHeight) {
                        // 更宽，按照宽度限定尺寸
                        targetWidth = maxWidth;
                        targetHeight = Math.round(maxWidth * (originHeight / originWidth));
                    } else {
                        targetHeight = maxHeight;
                        targetWidth = Math.round(maxHeight * (originWidth / originHeight));
                    }
                }
                // canvas对图片进行缩放
                canvas.width = targetWidth;
                canvas.height = targetHeight;
                // 清除画布
                context.clearRect(0, 0, targetWidth, targetHeight);
                // 图片压缩
                context.drawImage(img, 0, 0, targetWidth, targetHeight);
                var newUrl = canvas.toDataURL('image/jpeg', 0.92);//base64 格式
                return newUrl;
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
      height: 9vh;
      width: 9vh;
      min-height: 60px;
      min-width: 60px;
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
      width: 9vh;
      height: 9vh;
      min-height: 60px;
      min-width: 60px;
      display: block;
    }

    .form {
      background-color: #eaeaea;
      position: relative;
      top: 12vh;
      left: 0.8vw;
      height: 60%;
      width: 70%;
      padding: 40px 40px 20px 0px;
      font-weight: bolder;
      border-radius: 8px;
      font-size: 65px;
      min-height:60%;
      overflow:scroll;
      overflow-x: auto;
      overflow-y: auto;

      .el-form-item{
        margin:1.7vh auto;
      }

      .editInput{
        height: auto;
        .el-input__inner{
          height:4vh;
          min-height:30px;
        }
      }

    }

    .buttonGroup {
      display: flex;
      position: relative;
      justify-content: center;
      align-items: center;
      flex-direction: row;
      top:16vh;
      width: 70%;

      .el-button {
        margin-left: 30px;
        height:4vh;
        // 行高小于高，文字居中
        font-size:1.6vh;
        line-height:1vh;
        min-height:30px;
        width: 30%;
        border-radius: 30px;
      }
    }

    .el-tag {
      font-size: 15px;
    }

    background: #f4f4f4;
    height: 100%;
    width: 87.5%;
    display: flex;
    flex-direction: column;
    align-items: center;
    border-top-right-radius: 3px;
    border-bottom-right-radius: 3px;
    overflow-y: auto;
  }
</style>
