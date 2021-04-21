<template>
  <div>
    <!--查询表单-->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="teacherQuery.name" placeholder="讲师名"/>
      </el-form-item>
      <el-form-item>
        <el-select v-model="teacherQuery.level" clearable placeholder="讲师头衔">
          <el-option :value="1" label="高级讲师"/>
          <el-option :value="2" label="首席讲师"/>
        </el-select>
      </el-form-item>
      <el-form-item label="添加时间">
        <el-date-picker
          v-model="teacherQuery.begin"
          default-time="00:00:00"
          placeholder="选择开始时间"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
        />
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="teacherQuery.end"
          default-time="00:00:00"
          placeholder="选择截止时间"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
        />
      </el-form-item>
      <el-button icon="el-icon-search" type="primary" @click="getlist()">查询</el-button>
      <el-button type="default" @click="resetData()">清空</el-button>
    </el-form>
    <el-table
      :data="list"
      border
      element-loading-text="数据加载中"
      fit
      highlight-current-row>
      <el-table-column
        align="center"
        label="序号"
        width="70">
        <template slot-scope="scope">
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="名称" prop="name" width="80"/>
      <el-table-column label="头衔" width="80">
        <template slot-scope="scope">
          {{ scope.row.level === 1 ? '高级讲师' : '首席讲师' }}
        </template>
      </el-table-column>
      <el-table-column label="资历" prop="intro"/>
      <el-table-column label="添加时间" prop="gmtCreate" width="160"/>
      <el-table-column label="排序" prop="sort" width="60"/>

      <el-table-column align="center" label="操作" width="200">

        <template slot-scope="scope">

          <router-link :to="'/teacher/edit/'+scope.row.id">
            <el-button icon="el-icon-edit" size="mini" type="primary">修改</el-button>
          </router-link>

          <el-button icon="el-icon-delete" size="mini" type="danger" @click="removeDataById(scope.row.id)">删除
          </el-button>
        </template>

      </el-table-column>

    </el-table>

    <el-pagination
      :current-page="page"
      :page-size="limit"
      :total="total"
      layout=" total,prev, pager, next,jumper"
      style="padding: 30px 0;text-align: center;"
      @current-change="getlist"
    >
    </el-pagination>
  </div>
</template>

<script>
import teacher from "../../../api/edu/teacher";

export default {
  name: "list",
  data() {
    return {
      list: null,
      page: 1,
      limit: 10,
      total: 0,
      teacherQuery: {},
    }
  },
  created() {
    this.getlist()
  },
  methods: {
    removeDataById(id) {
      this.$confirm('此操作将永久删除讲师记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        teacher.deleteTeacherID(id)
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
        this.getlist()
      })
    },
    getlist(page = 1) {
      this.page = page
      teacher.getTeacherList(this.page, this.limit, this.teacherQuery)
        .then(response => {
          this.list = response.data.rows
          this.total = response.data.total
          // console.log(this.list, this.total)
        })
        .catch(error => {
          console.log(error)
        })
    },
    resetData() {
      this.teacherQuery = {}
      this.getlist()
    }
  }


}
</script>

<style scoped>

</style>
