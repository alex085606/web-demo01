<template>
  <div id="users">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索 -->
    <el-input placeholder="请输入搜索关键字" v-model="query" class="searchKeyword">
      <el-button slot="append" icon="el-icon-search" @click = 'searchUser'></el-button>
    </el-input>
    <el-button class="searchUser" plain type='success' @click='showAddUserDialog'>添加用户</el-button>
    <!-- 表格 -->
    <el-table
      class="userlist"
      :data="userList"
      border
      style="width: 100%">
      <el-table-column prop="username" label="姓名"></el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column label="用户状态">
        <template v-slot:default='{ row }'>
          <el-switch
            @change = 'changeState(row.id, row.mg_state)'
            v-model="row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template v-slot:default='{ row }'>
          <el-button plain type='primary' size='mini' icon='el-icon-edit' @click='showEditUserDialog(row)'></el-button>
          <el-button plain type='danger' size='mini' icon='el-icon-delete' @click = 'delUser(row.id)'></el-button>
          <el-button plain type='success' size='mini' icon='el-icon-check' @click='showAssignRoleDialog(row)'>分配角色</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[2, 4, 6, 8]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <!-- 添加用户 dialog -->
    <el-dialog
      @close = 'closeDialog'
      title="添加用户"
      :visible.sync="addUserDialogVisible"
      width="40%">
      <el-form :model="addUserForm" :rules="rules" status-icon ref="addUserForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUserForm.username" placeholder='请输入用户名'></el-input>
        </el-form-item>
          <el-form-item label="密码" prop="password">
          <el-input v-model="addUserForm.password" placeholder='请输入密码' type='password'></el-input>
        </el-form-item>
          <el-form-item label="邮箱" prop='email'>
          <el-input v-model="addUserForm.email" placeholder='请输入邮箱'></el-input>
        </el-form-item>
          <el-form-item label="手机" prop='mobile'>
          <el-input v-model="addUserForm.mobile" placeholder='请输入手机'></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addUserDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click='addUser'>确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户 dialog -->
    <el-dialog
      title="修改用户"
      :visible.sync="editUserDialogVisible"
      width="40%">
      <el-form :model="editUserForm" :rules="editrules" status-icon ref="editUserForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="用户名">
          <el-tag type='info'>{{ editUserForm.username }}</el-tag>
        </el-form-item>
          <el-form-item label="邮箱" prop='email'>
          <el-input v-model="editUserForm.email" placeholder='请输入邮箱'></el-input>
        </el-form-item>
          <el-form-item label="手机" prop='mobile'>
          <el-input v-model="editUserForm.mobile" placeholder='请输入手机'></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editUserDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click = 'editUser'>确 定</el-button>
      </span>
    </el-dialog>,
    <!-- 分配角色 dialog -->
    <el-dialog
      title="分配角色"
      :visible.sync="assignRoleDialogVisible"
      width="40%">
      <el-form :model="assignRoleForm" status-icon ref="assignRoleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="用户名">
          <el-tag type='info'>{{ assignRoleForm.username }}</el-tag>
        </el-form-item>
        <el-form-item label="角色列表">
          <el-select v-model="assignRoleForm.roleId" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.roleName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="assignRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click = 'assignRole'>确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  data () {
    return {
      addUserDialogVisible: false,
      addUserForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: ['blur', 'change'] },
          { min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: ['blur', 'change'] }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: ['blur', 'change'] },
          { min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: ['blur', 'change'] }
        ],
        email: [
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        mobile: [
          { pattern: /^1[3-9]\d{9}/, message: '请输入正确的手机号', trigger: ['blur', 'change'] }
        ]
      },
      editrules: {
        email: [
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        mobile: [
          { pattern: /^1[3-9]\d{9}/, message: '请输入正确的手机号', trigger: ['blur', 'change'] }
        ]
      },
      editUserDialogVisible: false,
      editUserForm: {
        id: 0,
        username: '',
        email: '',
        mobile: ''
      },
      query: '',
      pagenum: 1,
      pagesize: 2,
      total: 0,
      userList: [],
      assignRoleDialogVisible: false,
      assignRoleForm: {
        id: '',
        roleId: '',
        username: ''
      },
      options: []
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    async getUserList () {
      const { data, meta } = await this.$axios.get('users', {
        params: {
          query: this.query,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      })
      if (meta.status === 200) {
        this.total = data.total
        this.userList = data.users
      } else {
        this.$message.error(meta.msg)
      }
    },
    handleSizeChange (val) {
      this.pagesize = val
      this.getUserList()
      this.pagenum = 1
    },
    handleCurrentChange (val) {
      this.pagenum = val
      this.getUserList()
    },
    async changeState (id, state) {
      const { meta } = await this.$axios.put(`users/${id}/state/${state}`)
      if (meta.status === 200) {
        this.$message.success(meta.msg)
      } else {
        this.$message.error(meta.msg)
      }
    },
    async delUser (id) {
      try {
        await this.$confirm('你确定要删除该用户吗？', '温馨提示', {
          type: 'warning'
        })
        const { meta } = await this.$axios.delete(`users/${id}`)
        if (meta.status === 200) {
          this.$message.success(meta.msg)
          if (this.userList.length === 1 && this.pagenum > 1) {
            this.pagenum--
          }
          this.getUserList()
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    searchUser () {
      this.getUserList()
    },
    showAddUserDialog () {
      this.addUserDialogVisible = true
    },
    async addUser () {
      try {
        await this.$refs.addUserForm.validate()
        const { username, password, email, mobile } = this.addUserForm
        const { meta } = await this.$axios.post('users', { username, password, email, mobile })
        if (meta.status === 201) {
          this.$message.success(meta.msg)
          this.addUserDialogVisible = false
          this.total++
          this.pagenum = Math.ceil(this.total / this.pagesize)
          this.getUserList()
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    closeDialog () {
      this.$refs.addUserForm.resetFields()
    },
    showEditUserDialog (row) {
      this.editUserForm.username = row.username
      this.editUserForm.id = row.id
      this.editUserForm.email = row.email
      this.editUserForm.mobile = row.mobile
      this.editUserDialogVisible = true
    },
    async editUser () {
      try {
        await this.$refs.editUserForm.validate()
        const { meta } = await this.$axios.put(`users/${this.editUserForm.id}`, {
          email: this.editUserForm.email,
          mobile: this.editUserForm.mobile
        })
        if (meta.status === 200) {
          this.editUserDialogVisible = false
          this.getUserList()
          this.$message.success(meta.msg)
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    async showAssignRoleDialog (row) {
      this.assignRoleDialogVisible = true
      this.assignRoleForm.id = row.id
      this.assignRoleForm.username = row.username
      // const res = await this.$axios.get(`roles/${this.assignRoleForm.id}`)
      // console.log(res)
      // console.log(row)
      const { data, meta } = await this.$axios.get('roles')
      if (meta.status === 200) {
        this.options = data
      } else {
        this.$message.error(meta.msg)
      }
      const res = await this.$axios.get(`users/${row.id}`)
      if (res.meta.status === 200) {
        this.assignRoleForm.roleId = res.data.rid === -1 ? '' : res.data.rid
      } else {
        this.$message.error(meta.msg)
      }
    },
    async assignRole () {
      const { meta } = await this.$axios.put(`users/${this.assignRoleForm.id}/role`, {
        rid: this.assignRoleForm.roleId
      })
      if (meta.status === 200) {
        this.assignRoleDialogVisible = false
        this.$message.success(meta.msg)
      } else {
        this.$message.error(meta.msg)
      }
    }
  }
}
</script>

<style lang="less" scoped>
#users {
  .searchKeyword {
    margin-top: 10px;
    width: 300px;
  }
  .searchUser {
    margin-left: 20px;
  }
  .userlist {
    margin-top: 10px;
  }
  .el-pagination {
    margin-top: 10px;
  }
}
</style>
