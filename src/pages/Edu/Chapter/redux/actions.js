// 引入常量名
import {GET_CHAPTER_LIST,GET_LESSON_LIST,BATCH_DEL_CHAPTER,BATCH_DEL_LESSON} from './constant'
// 引入请求方法
import { reqGetChapterList,reqBatchDelChapter } from '@api/edu/chapter'
import { reqGetLessonList,reqBatchDelLesson } from '@api/edu/lesson'


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


// 获取课时列表同步action
function getLessonListSync(data) {
  return { type: GET_LESSON_LIST, data }
}

//获取课时列表异步action
export function getLessonList(chapterId) {
  return dispatch => {
    return reqGetLessonList(chapterId).then(res => {
      dispatch(getLessonListSync(res))
      return res
    })
  }
}

// 批量删除章节的同步action
function batchDelChapterSync( data) {
  return {type:BATCH_DEL_CHAPTER, data}
}

//批量删除章节的异步action
export function batchDelChapter(chapterIds) {
  return dispatch => {
    return reqBatchDelChapter(chapterIds).then(res => {
      dispatch(batchDelChapterSync(chapterIds))
      return res
    })
  }
}


// 批量删除课时
// data应该是要删除的章节的ids
function batchDelLessonSync(data) {
  return { type: BATCH_DEL_LESSON, data }
}

//获取课时列表异步action
export function batchDelLesson(lessonIds) {
  return dispatch => {
    return reqBatchDelLesson(lessonIds).then(res => {
      // 注意: 传入同步action的不是请求之后的结果,应该是要删除的课时的ids
      dispatch(batchDelLessonSync(lessonIds))
      return res
    })
  }
}

