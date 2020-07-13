import request from "@utils/request";

// 设置通用路径
const BASE_URL = "/admin/edu/subject";

// 由于现在是从mock上获取数据，所以要定义一个请求mock的路径
// 这里写了主机名就不会和reoxy中的主机名连接了
// const MOCK_URL = `http://localhost:8888${BASE_URL}`

//  获取课程分类
export function reqGetSubjectList(page,limit) {
  return request({
    url: `${BASE_URL}/${page}/${limit}`,
    method: "GET",
  });
}

// 获取二级分类
export function reqGetSecSubJectList (parentId) {
  // 返回一个promise
  return request ({
    url: `${BASE_URL}/get/${parentId}`,
    method:'GET'
  })
}
// 添加课程分类
export function reqAddSubjectList(title,parentId) {
  return request ({
    url: `${BASE_URL}/save`,
    method:'POST',
    data:{
      title,
      parentId
    }
  })
}