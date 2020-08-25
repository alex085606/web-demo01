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
        <h3>欢迎光临~ <a href="javascript:void(0)" @click='logout'>退出</a></h3>
      </div>
    </el-header>
    <el-container>
      <el-aside width="200px" class="aside">
        <el-menu
          router
          unique-opened
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b">
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>用户管理</span>
            </template>
            <el-menu-item index="users">
              <i class="el-icon-menu"></i>
              <span slot="title">用户列表</span>
            </el-menu-item>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>权限管理</span>
            </template>
            <el-menu-item index="roles">
              <i class="el-icon-menu"></i>
              <span slot="title">角色列表</span>
            </el-menu-item>
            <el-menu-item index="rights">
              <i class="el-icon-menu"></i>
              <span slot="title">权限列表</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main class="main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    return {}
  },
  methods: {
    logout () {
      this.$confirm('你确定要退出吗？', '温馨提示', {
        type: 'warning'
      }).then(() => {
        localStorage.removeItem('token')
        this.$router.push('/login')
        this.$message.success('退出成功')
      }).catch(() => {
        this.$message.info('取消退出')
      })
    }
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
    .el-menu {
      border-right: none;
    }
  }
  .main {
    background-color: #ecf0f1;
  }
}
</style>
