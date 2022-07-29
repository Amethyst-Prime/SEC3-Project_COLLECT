<template>
  <div>

    <div v-if="!this.$storage.getItem('userInfo')">
      <el-button type="text" @click="this.$router.push('/login')">登录</el-button>
      <el-button type="text" @click="this.$router.push('/register')">注册</el-button>
    </div>
    <el-dropdown v-else>
    <span class="el-dropdown-link">
      <el-avatar shape="square" :size="30" :src="avatarImg"></el-avatar>
    </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="handleLogout()">退出登录</el-dropdown-item>
<!--          <el-dropdown-item>修改密码</el-dropdown-item>-->
          <!--TODO 修改密码-->
        </el-dropdown-menu>
      </template>
    </el-dropdown>

  </div>
</template>

<script>
import {logout} from "@/utils/auth";

export default {
  name: "Avatar",
  data() {
    return {
      avatarImg: require("@/assets/avatar.png")
    }
  },
  mounted() {
    this.avatarImg = this.$storage.getItem("userInfo") ? this.$storage.getItem("userInfo").picture : this.avatarImg;
  },
  methods: {
    handleLogout() {
      logout()
    }
  }
}
</script>

<style scoped>

</style>