<template>
  <div id="login">
    <el-form id="loginForm" :rules="rules" :model="ruleForm" ref="ruleForm" status-icon label-width="80px">
      <img src="../assets/1.jpg" alt="avatar">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="ruleForm.username" @keyup.enter.native = 'login' placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="ruleForm.password" @keyup.enter.native = 'login' placeholder="请输入密码" type='password'></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type='primary' @click = 'login'>登录</el-button>
        <el-button class="reset"  @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      ruleForm: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: ['blur', 'change'] },
          { min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: ['blur', 'change'] }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: ['blur', 'change'] },
          { min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  methods: {
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    async login () {
      const { meta, data } = await this.$axios.post('login', {
        username: this.ruleForm.username,
        password: this.ruleForm.password
      })
      localStorage.setItem('token', data.token)
      if (meta.status === 200) {
        this.$router.push('/index')
        this.$message.success(meta.msg)
      } else {
        this.$message.error(meta.msg)
      }
    }
  }
}
</script>

<style lang="less" scoped>
#login {
  width: 100%;
  height: 100%;
  background-color: #2d434c;
  overflow: hidden;
  #loginForm {
    position: relative;
    margin: 200px auto;
    padding: 75px 20px 20px 20px;
    border-radius: 20px;
    width: 400px;
    background-color: #fff;
    img {
      width: 120px;
      height: 120px;
      position: absolute;
      border-radius: 50%;
      border: 2px solid #fff;
      left: 50%;
      transform: translateX(-50%);
      top: -70px;
    }
    .reset {
      margin-left: 80px;
    }
  }

}
</style>
