<template>
  <div class="app-container">
    <h2 style="text-align: center;">发布新课程</h2>
    <el-steps :active="2" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="提交审核"/>
    </el-steps>


    <el-button type="text" @click="dialogChapterFormVisible=true">添加章节</el-button>
    <!-- 章节 -->
    <ul class="chapterList">
      <li
        v-for="chapter in chapterVideoList"
        :key="chapter.id">
        <p>
          {{ chapter.title }}
          <span class="acts">
                <el-button type="text">添加课时</el-button>
                <el-button style="" type="text">编辑</el-button>
                <el-button type="text">删除</el-button>
            </span>
        </p>
        <!-- 视频 -->
        <ul class="chapterList videoList">
          <li
            v-for="video in chapter.children"
            :key="video.id">
            <p>{{ video.title }}
              <span class="acts">
                        <el-button type="text">编辑</el-button>
                        <el-button type="text">删除</el-button>
                    </span>
            </p>
          </li>
        </ul>
      </li>
    </ul>
    <div>
      <el-button @click="previous">上一步</el-button>
      <el-button :disabled="saveBtnDisabled" type="primary" @click="next">下一步</el-button>
    </div>
    <!-- 添加和修改章节表单 -->
    <el-dialog :visible.sync="dialogChapterFormVisible" title="添加章节">
      <el-form :model="chapter" label-width="120px">
        <el-form-item label="章节标题">
          <el-input v-model="chapter.title"/>
        </el-form-item>
        <el-form-item label="章节排序">
          <el-input-number v-model="chapter.sort" :min="0" controls-position="right"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogChapterFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdate">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import chapter from "@/api/edu/chapter";
export default {
  data(){
    return{
      saveBtnDisabled:false,
      chapterVideoList:[],
      courseId:'',
      dialogChapterFormVisible:false,
      chapter:{}
    }
  },
  created() {
    if(this.$route.params && this.$route.params.id){
      this.courseId=this.$route.params.id
      this.getChapterVideo()
    }
  },
  methods:{
    //根据课程id查章节和小节
    getChapterVideo(){
      chapter.getAllChapterVideo(this.courseId)
      .then(res=>{
        this.chapterVideoList=res.data.allChapterVideo
      })
    },
    previous(){
      this.$router.push({path:'/course/info/'+this.courseId})

    },
    next(){
      this.$router.push({path:'/course/publish/1'+this.courseId})
    }
  }
}
</script>

<style scoped>
.chapterList{
  position: relative;
  list-style: none;
  margin: 0;
  padding: 0;
}
.chapterList li{
  position: relative;
}
.chapterList p{
  float: left;
  font-size: 20px;
  margin: 10px 0;
  padding: 10px;
  height: 70px;
  line-height: 50px;
  width: 100%;
  border: 1px solid #DDD;
}
.chapterList .acts {
  float: right;
  font-size: 14px;
}
.videoList{
  padding-left: 50px;
}
.videoList p{
  float: left;
  font-size: 14px;
  margin: 10px 0;
  padding: 10px;
  height: 50px;
  line-height: 30px;
  width: 100%;
  border: 1px dotted #DDD;
}
</style>
