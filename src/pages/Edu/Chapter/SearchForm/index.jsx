import React, { useEffect, useState } from 'react'
import { Form, Select, Button, message } from "antd";
// 引入connect
import { connect } from 'react-redux'
// 引入 定义的接口函数
import { reqGetCourseList } from '@api/edu/course'
import { getChapterList } from '../redux'

import "./index.less";

const { Option } = Select


// 函数组件不能用修饰语法，所以我们的connect需要单独写
function SearchForm(props) {
    // 定义课程列表的状态数据
  const [courseList, setCourseList] = useState([])
  // useFrom 可以创建form
  const [form] = Form.useForm();
  // 实例出来的form 下有一个重置表单的方法
  const resetForm = () => {
    form.resetFields(['courseId']);

  };
  // 组件挂载成功获取课程列表数据   useEffect能模拟函数组件当中的生命周期
  useEffect(  () => {
    // 模拟类组件的componentDidMount
    // 因为在useEffect当中不能存在直接的异步函数，所以我们在回调函数内部再进行异步操作
    async function fetchData(){
      // 调用接口函数发送请求 并将请求到的数据保存到res中
      const res= await reqGetCourseList()
      console.log(res);
      // 给课程列表的状态数据赋值
      setCourseList(res)
    }
    // 调用
    fetchData()
  }, [])

  // 根据课程获取章节列表数据的方法
  const handleGetChapterList = async value => {
    const data = {
      page: 1,
      limit: 10,
      courseId: value.courseId
    }
    await props.getChapterList(data)
    console.log(data);
    message.success('课程章节列表数据获取成功')
  }

  return (
    <Form layout="inline" form={form} onFinish={handleGetChapterList}>
      <Form.Item name="courseId" label="课程">
        <Select
          allowClear
          placeholder="课程"
          style={{ width: 250, marginRight: 20 }}
        >
          {courseList.map(course => (
            <Option key={course._id} value={course._id}>
              {course.title}
            </Option>
          ))}
          {/* <Option value="1">1</Option>
          <Option value="2">2</Option>
          <Option value="3">3</Option> */}
        </Select>
      </Form.Item>
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          style={{ margin: "0 10px 0 30px" }}
        >
          查询课程章节
        </Button>
        <Button onClick={resetForm}>重置</Button>
      </Form.Item>
    </Form>
  );
}

export default connect(
  null,
  { getChapterList }
)(SearchForm)