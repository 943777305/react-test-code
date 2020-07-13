import {GET_CHAPTER_LIST,GET_LESSON_LIST} from './constant'
import Item from 'antd/lib/list/Item'

const inirChapterList= {
    total:0,
    items:[]
}

export default function chapterList (prevState = inirChapterList,action) {
    switch(action.type){
        case GET_CHAPTER_LIST:
        action.data.items.forEach(item => {
            item.chil = []
        })
          return action.data
        case GET_LESSON_LIST:
            // 将请求到的课时添加到对应章节的children中
            // 从返回的数据中获取chapterId
            if(action.data.length > 0) {
                const chapterId = action.data[0].chapterId
                // 给一级分类添加子元素
                prevState.items.forEach(chapter => {
                    if(chapter._id === chapterId) {
                        chapter.children = action.data
                    }
                })
            }
            return {
                ...prevState
              }
        default:
            return prevState
    }
}