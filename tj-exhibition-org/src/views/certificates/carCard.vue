<template>
  <div>
    <CarCard :data="data"/>
  </div>
</template>

<script>
import CarCard from '@/components/CarCard'

export default {
  components: {
    CarCard
  },
  data() {
    return {
      data: {}
    }
  },
  mounted() {
    const info = sessionStorage.getItem('carLicense')
    if (info) {
      this.data = JSON.parse(info)
    }
  }
}
</script>
