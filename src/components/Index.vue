<template>
  <el-container id="index">
    <el-header class="header">
      <div class="logo">
        <img src="../assets/logo.png" alt="">
      </div>
      <div class="title">
        <h1>电商后台管理系统</h1>
      </div>
      <div class="logout">
        <h3>欢迎光临~ <a href="javascript:void(0)">退出</a></h3>
      </div>
    </el-header>
    <el-container>
      <el-aside width="200px" class="aside">Aside</el-aside>
      <el-main class="main">Main</el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    return {}
  }
}
</script>

<style lang="less" scoped>
#index {
  height: 100%;
  .header {
    height: 60px;
    background-color: #d8d8d8;
    display: flex;
    .logo {
      width: 200px;
      flex: 1;
      img {
        height: 40px;
        display: block;
        margin-top: 10px;
      }
    }
    .title {
      text-align: center;
      line-height: 60px;
      flex: 2;
    }
    .logout {
      width: 200px;
      flex: 1;
      text-align: right;
      margin-right: 10px;
      line-height: 60px;
      a {
        color: teal;
      }
    }
  }
  .aside {
    background-color: #545c64;
    height: 100%;
  }
  .main {
    background-color: #ecf0f1;
  }
}
</style>
