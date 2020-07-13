// 引入常量名
import {GET_CHAPTER_LIST,GET_LESSON_LIST} from './constant'
// 引入请求方法
import { reqGetChapterList } from '@api/edu/chapter'
import { reqGetLessonList } from '@api/edu/lesson'


// 定义获取章节列表同步actio
function getChapterListSync(data) {
    return {type: GET_CHAPTER_LIST,data}
}
// 获取章节列表的异步action
export function getChapterList({ page, limit, courseId }) {
    return dispatch => {
        return reqGetChapterList({ page, limit, courseId}).then(res => {
            // 调用异步action
            dispatch(getChapterListSync(res))
            return res
        })
    }
}


// 获取课程章节列表同步action
function getLessonListSync(data) {
    return { type: GET_LESSON_LIST, data }
  }
// 获取课程章节列表同步action
export function getLessonList (chapterId) {
    return dispatch =>{
        return reqGetLessonList(chapterId).then(res => {
            dispatch(getLessonListSync(res))
            return res
        })
    }
}





