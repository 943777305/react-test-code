// 跟课程分类相关的所有请求方法
import request from "@utils/request";

// 设置通用路径
const BASE_URL = "/admin/edu/subject";
// 获取所有课程数据
export function reqGetCourseList() {
    return request({
        url:`${BASE_URL}`,
        method:'GET'
    })
}