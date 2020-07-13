import request from '@utils/request'

// 请求路径不写主机名,会将这个路径和package.json中配置的代理proxy的主机名进行拼接
const BASE_URL = '/admin/edu/lesson'

export function reqGetLessonList(chapterId) {
    // 返回一个promise
    return request ({
        url:`${BASE_URL}/get/${chapterId}`,
        method: 'GET'
    })
}


