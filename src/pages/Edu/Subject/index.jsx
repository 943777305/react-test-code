import React, { Component } from "react";
// 导入按钮 
import { Button, Table, Tooltip, Input } from 'antd'
import { PlusOutlined, FormOutlined, DeleteOutlined } from '@ant-design/icons'
// 导入connect
import {connect} from 'react-redux'


// 导入发送请求的方法
// import { reqGetSubjectList } from '../../../api/edu/subject'
// 导入redux中的异步action
import { getSubjectList, getSecSubjectList } from './redux'

import './index.css'



// const data = [
//   {
//     key: 1,
//     name: 'Java高级工程师',
//     age: 32,
//     address: 'New York No. 1 Lake Park',
//     description: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.',
//   },
//   {
//     key: 2,
//     name: 'H5大前端',
//     age: 42,
//     address: 'London No. 1 Lake Park',
//     description: 'My name is Jim Green, I am 42 years old, living in London No. 1 Lake Park.',
//   },
//   {
//     key: 3,
//     name: '大数据',
//     age: 29,
//     address: 'Jiangsu No. 1 Lake Park',
//     description: 'This not expandable',
//   },
//   {
//     key: 4,
//     name: '云计算',
//     age: 32,
//     address: 'Sidney No. 1 Lake Park',
//     description: 'My name is Joe Black, I am 32 years old, living in Sidney No. 1 Lake Park.',
//   },
// ];

@connect(
  state => ({ subjietList:state.subjietList}),
  // 这里传入的是一个异步action.但是在展示组件中使用的函数,是通过connect进行封装之后的,虽然函数名一样,但是并不是同一个函数
  { getSubjectList, getSecSubjectList }
) 
class Subject extends Component {
  state = {
    // 如果subjectId没有值表示每一行展示课程分类的title，如果有值就修改数据id
    subjectId:'' ,
    // 用于设置受控组件
    subjectTitle:''
  }

  currentPage = 1
 
   componentDidMount() {
    // this.getSubjietList(1,10)
    // 传递过来的请求方法
    this.props.getSubjectList(1,10)

  }

  // getSubjietList = async (page,pageSize) => {
  //   const res = await  reqGetSubjectList(page, pageSize)
  //   console.log(res)
  //   this.setState({
  //     subject: res
  //   })
  //   console.log(this.state.subject);
  // }

  handlePageChange = (page,pageSize) => {
    // this.getSubjietList(page,pageSize)
    // 得到通过容器组件包装过的方法发送请求
    this.props.getSubjectList(page,pageSize)
    // 动态获取currentPage，使当前页与高亮显示的页数一致
    this.currentPage = page
  }
  handleSizeChange = (current,size) => {
    // this.getSubjietList(current,size)
    // 得到通过容器组件包装过的方法发送请求
    this.props.getSubjectList(current,size)
    // 动态获取currentPage，使当前页与高亮显示的页数一致
    this.currentPage = current

  }

  handleGoAddSubject = () => {
    this.props.history.push('/edu/subject/add')
  }

  handleClickExpand = (expanded, record) => {
    // 判断是否展开了二级菜单
    if( expanded ) {
      // 若展开了，就发送请求获取二级菜单数据  getSecSubjectList是redux中的异步action方法
      this.props.getSecSubjectList(record._id)  
    }
  }
  handleUpdateClick = (value) => {
    return () => {
      this.setState({
        subjectId:value._id,
        subjectTitle:value.title
      })
    }
  }

  handleTitleChange = (e) => {
    this.setState({
      subjectTitle:e.target.value
    })
  }

  render() {
    // 表格列数据  必须写在render中，因为state变化会调用render
    const columns = [
      // title 表头这一列展示文本
      // dataIndex 表示这一列要展示data中哪个部分的数据
      // key: 列的key属性
      { title: '分类名称', dataIndex: 'title', key: 'title', render:() => {
        if(this.state.subjectId === value._id) { // 如果state中存储的id和当前点击的id 相同则展示input
          // 由于第一页数据有十条，所以render会执行十次，接收的value是对应每一行的数据
          return (<Input className='subject-input'
                  value = {this.state.subjectTitle} 
                  onChange= {this.handleTitleChange}/>
                  )
        }
        return <span>{value.title}</span>
       } 
      },
      {
        title: '操作',
        dataIndex: '',
        key: 'x',
        width: '200px', // 调整列的宽度
        // 每一列默认展示文本,如果要展示其他内容,使用render属性
        render: ( value ) => {
          if(this.state.subjectId === value._id){
            return (
              <>
                <Button type='primary' className='update-btn'>
                  确认
                </Button>
                <Button type='danger'>取消</Button>
              </>
            )
          }
          return (
            <>
            <Tooltip title='更新课程分类'>
              <Button type='primary' 
              className='update-btn'
              onClick={this.handleUpdateClick(value)}>
                <FormOutlined />
              </Button>
            </Tooltip>
            <Tooltip title='删除课程分类'>
              <Button type='danger'>
                <DeleteOutlined />
              </Button>
            </Tooltip>
            </>
          )
         
      },

      }
    ]

    return <div className='bg'>
      <Button type='primary' className="subject-btn-add" onClick={this.handleGoAddSubject}><PlusOutlined />新建</Button>
      <Table
        // 表头列数据
        columns={columns}
        // 表示是否可以展示
        expandable={{
          // // 表示展开之后展示的内容
          // expandedRowRender: record => (
          //   <p style={{ margin: 0 }}>{record.description}</p>
          // ),
          // // 表示行是否可以展开, true展开, false不展开
          // rowExpandable: record => record.name !== 'Not Expandable'

          onExpand: this.handleClickExpand
        }}
        // 表格中每一行数据
        // dataSource={this.state.subject.items}
        dataSource={this.props.subjietList.items}
        // 告诉table组件 使用_id 作为key
        rowKey='_id'
        pagination = {{
          // total 总条数
          total:this.props.subjietList.total,
          // 是否显示快速跳转
          showQuickJumper:true,
          showTotal: () =>`共${this.props.subjietList.total}条`,
          // 是否显示修改页面展示条数
          showSizeChanger:true,
          pageSizeOptions:['5','10','15'],
          // 页面发生改变的事件
          onChange:this.handlePageChange,
          onShowSizeChange:this.handleSizeChange,
          current: this.currentPage,
        }}
      />
    </div>;
  }
}
// 因为使用了 @创建connect容器组件，而这种方式的下面不能直接暴露，所以得拿出来单独暴露
export default  Subject
