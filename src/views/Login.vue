<template>
  <div class="login-wrapper">
    <div class="modal">
      <div class="title">用户登录</div>
      <el-form :rules="rules" :model="login_info" ref="login_info">
        <el-form-item prop="phone">
          <el-input
              class="login-item"
              type="tel"
              v-model="login_info.phone"
              placeholder="电话号码">
            <template #prefix>
              <el-icon class="el-input__icon">
                <Phone/>
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
              class="login-item"
              type="password"
              show-password
              v-model="login_info.password"
              placeholder="密码">
            <template #prefix>
              <el-icon class="el-input__icon">
                <Lock/>
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
      </el-form>
      <el-button class="btn-login" type="primary" @click="handleLogin">登录</el-button>
      <div class="login-bottom">
        <span>还没有账号？<router-link to="/register">立即注册></router-link></span>
<!--        <router-link to="/forget">忘记密码</router-link>-->
      </div>
    </div>
  </div>
</template>

<script>
import {checkPassword, hashPassword} from "@/utils/util";
import {login} from "@/api/user";
import {ElMessage} from "element-plus";
import storage from '@/utils/storage'
import {setTokenTime} from "@/utils/auth";

export default {
  name: "Login",
  data() {
    return {
      login_info: {
        phone: "",
        password: ""
      },
      rules: {
        phone: [{required: true, message: "请输入电话号码", trigger: 'blur'}],
        password: [{required: true, message: "请输入密码", trigger: 'blur'}]
      }

    }
  },

  mounted() {
    window.addEventListener('keydown',this.keyDown);
  },
  methods: {
    keyDown(e){
      if(e.keyCode==13){
        this.handleLogin();
      }
    },
    handleLogin() {
      const hashedPassword = hashPassword(this.login_info.password);
      // console.log(checkPassword(this.login_info.password, hashedPassword));
      let payload = {
        phone: this.login_info.phone,
        password: hashedPassword
      }
      let login_form = this.$refs.login_info;
      login_form.validate((valid, object) => {
        if (valid) {
          login(payload).then(res => {
            // console.log(res);
            if (res.code === 1) {
              // console.log(res.data);
              ElMessage.success("登录成功！");
              storage.setItem("userInfo", res.data.role.userInfo);
              storage.setItem("token", res.data.token);
              setTokenTime();
              setTimeout(() => {
                this.$router.push('/index');
              }, 1000);
            } else {
              ElMessage.error("用户名或密码错误");
            }
          })
        }
      })

    }
  }

}
</script>

<style scoped>
.login-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #F2F6FC;
  width: 100vw;
  height: 100vh;
}

.modal {
  background-color: #FFFFFF;
  width: 400px;
  height: 300px;
  padding: 50px;
  border-radius: 10px;
  box-shadow: 0 0 57px 0 rgba(0, 0, 0, 0.2);
}

.modal::before {
  content: " ";
  background: url("../assets/logo.png") no-repeat;
  /*background-size: 100%;*/
  display: inline-block;
  width: 353px;
  height: 154px;
  position: absolute;
  left: 50%;
  top: calc((100vh - 300px) / 2 - 154px);
  margin-left: -176px;
}

.title {
  font-size: 20px;
  line-height: 1.5;
  text-align: center;
  margin-bottom: 30px;
  margin-top: 20px;
}

.btn-login {
  width: 100%;
  margin: 5px auto;
}

.login-item {
  margin: 5px auto;
}

.login-bottom {
  margin: 15px auto;
  display: flex;
  justify-content: space-between;
}
</style>