<template>
  <div id="categories">
    <el-button plain type="success" @click='showAssignCateDialog'>添加分类</el-button>
    <el-table
      v-loading="flag"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      row-key="cat_id"
      class="categoryList"
      :data="categoryList"
    >
      <el-table-column label="分类名称" prop="cat_name"></el-table-column>
      <el-table-column label="是否有效">
        <template v-slot:default='{ row }'>
          <p>{{ row.cat_deleted ? '否' : '是' }}</p>
        </template>
      </el-table-column>
      <el-table-column label="排序">
        <template v-slot:default='{ row }'>
          <p>{{ row.cat_level }}</p>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template>
          <el-button plain size="mini" type="primary" icon="el-icon-edit"></el-button>
          <el-button plain size="mini" type="danger" icon="el-icon-delete"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <!-- 添加分类 dialog -->
    <el-dialog
      @close='closeDialog'
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="40%">
      <el-form :model='addCateForm' ref="addcateform" :rules='rules' status-icon label-width="100px" class="demo-ruleForm">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级名称" prop='cat_pid'>
            <el-cascader
              v-model="addCateForm.cat_pid"
              :options="options"
              :props='props'
              clearable>
            </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click='addCate'>确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      flag: true,
      categoryList: [],
      pagenum: 1,
      pagesize: 5,
      total: 0,
      addCateDialogVisible: false,
      addCateForm: {
        cat_pid: [],
        cat_name: '',
        cat_level: ''
      },
      rules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: ['blur', 'change'] }
        ]
      },
      options: [],
      props: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        checkStrictly: true
      }
    }
  },
  created () {
    this.getCategoryList()
  },
  methods: {
    async getCategoryList () {
      this.flag = true
      const { data, meta } = await this.$axios.get('categories', {
        params: {
          type: 3,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      })
      if (meta.status === 200) {
        this.total = data.total
        this.categoryList = data.result
        this.flag = false
      } else {
        this.$message.error(meta.msg)
      }
    },
    handleSizeChange (val) {
      this.pagesize = val
      this.pagenum = 1
      this.getCategoryList()
    },
    handleCurrentChange (val) {
      this.pagenum = val
      this.getCategoryList()
    },
    async showAssignCateDialog () {
      this.addCateDialogVisible = true
      const { data, meta } = await this.$axios.get('categories', {
        params: {
          type: 2
        }
      })
      if (meta.status === 200) {
        this.options = data
      } else {
        this.$message.error(meta.msg)
      }
    },
    closeDialog () {
      this.$refs.addcateform.resetFields()
    },
    async addCate () {
      try {
        await this.$refs.addcateform.validate()
        const { meta } = await this.$axios.post('categories', {
          cat_pid: this.addCateForm.cat_pid[this.addCateForm.cat_pid.length - 1] || 0,
          cat_name: this.addCateForm.cat_name,
          cat_level: this.addCateForm.cat_pid.length
        })
        if (meta.status === 201) {
          this.addCateDialogVisible = false
          this.$message.success(meta.msg)
          this.getCategoryList()
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>

<style lang="less" scoped>
#categories {
  .categoryList {
    margin-top: 10px;
  }
  .el-pagination {
    margin-top: 10px;
  }
}
</style>
