// 导入常量名
import { GET_COURSE_LIMIT_LIST } from './constant'

// 定义初始的值
const initCourseLis = {
    total: 0,
    items: []
}

export default function courseList (prevState = initCourseLis, action) {
    switch(action.type) {
        case GET_COURSE_LIMIT_LIST:
            return action.data
        default:
            return prevState
    }
}


