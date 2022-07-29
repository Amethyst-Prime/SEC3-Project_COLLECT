<template>
  <el-container class="app-wrapper">
    <el-aside :width="asideWidth" class="sidebar-container">
      <img class="logo" :class="{'logo-small': !this.$storage.getItem('asideBar')}" :src=logo alt="logo"
        @click="this.$router.push('/')">
      <Menu></Menu>
    </el-aside>
    <el-container class="container" :class="{'container-big': !this.$storage.getItem('asideBar')}">
      <el-header class="nav-top">
        <Headers></Headers>
      </el-header>
      <el-main class="wrapper">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
    import Menu from './Menu'
    import Headers from './Headers'

    export default {
        name: "Frame",
        components: {
            Menu,
            Headers
        },
        mounted() {
            this.$emitter.on('changeSide', this.changeSideBar);
        },
        data() {
            return {
                logo: this.$storage.getItem("asideBar") ? require("@/assets/logo.png") : require("@/assets/logo_small.png"),
                asideWidth: this.$storage.getItem("asideBar") ? "200px" : "67px",
            }
        },
        methods: {
            changeSideBar() {
                let state = this.$storage.getItem("asideBar");
                this.logo = state ? require("@/assets/logo.png") : require("@/assets/logo_small.png");
                this.asideWidth = state ? "200px" : "67px";
            }
        }
    }
</script>

<style scoped>
    .app-wrapper {
        position: relative;
    }
    
    .sidebar-container {
        position: fixed;
        /*width: 200px;*/
        height: 100vh;
        background-color: #409EFF;
        color: white;
        overflow-y: auto;
        transition: width 0.5s;
    }
    
    .nav-top {
        padding: 0 !important;
        height: 50px;
    }
    
    .logo {
        width: 200px;
        cursor: pointer;
    }
    
    .logo-small {
        width: 50px;
        margin: 5px 0 0 5px;
        cursor: pointer;
    }
    
    .container {
        margin-left: 200px;
    }
    
    .container-big {
        margin-left: 67px;
    }
    
    .wrapper {
        background: #eef0f3;
        border-left: 3px solid #ddd;
        padding: 20px;
        height: calc(100vh - 50px);
    }
</style>