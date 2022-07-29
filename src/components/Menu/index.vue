<template>
  <el-menu
      :uniqueOpened="true"
      class="menu"
      background-color="#409EFF"
      text-color="#fff"
      active-text-color="#ffd04b"
      :default-active="defaultActive"
      router
      :collapse="collapse"
  >
    <el-menu-item
        class="menu-item"
        v-for="item in menuList"
        :index="item.path"
        :key="item.id"
        @click="savePath(item.path)">
      <el-icon>
        <component :is="item.icon"></component>
      </el-icon>
      <template #title>{{ item.menuName }}</template>
    </el-menu-item>
  </el-menu>
</template>

<script>
import {ElMessage} from "element-plus";
import {USERROLE} from "@/utils/constant";

export default {
  name: "index",
  data() {
    return {
      menuList: [],
      collapse: !this.$storage.getItem('asideBar'),
      defaultActive: "",
    }
  },
  mounted() {
    this.initMenuList();
    this.$emitter.on('changeSide', this.changeSideBar);
  },
  methods: {
    changeSideBar() {
      this.collapse = !this.collapse;
    },
    savePath(path) {
      this.$storage.setItem("path", path);
    },
    initMenuList() {
      let userRole = this.$storage.getItem('userInfo') ? this.$storage.getItem('userInfo').userRole : "";
      switch (userRole) {
        case USERROLE.WORKER:
          this.menuList = [
            {id: 1, menuName: "个人信息", path: "/wInfo", icon: "User"},
            {id: 2, menuName: "任务广场", path: "/wTaskList", icon: "DocumentCopy"},
            {id: 3, menuName: "正在执行", path: "/currentTask", icon: "SetUp"},
            {id: 4, menuName: "历史完成", path: "/historyTask", icon: "Timer"}
          ];
          break;
        case USERROLE.DISTRIBUTOR:
          this.menuList = [
            {id: 1, menuName: "个人信息", path: "/dInfo", icon: "User"},
            {id: 2, menuName: "任务广场", path: "/dAllTask", icon: "DocumentCopy"},
            {id: 3, menuName: "我的发布", path: "/dTaskList", icon: "Compass"},
          ];
          break;
        case USERROLE.ADMIN:
          this.menuList = [
            {id: 1, menuName: "个人信息", path: "/aInfo", icon: "User"},
            {id: 2, menuName: "所有任务", path: "/aTaskList", icon: "Compass"},
            {id: 3, menuName: "推荐规则", path: "/setting", icon: "Setting"}
          ];
          break;
        default:
          if (this.$route.path !== '/index')
            ElMessage.error("用户角色错误")
      }
      let paths = []
      for (let i = 0; i < this.menuList.length; i++) {
        paths.push(this.menuList[i].path);
      }
      this.defaultActive = paths.includes(this.$storage.getItem("path")) ? this.$storage.getItem("path") : '/index';
    }
  }
}
</script>

<style scoped>
.menu-item {
  padding-left: 40px !important;
}
</style>