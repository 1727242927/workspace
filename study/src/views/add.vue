<template>
  <div>
    <!--  <h3>当前的con值为{{$store.state.count}}</h3>-->
    <h3>{{ this.$store.getters.showNum }}</h3>
    <button @click="btnadd">+</button>
    <button @click="btnadd1">+1</button>
  </div>
</template>
<script>
export default {
  methods: {
    btnadd() {
      this.$store.commit('add', 3)
    },
    btnadd1() {
      this.$store.dispatch('addAsync', 1)
    },
  }
}
</script>
