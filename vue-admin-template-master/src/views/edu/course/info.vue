<template>
  <div class="app-container">
    <h2 style="text-align: center;">发布新课程</h2>
    <el-steps :active="1" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="提交审核"/>
    </el-steps>

    <el-form label-width="120px">

      <el-form-item label="课程标题">
        <el-input v-model="courseInfo.title" placeholder=" 示例：机器学习项目课：从基础到搭建项目视频课程。专业名称注意大小写"/>
      </el-form-item>

      <el-form-item label="课程分类">
        <el-select

          v-model="courseInfo.subjectParentId"
          placeholder="一级分类" @change="subjectLevelOneChanged">
          <el-option
            v-for="subject in subjectOneList"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"/>
        </el-select>
        <!-- 二级分类 -->
        <el-select v-model="courseInfo.subjectId" placeholder="二级分类">
          <el-option
            v-for="subject in subjectTwoList"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"/>
        </el-select>
      </el-form-item>

      <!-- 课程讲师 -->
      <el-form-item label="课程讲师">
        <el-select
          v-model="courseInfo.teacherId"
          placeholder="请选择">
          <el-option
            v-for="teacher in teacherList"
            :key="teacher.id"
            :label="teacher.name"
            :value="teacher.id"/>
        </el-select>
      </el-form-item>


      <el-form-item label="总课时">
        <el-input-number :min="0" v-model="courseInfo.lessonNum" controls-position="right" placeholder="请填写课程的总课时数"/>
      </el-form-item>

      <!-- 课程简介-->
      <el-form-item label="课程简介">
        <tinymce :height="300" v-model="courseInfo.description"/>
      </el-form-item>

      <!-- 课程封面-->
      <el-form-item label="课程封面">
        <el-upload
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :action="BASE_API+'/eduoss/fileoss'"
          class="avatar-uploader">
          <img :src="courseInfo.cover">
        </el-upload>
      </el-form-item>
      <el-form-item label="课程价格">
        <el-input-number :min="0" v-model="courseInfo.price" controls-position="right" placeholder="免费课程请设置为0元"/>
        元
      </el-form-item>
      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存并下一步</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import course from '@/api/edu/course'
import subject from "@/api/edu/subject"
import tinymce from '@/components/Tinymce'

export default {
  data() {
    return {
      saveBtnDisabled: false,
      courseInfo: {
        title: '',
        subjectId: '',
        teacherId: '',
        lessonNum: 0,
        description: '',
        cover: 'https://gaoguang.oss-cn-huhehaote.aliyuncs.com/4683051d9642695.jpg',
        price: 0
      },
      courseId: '',
      teacherList: [],
      subjectOneList: [],
      subjectTwoList: [],
      BASE_API: process.env.BASE_API

    }
  },
  components: {
    tinymce
  },
  created() {
    this.inFo()
  },
  watch: {
    $route(to, form) {
      this.inFo()
    }
  },
  methods: {
    inFo() {
      this.getListTeacher()
      this.getOneSubject()
      if (this.$route.params && this.$route.params.id) {
        this.courseId = this.$route.params.id
        this.getInfo()
      } else {
        this.courseInfo = {}
      }
    },
    //根据课程id查询
    getInfo() {
      course.getCourseInfoId(this.courseId)
        .then(res => {
          this.courseInfo = res.data.courseInfoVo
          //1查询所有分类，包括一级和二级
          subject.getSubjectList()
            .then(res => {
              //2获取所有一及分类
              this.subjectOneList = res.data.list
              //遍历所有一级分类，比较当前courseId
              for (let i = 0; this.subjectOneList.length; i++) {
                let oneSubject = this.subjectOneList[i]
                if (this.courseInfo.subjectParentId === oneSubject.id) {
                  //获取一级分类所有的二级分类
                  this.subjectTwoList = oneSubject.children
                }
              }
            })
        })
    },
    //上传封面成功
    handleAvatarSuccess(res, file) {
      this.courseInfo.cover = res.data.url
    },
    //上传封面之前
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    //一级分类改变时
    subjectLevelOneChanged(value) {
      for (let i = 0; i < this.subjectOneList.length; i++) {
        let oneSubject = this.subjectOneList[i]
        if (value === oneSubject.id) {
          this.subjectTwoList = oneSubject.children
          this.courseInfo.subjectId = ''
        }
      }
    },
    //查询所有一级分类
    getOneSubject() {
      subject.getSubjectList()
        .then(res => {
          this.subjectOneList = res.data.list
        })
    },

    //查询所有讲师
    getListTeacher() {
      course.getListTeacher()
        .then(res => {
          this.teacherList = res.data.items
        })
    },
    //添加
    addCourse() {
      course.addCourseInfo(this.courseInfo)
        .then(res => {
          //提示信息
          this.$message({
            type: 'success',
            message: '添加课程信息成功'
          })
          //跳转
          this.$router.push({path: '/course/chapter/' + res.data.courseId})
        })
    },
    //修改
    updateCourse() {
      course.updateCourseInfo(this.courseInfo)
        .then(res => {
          //提示信息
          this.$message({
            type: 'success',
            message: '修改课程信息成功'
          })
          //跳转
          this.$router.push({path: '/course/chapter/' + this.courseId})
        })
    },
    //提交表单
    saveOrUpdate() {
      if (this.courseInfo.id) {
        this.updateCourse()
      } else {
        this.addCourse()
      }
    }
  }
}
</script>

<style scoped>
.tinymce-container {
  line-height: 29px;
}
</style>
