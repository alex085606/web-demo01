<template>
  <div id="rights">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 权限列表 -->
      <el-table
        class="rightsListTable"
        ref="singleTable"
        :data="rightsList"
        highlight-current-row
        style="width: 100%">
        <el-table-column type="index" width="50" label='#'></el-table-column>
        <el-table-column label='权限名称' property="authName"></el-table-column>
        <el-table-column label='路径' property="path"></el-table-column>
        <el-table-column label='层级' v-slot:default='{ row }'>
          <p v-if = 'row.level === "0"'>一级</p>
          <p v-else-if = 'row.level === "1"'>二级</p>
          <p v-else>三级</p>
        </el-table-column>
      </el-table>
  </div>
</template>

<script>
export default {
  data () {
    return {
      rightsList: []
    }
  },
  created () {
    this.getRightsList()
  },
  methods: {
    async getRightsList () {
      const { meta, data } = await this.$axios.get('rights/list')
      if (meta.status === 200) {
        this.rightsList = data
      } else {
        this.$message.error(meta.msg)
      }
    }
  }
}
</script>

<style lang="less" scoped>
#rights {
  .rightsListTable {
    margin-top: 10px;
  }
}
</style>
