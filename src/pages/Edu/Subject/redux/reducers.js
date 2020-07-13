import {
  GET_SUBJECT_LIST,
  GET_SECSUBJECT_LIST
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
        // 刚才的代码一直在修改原来的数据,redux也是浅层对比
      // 所以要创建一个新的对象
      return {
        ...prevState
      }
    default:
      return prevState;
  }
}
