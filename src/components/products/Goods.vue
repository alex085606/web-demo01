<template>
  <div id="goods">
    <!-- add goods -->
    <el-button plain type="success" @click='toAddGoods'>添加商品</el-button>
    <!-- table -->
    <el-table
      class="goodsList"
      :data="goodsList"
    >
      <el-table-column label="#" type='index' :index = 'indexMethod'></el-table-column>
      <el-table-column label="商品名称" prop="goods_name"></el-table-column>
      <el-table-column label="商品价格" prop="goods_price"></el-table-column>
      <el-table-column label="商品重量" prop="goods_weight"></el-table-column>
      <el-table-column label="创建时间" prop="add_time">
        <template v-slot:default='{ row }'>
          {{ row.add_time | time }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template>
          <el-button plain type='primary' size="mini" icon="el-icon-edit"></el-button>
          <el-button plain type='danger' size="mini" icon="el-icon-delete"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- pagination -->
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
  </div>
</template>

<script>
export default {
  data () {
    return {
      pagenum: 1,
      pagesize: 5,
      Pnp: '',
      total: 0,
      goodsList: []
    }
  },
  created () {
    this.getGoodsList()
  },
  methods: {
    async getGoodsList () {
      const { data, meta } = await this.$axios.get('goods', {
        params: {
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      })
      if (meta.status === 200) {
        this.total = data.total
        this.goodsList = data.goods
      } else {
        this.$message.error(meta.msg)
      }
    },
    handleSizeChange (val) {
      this.pagesize = val
      this.pagenum = 1
      this.getGoodsList()
    },
    handleCurrentChange (val) {
      this.pagenum = val
      this.getGoodsList()
    },
    indexMethod (index) {
      return (this.pagenum - 1) * this.pagesize + index + 1
    },
    toAddGoods () {
      this.$router.push('/goods-add')
    }
  }
}
</script>

<style lang="less" scoped>
#goods {
  .goodsList {
    margin-top: 10px;
  }
  .el-pagination {
    margin-top: 10px;
  }
}
</style>
