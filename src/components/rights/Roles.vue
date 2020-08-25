<template>
  <div id="roles">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加角色 -->
    <el-button class="add-role" plain type='success'>添加角色</el-button>
    <!-- 表格 -->
    <el-table
      class="roleList"
      :data="roleList">
      <el-table-column width='60' type='expand'></el-table-column>
      <el-table-column label="#" type='index' width='90'></el-table-column>
      <el-table-column prop="roleName" label="角色名称"></el-table-column>
      <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
      <el-table-column label="操作">
        <template v-slot:default='{ row }'>
          <el-button plain type='primary' size='mini' icon='el-icon-edit' @click='showEditUserDialog(row)'></el-button>
          <el-button plain type='danger' size='mini' icon='el-icon-delete' @click = 'delUser(row.id)'></el-button>
          <el-button plain type='success' size='mini' icon='el-icon-check'>分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data () {
    return {
      roleList: []
    }
  },
  created () {
    this.getRoleList()
  },
  methods: {
    async getRoleList () {
      const { data, meta } = await this.$axios.get('roles')
      if (meta.status === 200) {
        this.roleList = data
      } else {
        this.$message.error(meta.msg)
      }
    }
  }
}
</script>

<style lang="less" scoped>
#roles {
  .add-role {
    margin-top: 10px;
    margin-bottom: 10px;
  }
}
</style>
