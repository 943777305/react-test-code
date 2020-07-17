import request from "@utils/request";

// 设置通用路径
const BASE_URL = "/admin/edu/subject";

// 由于现在是从mock上获取数据，所以要定义一个请求mock的路径
// 这里写了主机名就不会和reoxy中的主机名连接了
// const MOCK_URL = `http://localhost:8888${BASE_URL}`

// 获取课程分类
export function reqGetSubjectList(page, limit) {
  // request返回一个promise
  return request({
    url: `${BASE_URL}/${page}/${limit}`,
    // http://localhost:8888/admin/edu/subject/1/10
    method: 'GET'
  })
}
// 获取二级课程分类
export function reqGetSecSubjectList(parentId) {
  // request返回一个promise
  return request({
    // /admin/edu/subject/get/:parentId
    url: `${BASE_URL}/get/${parentId}`,
    method: 'GET'
  })
}

// 添加课程分类
export function reqAddSubjectList(title, parentId) {
  console.log(title, parentId)
  // request返回一个promise
  return request({
    url: `${BASE_URL}/save`,
    method: 'POST',
    data: {
      title,
      parentId
    }
  })
}

// 定义修改课程分类title的方法
export function reqUpdateSubjectList(title, id) {
  // request返回一个promise
  return request({
    url: `${BASE_URL}/update`,
    method: 'PUT',
    data: {
      title,
      id
    }
  })
}

// 定义一个删除课程分类的方法
export function reqDelSubject(id) {
  return request({
    url:`${BASE_URL}/remove/${id}`,
    method:'DELETE'
  })
}

// 获取所有一级课程分类数据
export function reqALLSubjectList() {
  // 返回一个promise
  return request({
    url:`${BASE_URL}`,
    method:'GET'
  })
}


