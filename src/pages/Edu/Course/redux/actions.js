// 导入常量名
import { GET_COURSE_LIMIT_LIST } from './constant'

// 导入请求接口
import { reqGetCourseLimitList } from '@api/edu/course'



// 同步的action 
function getCourseListtSync (data) {
    return {
        type:GET_COURSE_LIMIT_LIST,
        data
    }
}

// 异步的action
export function getCourseList (data) {
    return dispatch => {
        // 调用接口发送请求
        return reqGetCourseLimitList(data).then(res => {
            dispatch(getCourseListtSync(res))
            return res
        })
    }
}