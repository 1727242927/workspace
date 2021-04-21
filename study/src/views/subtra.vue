<template>
  <div>
    <h3>{{ showNum }}</h3>
    <button @click="subbt">-</button>
    <button @click="subbtA">-1</button>
  </div>
</template>
<script>
import {mapState, mapMutations, mapActions, mapGetters} from 'vuex'

export default {
  computed: {
    ...mapState(["count"]),
    ...mapGetters(['showNum'])
  },
  methods: {
    ...mapMutations(['sub', 'subN']),
    ...mapActions(["subAsync", 'subN']),
    subbt() {
      this.sub(3)
    },
    subbtA() {
      this.subAsync(3)
    }
  }
}
</script>
