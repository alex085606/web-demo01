<template>
  <div id="roles">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加角色 -->
    <el-button class="add-role" plain type='success' @click = 'showAddRoleDialog'>添加角色</el-button>
    <!-- 表格 -->
    <el-table
      class="roleList"
      :data="roleList">
      <el-table-column width='60' type='expand'>
        <template v-slot:default='{ row }'>
          <p v-if='row.children.length === 0'>暂无权限</p>
          <el-row class="l1" v-for="l1 in row.children" :key='l1.id'>
            <el-col :span='4'>
              <el-tag closable @close='delRoleRights(row, l1.id)'>{{ l1.authName }}</el-tag><span class="el-icon-arrow-right"></span>
            </el-col>
            <el-col :span='20'>
              <el-row class="l2" v-for='l2 in l1.children' :key='l2.id'>
                <el-col type='success' :span='4'><el-tag closable @close='delRoleRights(row, l2.id)' type='success'>{{ l2.authName }}</el-tag><span class="el-icon-arrow-right"></span></el-col>
                <el-col :span='20'>
                  <el-tag closable @close='delRoleRights(row, l3.id)' class="l3" type='warning' v-for='l3 in l2.children' :key='l3.id'>{{ l3.authName }}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column label="#" type='index' width='90'></el-table-column>
      <el-table-column prop="roleName" label="角色名称"></el-table-column>
      <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
      <el-table-column label="操作">
        <template v-slot:default='{ row }'>
          <el-button plain type='primary' size='mini' icon='el-icon-edit' @click = 'showEditRoleDialog(row)'></el-button>
          <el-button plain type='danger' size='mini' icon='el-icon-delete' @click = 'delRole(row.id)'></el-button>
          <el-button plain type='success' size='mini' icon='el-icon-check' @click = 'showAssignRightsDialog(row)'>分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分配权限 dialog -->
    <el-dialog
      title="分配权限"
      :visible.sync="assignRightsDialogVisible"
      width="40%">
      <el-tree
        :data="data"
        show-checkbox
        default-expand-all
        node-key="id"
        ref="tree"
        highlight-current
        :props="defaultProps">
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="assignRightsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click = 'assignRights'>确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加角色 dialog -->
    <el-dialog
      @close='closeAddRoleForm'
      ref="addRoleForm"
      title="添加角色"
      :visible.sync="addRoleDialogVisible"
      width="40%">
      <el-form status-icon :model="addRoleForm" :rules="addRoleFormRules" ref="addRoleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click='addRole'>确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑角色 -->
    <el-dialog
      title="修改角色"
      :visible.sync="editRoleDialogVisible"
      width="40%">
      <el-form status-icon :model="editRoleForm" :rules="editRoleFormRules" ref="editRoleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click='editRole'>确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      roleList: [],
      assignRightsDialogVisible: false,
      data: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      roleId: 0,
      addRoleDialogVisible: false,
      addRoleForm: {
        roleName: '',
        roleDesc: ''
      },
      addRoleFormRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: ['blur', 'change'] }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: ['blur', 'change'] }
        ]
      },
      editRoleDialogVisible: false,
      editRoleForm: {
        id: '',
        roleName: '',
        roleDesc: ''
      },
      editRoleFormRules: {
        roleName: [
          { required: true, message: '角色名称不能为空', trigger: ['blur', 'change'] }
        ],
        roleDesc: [
          { required: true, message: '角色描述不能为空', trigger: ['blur', 'change'] }
        ]
      }
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
    },
    async delRole (id) {
      try {
        await this.$confirm('你确定要删除该角色吗？', '温馨提示', {
          type: 'warning'
        })
        const { meta } = await this.$axios.delete(`roles/${id}`)
        if (meta.status === 200) {
          this.getRoleList()
          this.$message.success(meta.msg)
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    async delRoleRights (row, rightId) {
      const { data, meta } = await this.$axios.delete(`roles/${row.id}/rights/${rightId}`)
      if (meta.status === 200) {
        row.children = data
        this.$message.success(meta.msg)
      } else {
        this.$message.error(meta.msg)
      }
    },
    async showAssignRightsDialog (row) {
      this.roleId = row.id
      this.assignRightsDialogVisible = true
      const { meta, data } = await this.$axios.get('rights/tree')
      if (meta.status === 200) {
        this.data = data
        const ids = []
        row.children.forEach(l1 => {
          l1.children.forEach(l2 => {
            l2.children.forEach(l3 => {
              ids.push(l3.id)
            })
          })
        })
        this.$refs.tree.setCheckedKeys([...ids])
      } else {
        this.$message.error(meta.msg)
      }
    },
    async assignRights () {
      const ids = this.$refs.tree.getCheckedKeys()
      const halfIds = this.$refs.tree.getHalfCheckedKeys()
      const rids = [...ids, ...halfIds].join(',')
      console.log(this.roleId)
      const { meta } = await this.$axios.post(`roles/${this.roleId}/rights`, { rids })
      if (meta.status === 200) {
        this.$message.success(meta.msg)
        this.assignRightsDialogVisible = false
        this.getRoleList()
      } else {
        this.$message.error(meta.msg)
      }
    },
    showAddRoleDialog () {
      this.addRoleDialogVisible = true
    },
    closeAddRoleForm () {
      this.$refs.addRoleForm.resetFields()
    },
    async addRole () {
      const { meta } = await this.$axios.post('roles', {
        roleName: this.addRoleForm.roleName,
        roleDesc: this.addRoleForm.roleDesc
      })
      if (meta.status === 201) {
        this.addRoleDialogVisible = false
        this.$message.success(meta.msg)
        this.getRoleList()
      } else {
        this.$message.error(meta.msg)
      }
    },
    showEditRoleDialog (row) {
      this.editRoleForm.id = row.id
      this.editRoleForm.roleName = row.roleName
      this.editRoleForm.roleDesc = row.roleDesc
      this.editRoleDialogVisible = true
    },
    async editRole () {
      const { roleName, roleDesc } = this.editRoleForm
      const { meta } = await this.$axios.put(`roles/${this.editRoleForm.id}`, { roleName, roleDesc })
      if (meta.status === 200) {
        this.editRoleDialogVisible = false
        this.$message.success('修改成功')
        this.getRoleList()
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
  .l1 {
    margin-bottom: 10px;
    border-bottom: 1px dashed #ccc;
    .l2 {
      margin-bottom: 10px;
      .l3 {
        margin-right: 5px;
      }
    }
  }
}
</style>
