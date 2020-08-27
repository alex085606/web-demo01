<template>
  <div id="add-goods">
    <!-- steps -->
    <el-steps :active="active" finish-status="success">
      <el-step title="步骤 1" description="基本信息"></el-step>
      <el-step title="步骤 2" description="商品图片"></el-step>
      <el-step title="步骤 3" description="商品内容"></el-step>
    </el-steps>
    <!-- tabs -->
    <el-tabs v-model="activeName" :tab-position="tabPosition"  @tab-click="handleClick">
      <el-tab-pane label="基本信息" name="0">
        <el-form ref="goodsForm" status-icon :rules="rules" :model="goodsForm" label-width="80px">
          <el-form-item label="商品名称" prop="goods_name">
            <el-input v-model="goodsForm.goods_name" placeholder="请输入商品名称"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="goodsForm.goods_price" placeholder="请输入商品价格"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="goodsForm.goods_weight" placeholder="请输入商品重量"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="goodsForm.goods_number" placeholder="请输入商品数量"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <el-cascader
              v-model="goodsForm.goods_cat"
              :options="options"
              :props='props'>
            </el-cascader>
          </el-form-item>
        </el-form>
        <el-button @click='next' type="primary">下一步</el-button>
      </el-tab-pane>
      <el-tab-pane label="商品图片" name="1">
        <el-upload
          action="http://localhost:8888/api/private/v1/upload"
          list-type="picture-card"
          name="file"
          :headers="headers"
          :on-success="handleSuccess"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          multiple
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
        <el-button @click="next" type="primary">下一步</el-button>
      </el-tab-pane>
      <el-tab-pane label="商品内容" name="2">
        <quill-editor></quill-editor>
        <el-button type="primary" @click='addGoods'>添加</el-button>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  data () {
    return {
      active: 0,
      tabPosition: 'left',
      activeName: '',
      goodsForm: {
        goods_name: '',
        goods_cat: [],
        goods_price: '',
        goods_number: '',
        goods_weight: '',
        goods_introduce: '',
        pics: []
      },
      rules: {
        goods_name: [
          { required: true, message: '商品名称不能为空', trigger: ['blur', 'change'] }
        ]
      },
      options: [],
      props: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      headers: {
        Authorization: localStorage.getItem('token')
      },
      dialogVisible: false,
      dialogImageUrl: ''
    }
  },
  created () {
    this.getGoodsList()
  },
  methods: {
    handleClick (tab) {
      this.active = +tab.index
    },
    async getGoodsList () {
      const { data, meta } = await this.$axios.get('categories', { params: { type: 3 } })
      if (meta.status === 200) {
        this.options = data
        console.log(this.options)
      } else {
        this.$message.error(meta.msg)
      }
    },
    next () {
      if (this.active++ > 2) this.active = 0
      this.activeName = '' + this.active
    },
    handleSuccess (res) {
      const { data, meta } = res
      if (meta.status === 200) {
        this.goodsForm.pics.push({
          pic: data.tmp_path
        })
      } else {
        this.$message.error(meta.msg)
      }
    },
    handleRemove (file) {
      const { data } = file.response
      const path = data.tmp_path
      this.goodsForm.pics = this.goodsForm.pics.filter(item => item.pic !== path)
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    async addGoods () {
      try {
        await this.$refs.goodsForm.validate()
        const { meta } = await this.$axios.post('goods', {
          ...this.goodsForm,
          goods_cat: this.goodsForm.goods_cat.join(',')
        })
        if (meta.status === 201) {
          this.$router.push('/goods')
          this.$message.success(meta.msg)
          this.getGoodsList()
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
#add-goods {
  .quill-editor {
    background-color: #fff;
    /deep/.ql-editor {
      min-height: 300px;
    }
  }
}
</style>
