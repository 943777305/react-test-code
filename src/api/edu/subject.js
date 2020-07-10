import request from "@utils/request";

// 设置通用路径
const BASE_URL = "/admin/edu/subject";

// 由于现在是从mock上获取数据，所以要定义一个请求mock的路径
// 这里写了主机名就不会和reoxy中的主机名连接了
// const MOCK_URL = `http://localhost:8888${BASE_URL}`

// 
export function reqGetSubjectList(page,limit) {
  return request({
    url: `${BASE_URL}/${page}/${limit}`,
    method: "GET",
  });
}

