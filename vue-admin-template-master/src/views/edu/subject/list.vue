<template>
  <div class="app-container">
    <el-input v-model="filterText" placeholder="Filter keyword" style="margin-bottom:30px;"/>
    <el-tree
      ref="tree2"
      :data="data2"
      :filter-node-method="filterNode"
      :props="defaultProps"
      class="filter-tree"
      default-expand-all
    />
  </div>
</template>

<script>
import subject from "@/api/edu/subject.js";

export default {
  data() {
    return {
      filterText: '',
      data2: [],
      defaultProps: {
        children: 'children',
        label: 'title'
      }
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val)
    }
  },
created() {
    this.getSubjectList()
},
  methods: {
    getSubjectList() {
      subject.getSubjectList()
        .then(res => {
          this.data2 = res.data.list
          console.log(this.data2)
        })
    },
    filterNode(value, data) {
      if (!value) return true
      return data.title.indexOf(value) !== -1
    }
  }
}
</script>
