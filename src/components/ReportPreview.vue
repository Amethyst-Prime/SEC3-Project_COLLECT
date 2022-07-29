<template>
  <template>
    <div class="card-title">
      <span>{{ reportInfo.title }}</span>
      <span>设备信息：{{ reportInfo.device }}</span>
      <span>{{ reportInfo.time }}</span>
    </div>
  </template>
  <div class="bug-list" style=" margin: 0 auto">
    <div class="bug-item" v-for="(item, index) in reportInfo.bugList">
      <div style="font-weight: bold">缺陷{{ index + 1 }}：</div>
      <el-form label-width="auto">
        <el-form-item label="缺陷情况说明：">
          <div>{{ item.bug_detail }}</div>
        </el-form-item>
        <el-form-item label="缺陷复现步骤：">
          <div>{{ item.bug_trigger }}</div>
        </el-form-item>
        <el-form-item label="缺陷应用截图：">
          <el-row>
            <el-image
                v-for="(url, index) in item.url"
                style="width: 100px; height: 100px"
                :src="url"
                :preview-src-list="item.url"
                :initial-index="4"
                fit="cover">
            </el-image>
          </el-row>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import {SOFTWARECATEGORY, TASKLEVEL} from "@/utils/constant";
export default {
  name: "ReportPreview",
  props: {
    reportInfo:{},
  },
  data() {
    return {
      softwareCategory: SOFTWARECATEGORY,
      level: TASKLEVEL,
    }
  }
}
</script>

<style scoped>

</style>