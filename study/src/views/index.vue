<template>
  <div>
    <button @click="getto">查看</button>
    <button @click="gotologin">登录</button>
    <button @click="gotouser">user</button>
    <add></add>
    <subtra></subtra>
  </div>
</template>

<script>
import add from './add'
import subtra from './subtra'

export default {
  name: "index",
  components: {
    add,
    subtra
  },
  methods: {
    getto() {
      console.log(this.$store.state.token)
    },
    gotologin() {
      console.log(this.$store.state.token)
      this.$router.push({
        path: '/login'
      })
    },
    gotouser() {
      this.$router.push({
        path: '/user'
      })

    }
  }

}
</script>

<style scoped>

</style>
