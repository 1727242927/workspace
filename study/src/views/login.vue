<template>
  <div>
    <button @click="gotohome">登录</button>
    <button @click="getto">chakan1</button>

  </div>

</template>

<script>
export default {
  name: "login",
  methods:{
    gotohome(){
      this.$store.commit('loging')
      console.log(this.$store.state.token)
      this.$router.push({
        path:'/home'
      })
    },
    getto(){
      console.log(this.$store.state.token)
    }
  },
  mounted() {
  }


}
</script>

<style scoped>

</style>
