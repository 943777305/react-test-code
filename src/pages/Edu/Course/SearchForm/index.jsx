import React, { useState, useEffect } from "react";
import { Form, Input, Select, Cascader, Button, message } from "antd";
import { connect } from 'react-redux'

// 导入获取所有讲师的方法
import { reqGetAllTeacherList } from '@api/edu/teacher'
import { reqALLSubjectList, reqGetSecSubjectList } from '@api/edu/subject'
import { getCourseList } from '../redux'

 // 导入实现国际化的包
// 页面中不是所有都支持FormattedMessage组件,不支持的地方可以使用useIntl钩子函数
import { FormattedMessage, useIntl } from 'react-intl'
import "./index.less";

const { Option } = Select;




// ***这是一个函数组件
function SearchForm(props) {

   // 得到一个国际化对象
   const intl = useIntl()  // 在不支持FormattedMessage组件的地方可以使用useIntl钩子函数

   const [form] = Form.useForm();
  
  // 函数组件储存状态数据不能使用setState，需要使用useState
   // 定义存储讲师列表的状态
   const [teacherList, setTeacherList] = useState([])
   // 定义存储所有一级课程分类的状态
   const [subjectList, setSubjectList] = useState([])

   // 利用useEffect，模拟类组件的 挂载生命周期
   useEffect(() => {
     async function fetchData() {
       // await Promise.all 可以让内部的请求同时发送，能加快请求效率
       const [teachers, subjectList] = await Promise.all([
        reqGetAllTeacherList(),
        reqALLSubjectList()
      ])
       // 遍历请求到的数据，并且将数据重构到一个新的数组当中
       const options = subjectList.map(subject => {
        // 将遍历出的数据返回到数组当中
        return {
          value: subject._id,
          label: subject.title,
          isLeaf: false // 默认为有子数据
        }
      })
      setSubjectList(options)
      setTeacherList(teachers)
     }
     // 调用包裹了异步回调的函数
     fetchData()
   },[]) 

  const onChange = (value, selectedOptions) => {
    console.log(value, selectedOptions);
  };

  const loadData = async selectedOptions => {
    // 获取一级分类数据
    const targetOption = selectedOptions[selectedOptions.length - 1]
    // cascader组件底层实现了正在加载. 只要给对应级数的数据添加loading,并赋值为true,就会展示正在加载的样式
    targetOption.loading = true
    // 调用之前定义获取二级分类的方法
    let secSubject = await reqGetSecSubjectList(targetOption.value)
    // 由于cascader组件,对渲染的数据,有格式要求,所以必须将二级分类数据也进行重构
    secSubject = secSubject.items.map(item => {
      return {
        value: item._id,
        label: item.title
      }
    })
    // 让加载的小图标隐藏
    targetOption.loading = false
    // 将二级数数据添加到一级的children中，使一级菜单变为可以拓展的样式
    if(secSubject.length>0) {
      // 如果当前选择的一级菜单中 没有子数据就不渲染二级菜单
      targetOption.children = secSubject
    }else{
      targetOption.isLeaf= true
    }
    // 更新subject
    setSubjectList([...subjectList])
  };

  const resetForm = () => {
    form.resetFields();
  };

  const finish = async value => {

    let subjectId
    let subjectParentId 
    if(value.subject && value.subject.length > 1) {
      // 符合条件说明有一级和二级
      subjectId = value.subject[1]
      subjectParentId = value.subject[0]
    }
    if(value.subject && value.subject.length === 1) {
      // 符合条件说明有一级和二级
      subjectId = value.subject[0]
      subjectParentId = 0
    }

    // 通过接口获取课程分页数据
    const data = {
      page: 1,
      limit: 5,
      title: value.title,
      teacherId: value.teacherId,
      subjectId,
      subjectParentId
    }
    await props.getCourseList(data)
    //提示
    message.success('课程数据获取成功')
  }

  return (
    <Form layout="inline" form={form} onFinish={finish}>
      {/* 在label属性中添加一个 FormattedMessage 组件即可实现国际化写法 */}
      <Form.Item name="title" label="<FormattedMessage id='title' />">
        <Input 
          placeholder={intl.formatMessage({
            id: 'title'
          })}
          style={{ width: 250, marginRight: 20 }} />
      </Form.Item>
      <Form.Item name="teacherId" label={<FormattedMessage id='teacher' />}>
        <Select
          allowClear
            placeholder={
              intl.formatMessage({
              id: 'teacher'
            })}
          style={{ width: 250, marginRight: 20 }}
        >
          {teacherList.map(item => (
            <Option key={item._id} value={item._id}>
              {item.name}
            </Option>
          ))}
          {/* <Option value="lucy1">Lucy1</Option>
          <Option value="lucy2">Lucy2</Option>
          <Option value="lucy3">Lucy3</Option> */}
        </Select>
      </Form.Item>
      <Form.Item name="subject" label={<FormattedMessage id='subject' />}>
        <Cascader
          style={{ width: 250, marginRight: 20 }}
          options={subjectList}  // 下拉列表的数据
          loadData={loadData}    // 点击课程分类的时候,loadData会触发,在这里去加载二级数据
          onChange={onChange}    // 选中课程分类之后触发
          // changeOnSelect
          placeholder={intl.formatMessage({
            id: 'subject'
          })}
        />
      </Form.Item>
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          style={{ margin: "0 10px 0 30px" }}
        >
          {<FormattedMessage id='searchBtn' />}
        </Button>
        <Button onClick={resetForm}>
          {<FormattedMessage id='resetBtn' />}
        </Button>
      </Form.Item>
    </Form>
  );
}

// 写 connect 将redux中的状态数据和方法拿到
export default connect(
  null,
  { getCourseList }
)(SearchForm)