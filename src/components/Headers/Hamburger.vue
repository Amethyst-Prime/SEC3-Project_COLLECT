<template>
  <div>
    <img id="hamburger-icon" class="hamburger-icon" alt="" @click="changeSideType">
  </div>
</template>

<script>
import storage from "@/utils/storage";

export default {
  name: "Hamburger",
  mounted() {
    if (this.$storage.getItem("asideBar") === null) {
      this.$storage.setItem("asideBar", true);
    }
    this.icon = storage.getItem("asideBar") ? require("@/assets/icon/hamburger-opened.png") : require("@/assets/icon/hamburger-closed.png")
    document.getElementById("hamburger-icon").src = this.icon;
  },
  computed: {},
  data() {
    return {
      icon: ""
    }
  },
  methods: {
    changeSideType() {
      storage.setItem("asideBar", !this.$storage.getItem("asideBar"));
      this.icon = storage.getItem("asideBar") ? require("@/assets/icon/hamburger-opened.png") : require("@/assets/icon/hamburger-closed.png")
      document.getElementById("hamburger-icon").src = this.icon;
      this.$emitter.emit('changeSide');
    }
  }
}
</script>

<style scoped>
.hamburger-icon {
  width: 2em;
  height: 2em;
  margin-top: 5px;
  cursor: pointer;
}
</style>