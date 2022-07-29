<template>
  <div class="nav-bar">
    <Hamburger></Hamburger>
    <bread-crumb></bread-crumb>
    <div class="bav-bar-right">
      <Avatar></Avatar>
    </div>
  </div>
</template>

<script>
import Hamburger from "@/components/Headers/Hamburger";
import BreadCrumb from "@/components/Headers/BreadCrumb";
import Avatar from "@/components/Headers/Avatar";

export default {
  name: "index",
  components: {Avatar, Hamburger, BreadCrumb},
  data() {
    return {}
  },
  methods: {}
}
</script>

<style scoped>
.nav-bar {
  overflow: hidden;
  display: flex;
  align-items: center;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.88);
  height: 100%;
  padding: 0 20px;
}

.bav-bar-right {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  /*margin-right: 50px;*/
}
</style>