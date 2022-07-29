<template>
  <div>
    <el-card>
      <template #header>
        <div class="card-title">
          <span>{{ reportInfo.title }}</span>
          <span>设备信息：{{ reportInfo.device }}</span>
          <span>{{ reportInfo.time }}</span>
        </div>
      </template>
      <div class="bug-list" style="width: 700px; margin: 0 auto">
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
    </el-card>
  </div>
</template>

<script>
import {dateParse} from "@/utils/util";
import {ImgBaseUrl} from "@/api/file";
import {getReportByID} from "@/api/report";
import {ElMessage} from "element-plus";

export default {
  name: "ReportDetails",
  data() {
    return {
      reportId: this.$route.query.id,
      imgBaseUrl: ImgBaseUrl,
      reportInfo: {}
    }
  },
  mounted() {
    this.getReport();
  },
  methods: {
    getReport() {
      let payload = new FormData();
      payload.append("rid", this.reportId);
      getReportByID(payload).then(res => {
        if (res.code === 1) {
          this.reportInfo = JSON.parse(JSON.stringify(res.data));
          console.log(this.reportInfo)
          this.reportInfo.time = dateParse(this.reportInfo.time);
          for (let i = 0; i < this.reportInfo.bugList.length; i++) {
            this.reportInfo.bugList[i].url = JSON.parse(this.reportInfo.bugList[i].url).map((url) => {
              return ImgBaseUrl + '/' + url
            });
          }
        } else {
          ElMessage.error("获取报告失败！");
        }
      })
    }
  }
}
</script>

<style scoped>
.card-title {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
</style>