import {
  GET_SUBJECT_LIST,
  GET_SECSUBJECT_LIST,
  UPDATE_SUBJECT
} from "./constants";

const initSubjectList = {
  total: 0, // 总数
  items: [], // 详细user数据
};

export default function subjectList(prevState = initSubjectList, action) {
  switch (action.type) {
    case GET_SUBJECT_LIST:
      // 为了实现展示二级课程分类,需要给items中每一个数据添加children属性.
      // 有了children属性,每一条数据就会有可展开按钮
      action.data.items.forEach(item => {
        item.children = []
      })
      return action.data;
    case GET_SECSUBJECT_LIST:
      // 把二级分类数据添加到对应的一级分类数据的children属性上面

      // 首先获取一级分类的id
      if(action.data.items.length > 0) { // 判断是否有二级分类数据
        const parentId = action.data.items[0].parentId  //获取一级分类的id
        // 找到对应的一级分类数据，进行遍历
        prevState.items.forEach(item => {
          if(item.id === parentId) {
            // 给一级分类的children赋值
            item.children = action.data.items
          }
        })
      }
    case UPDATE_SUBJECT:
      // 通过prevState利用传过来的id找到要修改的那条数据然后修改ttle
      // 1.遍历prevState， prevState是个对象
      prevState.items.forEach(subject => {
        // 先判断传过来的数据是不是一级id
        if(subject._id === action.data.id) {
          // 是一级分类，进行修改并且return
          subject.title = action.data.title
          return
        }
        // 如果没找到，还得遍历一级分类下的二级分类
        subject.children.forEach(secSubject => {
          if(secSubject._id === action.data.id){
            secSubject.title=action.data.title
          }
        })
      })
        // 刚才的代码一直在修改原来的数据,redux也是浅层对比
      // 所以要创建一个新的对象
      return {
        ...prevState
      }
    default:
      return prevState;
  }
}
