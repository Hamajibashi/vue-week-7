<template>
  <BackNavbar></BackNavbar>
  <ToastMessages></ToastMessages>
  <router-view v-if="checkSuccess"></router-view>
</template>

<script>
import emitter from '@/methods/eventBus.js'
import BackNavbar from '@/components/BackNavbar.vue'
import ToastMessages from '@/components/ToastMessages'

export default {
  components: {
    BackNavbar,
    ToastMessages
  },
  data () {
    return {
      checkSuccess: false
    }
  },
  provide () {
    return {
      emitter
    }
  },
  methods: {
    checkLogin () {
      const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1')
      if (token) {
        this.$http.defaults.headers.common.Authorization = token

        const api = `${process.env.VUE_APP_API}/api/user/check`
        this.$http.post(api, { api_token: this.token })
          .then(() => {
            this.checkSuccess = true
          })
          .catch((err) => {
            alert(err.data.message)
            this.$router.push('/login')
          })
      } else {
        alert('您尚未登入')
        this.$router.push('/login')
      }
    }
  },
  mounted () {
    this.checkLogin()
  }
}
</script>
