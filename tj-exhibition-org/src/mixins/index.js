export default {
  data() {
    return {
      tableLoading: false,
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
        showSizeChanger: true,
        showSizeChange: (current, pageSize) => {
          this.pagination.current = current
          this.pagination.pageSize = pageSize
        },
        showTotal: total => `共${total}条`
      }
    }
  }
}