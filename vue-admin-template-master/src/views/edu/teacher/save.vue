<template>
  <div class="app-container">
    <el-form label-width="120px">
      <el-form-item label="讲师名称">
        <el-input v-model="teacher.name"/>
      </el-form-item>
      <el-form-item label="讲师排序">
        <el-input-number v-model="teacher.sort" :min='0' controls-position="right"/>
      </el-form-item>
      <el-form-item label="讲师头衔">
        <el-select v-model="teacher.level" clearable placeholder="请选择">
          <el-option :value="1" label="高级讲师"/>
          <el-option :value="2" label="首席讲师"/>
        </el-select>
      </el-form-item>
      <el-form-item label="讲师资历">
        <el-input v-model="teacher.career"/>
      </el-form-item>
      <el-form-item label="讲师简介">
        <el-input v-model="teacher.intro" :rows="10" type="textarea"/>
      </el-form-item>

      <!-- 讲师头像：TODO -->
      <el-form-item label="讲师头像">
        <!-- 头衔缩略图 -->
        <pan-thumb :image="String(teacher.avatar)"/>
        <!-- 文件上传按钮 -->
        <el-button icon="el-icon-upload" type="primary" @click="imagecropperShow=true">更换头像
        </el-button>
        <!--
          v-show：是否显示上传组件
          :key：类似于id，如果一个页面多个图片上传控件，可以做区分
          :url：后台上传的url地址
          @close：关闭上传组件
          @crop-upload-success：上传成功后的回调 -->
        <image-cropper
          v-show="imagecropperShow"
          :key="imagecropperKey"
          :height="300"
          :url="BASE_API+'/eduoss/fileoss'"
          :width="300"
          field="file"
          @close="close"
          @crop-upload-success="cropSuccess"/>
      </el-form-item>

      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import teacher from "../../../api/edu/teacher";
import ImageCropper from '@/components/ImageCropper'
import PanThumb from '@/components/PanThumb'

export default {
  components: {ImageCropper, PanThumb},
  data() {
    return {
      saveBtnDisabled: false,
      teacher: {},
      imagecropperKey: 0,
      imagecropperShow: false,
      BASE_API: process.env.BASE_API
    }

  },
  created() {
    this.init()
    console.log(this.BASE_API)
  },
  watch: {
    $route(to, from) {
      this.init()
    }
  },
  methods: {
    //关闭弹窗的方法
    close() {
      this.imagecropperShow = false
      this.imagecropperKey = this.imagecropperKey + 1
    },
    //上传成功的方法
    cropSuccess(data) {
      this.imagecropperShow = false
      //上传之后接口返回图片地址
      this.teacher.avatar = data.url
      this.imagecropperKey = this.imagecropperKey + 1
    },
    init() {
      if (this.$route.params && this.$route.params.id) {
        const id = this.$route.params.id
        this.getInfo(id)
      } else {
        this.teacher = {}
      }
    },
    //点击提交触发添加或修改
    saveOrUpdate() {
      if (this.teacher.id) {
        this.updateTeacher()
      } else {
        this.saveTeacher()
      }

    },
    updateTeacher() {
      teacher.updateTeacher(this.teacher)
        .then(response => {
          //提示信息
          this.$message({
            type: 'success',
            message: '修改成功'
          });
          this.$router.push({path: '/teacher/table'})


        })
    },
    //添加讲师方法
    saveTeacher() {
      teacher.addTeacher(this.teacher)
        .then(response => {
          //提示信息
          this.$message({
            type: 'success',
            message: '添加成功'
          });
          //回到列表页面，路由重定向
          this.$router.push({path: '/teacher/table'})
        })
    },
    //根据讲师id查数据
    getInfo(id) {
      teacher.getTeacherInfo(id)
        .then(response => {
          this.teacher = response.data.teacher
          console.log("查到" + typeof (this.teacher.avatar))
        })
    }
  }
}
</script>

<style scoped>

</style>
