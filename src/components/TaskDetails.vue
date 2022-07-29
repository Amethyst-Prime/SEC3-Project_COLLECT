<template>
  <div>
    <el-row>
      <el-col :span="8">
        <div>任务编号：{{ taskDetails.id }}</div>
      </el-col>
      <el-col :span="8">
        <div>任务状态：
          <el-tag size="medium">{{ taskDetails.taskState.label }}</el-tag>
        </div>
      </el-col>
      <el-col :span="8">
        <div>任务类型:
          <el-tag size="medium">{{ taskDetails.taskType }}</el-tag>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <div>发布时间：{{ taskDetails.createTime }}</div>
      </el-col>
      <el-col :span="8">
        <div>截止时间：{{ taskDetails.deadlineTime }}</div>
      </el-col>
      <el-col :span="8">
        <div>所需工人：{{ taskDetails.maxNumber }}人</div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        软件类型：
        <el-tag class="ml-2" type="success" v-for="item in taskDetails.categories"
                style="margin-right: 4px">
          {{ softwareCategory[item].label }}
        </el-tag>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        设备类型：
        <el-tag class="ml-2" type="success" v-for="item in taskDetails.devices"
                style="margin-right: 4px">
          {{ item }}
        </el-tag>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        任务难度：
        <el-tag class="ml-2" type="success">
          {{ level[taskDetails.taskLevel].label }}
        </el-tag>
      </el-col>
    </el-row>
    <el-divider></el-divider>
    <el-descriptions class="margin-top" title="任务简介" direction="vertical">
      <el-descriptions-item label="">{{ taskDetails.brief }}</el-descriptions-item>
    </el-descriptions>
    <el-divider></el-divider>
    <el-descriptions v-if="showFile" class="margin-top" title="文件列表" :column="1" direction="vertical">
      <el-descriptions-item label="待测应用">
        <el-icon>
          <document/>
        </el-icon>
        {{ taskDetails.fileList[0].filename }}
      </el-descriptions-item>
      <el-descriptions-item label="描述文件">
        <el-icon>
          <document/>
        </el-icon>
        {{ taskDetails.fileList[1].filename }}
      </el-descriptions-item>
    </el-descriptions>
  </div>
</template>

<script>
import {SOFTWARECATEGORY, TASKLEVEL} from "@/utils/constant";

export default {
  name: "TaskDetails",
  props: {
    taskDetails: {},
    showFile: false,
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