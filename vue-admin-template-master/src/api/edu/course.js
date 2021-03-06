import request from "@/utils/request"

export default {
  //添加课程基本信息
  addCourseInfo(courseInfo) {
    return request({
      url: `/eduservice/course/addCourseInfo`,
      method: 'post',
      data:courseInfo
    })
  },
  //查询所有讲师
  getListTeacher() {
    return request({
      url: `/eduservice/teacher/findAll`,
      method: 'get',
    })
  },
  //根据id查询课程基本信息
  getCourseInfoId(id) {
    return request({
      url: `/eduservice/course/getCourseInfo/${id}`,
      method: 'get',
    })
  },
  //修改课程信息
  updateCourseInfo(courseInfo){
    return request({
      url:`/eduservice/course/updateCourseInfo`,
      method:'post',
      data:courseInfo

    })
  }
}
