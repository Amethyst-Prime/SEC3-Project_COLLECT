<template>
  <div>
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>个人信息</span>
<!--          <edit v-if="disabled" @click="handleEdit"-->
<!--                style="width: 2em; height: 2em; margin: 0 0 -10px 8px; cursor: pointer"/>-->
<!--          <checked @click="commit" v-else style="width: 2em; height: 2em; margin: 0 0 -10px 8px; cursor: pointer"/>-->
        </div>
      </template>
      <div style="display: flex; justify-content: center">
        <div>
          <el-form style="width: 500px">
            <el-row>
              <el-col :span="4">
                <el-avatar shape="square" :size="70" :src="userInfo.avatar.value"></el-avatar>
              </el-col>
              <el-col :span="20">
                <el-form-item>
                  <div v-if="disabled" style="font-size: 20px; font-weight: bold">{{ userInfo.username.value }}</div>
                  <el-input v-else v-model="userInfo.username.value"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-tag size="large">{{ userInfo.userRole.value }}</el-tag>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <el-form label-width="80px">
            <el-form-item :label="userInfo.id.label">
              <el-input class="info-value" v-model="userInfo.id.value" disabled></el-input>
            </el-form-item>
            <el-form-item :label="userInfo.phone.label">
              <el-input class="info-value" v-model="userInfo.phone.value" disabled></el-input>
            </el-form-item>
            <el-form-item :label="userInfo.createTime.label">
              <el-input class="info-value" v-model="userInfo.createTime.value" disabled></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import {ElMessage} from "element-plus";
import {dateParse} from "@/utils/util";
import {USERROLE} from "@/utils/constant";

export default {
  name: "BaseInfo",
  data() {
    return {
      disabled: true,
      userInfo: {
        avatar: {label: "头像", value: ""},
        id: {label: "用户ID", value: ""},
        createTime: {label: "注册时间", value: ""},
        username: {label: "用户名", value: ""},
        phone: {label: "电话号码", value: ""},
        userRole: {label: "用户角色", value: ""},
      }
    }
  },
  mounted() {
    this.initUserInfo();
  },
  methods: {
    initUserInfo() {
      let info = this.$storage.getItem("userInfo");
      if (info === null) {
        ElMessage.error("请先登录！");
      } else {
        this.userInfo.id.value = info.id;
        this.userInfo.createTime.value = dateParse(info.createTime);
        this.userInfo.avatar.value = info.picture;
        this.userInfo.username.value = info.uname;
        this.userInfo.phone.value = info.phone;
        switch (info.userRole) {
          case USERROLE.WORKER:
            this.userInfo.userRole.value = "众包工人";
            break;
          case USERROLE.DISTRIBUTOR:
            this.userInfo.userRole.value = "发包方";
            break;
          case USERROLE.ADMIN:
            this.userInfo.userRole.value = "管理员";
            break
          default:
            this.userInfo.userRole.value = "角色异常";
        }
      }
    },
    handleEdit() {
      this.disabled = false;
    },
    commit() {
      this.disabled = true;
    }
  }
}
</script>

<style scoped>
.info-value {
  width: 500px;
}
</style>