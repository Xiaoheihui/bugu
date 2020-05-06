<template>
  <div class="hello">
    <div class="login-session">
      <img src="../static/img/logo.png" alt="布谷"/>
      <el-form :model="registerForm" status-icon :rules="rules" ref="registerForm"  class="loginForm">
        <el-form-item label="" prop="phone">
          <el-input class="input-item" v-model="registerForm.phone" clearable placeholder="手机号" prefix-icon="el-icon-user"></el-input>
        </el-form-item>
        <el-form-item label="" prop="password">
          <el-input class="input-item" type="password" v-model="registerForm.password" autocomplete="off" placeholder="密码" clearable prefix-icon="el-icon-lock"></el-input>
        </el-form-item>
        <el-form-item label="" prop="pass_confirm">
          <el-input class="input-item" type="password" v-model="registerForm.pass_confirm" autocomplete="off" placeholder="确认密码" clearable prefix-icon="el-icon-lock"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="register('registerForm')">
            注册
          </el-button>
        </el-form-item>
      </el-form>
      <div class='register'><router-link to='/login'>已有账号？去登录</router-link></div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'register',
    data () {
      var checkPhone = (rule, value, callback) => {
        let reg = new RegExp("^1(3|4|5|7|8)\\d{9}$");
        if (!value) {
          return callback(new Error('手机号不能为空'));
        }
        if (!reg.test(value)) {
          callback(new Error('请输入正确的手机号码'));
        } else {
          callback();
        }
      };
      var validatePass = (rule, value, callback) => {
        let reg = /(?!^[0-9]+$)(?!^[A-z]+$)(?!^[^A-z0-9]+$)^[^\s\u4e00-\u9fa5]{6,16}$/;
        if (value === '') {
          callback(new Error('请输入密码'));
        }else if(!reg.test(value)){
          callback(new Error('密码长度需6-16位，且包含字母和字符'))
        } else {
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.registerForm.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        input2:"",
        msg: 'Welcome to Your Vue.js App',
        registerForm:{
          phone:"",
          password:"",
          pass_confirm:""
        },
        rules:{
          password: [
            { validator: validatePass, trigger: 'blur' }
          ],
          pass_confirm: [
            { validator: validatePass2, trigger: 'blur' }
          ],
          phone: [
            { validator: checkPhone, trigger: 'blur'}
          ],
        }
      }
    },
    methods:{
      register(form){
        this.$refs[form].validate((valid) => {
          if (valid) {
            this.$api.user.register({
              phone:this.registerForm.phone,
              password:this.registerForm.password,
            }).then((res)=>{
                if(res.data.state=='0'){
                  this.$message.success("注册成功")
                  this.$router.push({path:'/login'});
                }else {
                  this.$message.error("手机号或密码错误，请重试！");
                }
              }
            )
          } else {
            this.$message.error('请完善注册信息');
          }
        })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  img{
    width:150px;
    height:150px;
    border-radius:50%;
    margin-bottom:30px;
  }
  .login-session{
    padding-top:100px;
    display:flex;
    flex-direction:column;
    justify-content: center;
    align-items: center;
    z-index:3;
  }
  .hello{
    position: relative;
    height:100%;
    width:100%;
  }
  .hello::before{
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
  .input-item >>> .el-input__inner{
    width:320px;
    opacity: 0.8;
    margin-top:6px;
    margin-bottom:6px;
    border-radius: 30px;
  }
  .el-button{
    width:320px;
    border-radius: 30px;
  }
  .register{
    width:320px;
    text-align:right;
    float:right;
  }
  a{
    margin-right:10px;
    color:black;
    text-decoration:none;
  }

</style>
