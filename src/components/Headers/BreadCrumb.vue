<template>
  <div class="bread-crumb">
    <el-breadcrumb>
      <el-breadcrumb-item v-for="(item, index) in breadCrumbList" :key="index">
        <span class="no-redirect" v-if="index === breadCrumbList.length - 1">{{ item.label }}</span>
        <span class="redirect" v-else @click="handleRedirect(item.to)">{{ item.label }}</span>
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  name: "BreadCrumb",
  data() {
    return {
      breadCrumbList: [],
    }
  },
  mounted() {
    this.initBreadCrumbList();
  },
  watch: {
    $route(to, from) {
      // let fromPath = JSON.parse(JSON.stringify(from));
      let toPath = JSON.parse(JSON.stringify(to));
      // if (toPath.matched[1].meta.needQuery) {
      //   this.$router.replace({path: toPath.path, query: this.$storage.getItem("query")});
      // }
      this.initBreadCrumbList()
    }
  },
  methods: {
    initBreadCrumbList() {
      let routePath = this.$route.fullPath;
      // console.log(routePath);
      let route = this.$route.matched
      if (route.length <= 1) {
        return
      }
      let labels = route[1].meta.label.split("/")
      let to = []
      let temp = routePath.split("/")
      let length = temp.length;
      for (let i = 0; i < length - 1; i++) {
        to.unshift(temp.join("/"))
        temp.pop();
      }
      this.breadCrumbList = [];
      for (let i = 0; i < labels.length; i++) {
        this.breadCrumbList.push({
          label: labels[i],
          to: to[i]
        })
      }
      // console.log(this.breadCrumbList)
    },
    handleRedirect(path) {
      if (this.$storage.getItem("query")) {
        this.$router.replace({path: path, query: this.$storage.getItem("query")});
      } else {
        this.$router.replace(path);
      }
    }
  }
}
</script>

<style scoped>
.no-redirect {
  color: #666;
  font-weight: 600;
  cursor: text;
  text-align: center;
}

.redirect {
  color: #97a8be;
  cursor: pointer;
  text-align: center;
}

.redirect:hover {
  color: #409EFF;
}

.bread-crumb {
  padding-left: 20px;
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
}
</style>