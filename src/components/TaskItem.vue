<template>
  <div class="container">
    <div class="task-col">
      <div class="innerdiv">任务编号：{{ item.id }}</div>
      <div class="innerdiv">任务名称：{{ item.name }}</div>
    </div>
    <div class="task-col">
      <div class="innerdiv">任务类型：
        <el-tag effect="dark" size="medium">{{ item.taskType }}</el-tag>
      </div>
      <div class="innerdiv">招募人数：{{ item.maxNumber }}</div>
    </div>
    <div class="task-col">
      <div class="innerdiv">任务状态：
        <el-tag :type="item.taskState.type" effect="dark" size="medium">{{ item.taskState.label }}</el-tag>
      </div>
      <div class="innerdiv">截止日期：{{ item.deadlineTime }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "TaskItem",
  props: {
    item: {}
  }
}
</script>

<style scoped>
.innerdiv {
  margin: 30px;
}

.task-col {
  flex: 1
}
.container{
  display: flex;
  width: 100%;
  height: 140px;
  overflow: hidden;
}
</style>