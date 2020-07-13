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
    // http://localhost:8888/admin/edu/subject/1/10
    method: 'GET'
  })
}

// 添加课程分类
export function reqAddSubjectList(title, parentId) {
  console.log(title, parentId)
  // request返回一个promise
  return request({
    url: `${BASE_URL}/save`,
    // http://localhost:8888/admin/edu/subject/1/10
    method: 'POST',
    data: {
      title,
      parentId
    }
  })
}