// 跟课程分类相关的所有请求方法
import request from "@utils/request";

// 设置通用路径
const BASE_URL = "/admin/edu/course";
// 获取所有课程数据
export function reqGetCourseList() {
    return request({
        url:`${BASE_URL}`,
        method:'GET'
    })
}


// 获取分页课程数据的接口
export function reqGetCourseLimitList({
    page,
    limit,
    title,
    teacherId,
    subjectId,
    subjectParentId
  }) {
    // request返回一个promise
    return request({
      url: `${BASE_URL}/${page}/${limit}`,
      method: 'GET',
      params: {
        title,
        teacherId,
        subjectId,
        subjectParentId
      }
    })
  }