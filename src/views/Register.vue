<template>
  <div class="register-wrapper">
    <div v-if="!registered" class="modal">
      <div class="title">欢迎注册</div>
      <el-form :model="user_info" :rules="rules" ref="user_info">
        <el-form-item prop="username">
          <el-input
              class="register-item"
              type="text"
              maxlength="20"
              v-model="user_info.username"
              placeholder="用户名">
            <template #prefix>
              <el-icon class="el-input__icon">
                <User/>
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="phone">
          <el-input
              class="register-item"
              type="tel"
              maxlength="20"
              v-model="user_info.phone"
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
              class="register-item"
              type="password"
              maxlength="50"
              show-password
              v-model="user_info.password"
              placeholder="密码">
            <template #prefix>
              <el-icon class="el-input__icon">
                <Lock/>
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password_repeat">
          <el-input
              class="register-item"
              type="password"
              maxlength="50"
              show-password
              v-model="user_info.password_repeat"
              placeholder="重复密码">
            <template #prefix>
              <el-icon class="el-input__icon">
                <Lock/>
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="role">
          <el-select
              class="register-item"
              type="number"
              v-model="user_info.role"
              placeholder="角色">
            <template #prefix>
              <el-icon class="el-input__icon">
                <Paperclip/>
              </el-icon>
            </template>
            <el-option
                v-for="item in role"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-button class="btn-register" type="primary" @click="handleRegister()">注册</el-button>
      <div class="register-bottom">
        <span>已有账号？<router-link to="/login">去登录></router-link></span>
      </div>
    </div>
    <!--用户特征-众包工人-->
    <div v-else class="modal">
      <div class="title">让我们更好地了解您</div>
      <el-form :model="user_feature" :rules="rules" ref="user_feature">
        <el-form-item prop="ability">
          <el-select
              class="register-item"
              multiple
              v-model="user_feature.ability"
              placeholder="专业能力">
            <el-option
                v-for="item in features.ABILITY"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="preference">
          <el-select
              class="register-item"
              multiple
              v-model="user_feature.preference"
              placeholder="任务偏好">
            <el-option
                v-for="item in features.PREFERENCE"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="device">
          <el-select
              class="register-item"
              multiple
              v-model="user_feature.device"
              placeholder="测试设备">
            <el-option
                v-for="item in features.DEVICE"
                :key="item"
                :label="item"
                :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-button class="btn-register" type="primary" @click="handleCommitFeature()">确定</el-button>
      <div class="register-bottom">
        <span><router-link to="/">跳过></router-link></span>
      </div>
    </div>
  </div>
</template>

<script>
import {register} from "@/api/user";
import {checkPassword, hashPassword, letter_avatar} from "@/utils/util";
import {ElMessage} from "element-plus";
import storage from "@/utils/storage";
import {setTokenTime} from "@/utils/auth";
import {USERFEATURE, USERROLE} from "@/utils/constant";

console.log(USERFEATURE);

export default {
  name: "Register",
  data() {
    let validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (value.length < 6) {
          callback(new Error("密码至少为6位"))
        } else {
          this.$refs.user_info.validateField('password')
        }
        callback()
      }
    }
    let validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.user_info.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    let validatePhone = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入电话号码'))
      } else {
        let reg = /(^(\+86)?([ ]+)?1[3-578][0-9]{9}$)|(^(\+886)?([ ]+)?[0-9]{9}$)/;
        if (!reg.test(value)) {
          callback(new Error('请输入正确的电话号码'))
        } else {
          callback()
        }
      }
    }
    return {
      registered: false,
      user_info: {
        username: "",
        phone: "",
        password: "",
        password_repeat: "",
        role: "",
        picture: ""
      },
      user_feature: {
        ability: [],
        preference: [],
        device: []
      },
      props: {
        // props.
        multiple: true,
      },
      role: [
        {value: USERROLE.DISTRIBUTOR, label: "发包方"},
        {value: USERROLE.WORKER, label: "众包工人"}
      ],
      features: USERFEATURE,
      rules: {
        username: [
          {required: true, message: "用户名不能为空", trigger: 'blur',},
          {min: 3, max: 20, message: "用户名长度为3-20个字符", trigger: 'blur',}
        ],
        phone: [{validator: validatePhone, trigger: 'blur'}],
        password: [{validator: validatePass, trigger: 'blur'}],
        password_repeat: [{validator: validatePass2, trigger: 'blur'}],
        role: [{required: true, message: "请选择用户角色", trigger: 'blur'}]
      }
    }
  },
  methods: {
    handleRegister() {
      const hashedPassword = hashPassword(this.user_info.password);
      // checkPassword(this.user_info.password, hashedPassword);
      let payload = {
        uname: this.user_info.username,
        password: hashedPassword,
        phone: this.user_info.phone,
        picture: letter_avatar(this.user_info.username),
        userRole: this.user_info.role
      }
      let register_form = this.$refs.user_info;
      register_form.validate((valid, object) => {
        // console.log(payload);
        if (valid) {
          register(payload).then(res => {
            if (res.code === 1) {
              ElMessage.success("注册成功");
              storage.setItem("userInfo", res.data.role.userInfo);
              storage.setItem("token", res.data.token);
              setTokenTime();
              if (res.data.role.userInfo.userRole === USERROLE.WORKER) {
                this.registered = true
              } else {
                setTimeout(() => {
                  this.$router.push('/index');
                }, 1000);
              }
            } else {
              ElMessage.error(res.msg);
            }
          })
        }
      })
    },
    handleCommitFeature() {
      console.log(this.user_feature);
      ElMessage.success("感谢您的反馈！");
      this.$router.push('/index');
    }
  }
}
</script>

<style scoped>
.register-wrapper {
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
  height: 420px;
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
  top: calc((100vh - 420px) / 2 - 154px);
  margin-left: -176px;
}

.title {
  font-size: 20px;
  line-height: 1.5;
  text-align: center;
  margin-bottom: 30px;
  margin-top: 20px;
}

.btn-register {
  width: 100%;
  margin: 3px auto;
}

.register-item {
  width: 100%;
  margin: 3px auto;
}

.register-bottom {
  margin: 10px auto;
}

</style>