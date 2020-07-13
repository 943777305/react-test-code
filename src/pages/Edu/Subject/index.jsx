import React, { Component } from "react";
// 导入按钮 
import { Button, Table, Tooltip, Input, message,Modal } from 'antd'
import { PlusOutlined, FormOutlined, DeleteOutlined,ExclamationCircleOutlined } from '@ant-design/icons'
// 导入connect
import {connect} from 'react-redux'


// 导入发送请求的方法
// import { reqGetSubjectList } from '../../../api/edu/subject'
// 导入redux中的异步action
import { getSubjectList, getSecSubjectList, updataSubject} from './redux'

import './index.css'
// 导入课程分类的数据方法
import { reqDelSubject } from "../../../api/edu/subject";


const { confirm } = Modal
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
  state => ({ subjectList:state.subjectList}),
  // 这里传入的是一个异步action.但是在展示组件中使用的函数,是通过connect进行封装之后的,虽然函数名一样,但是并不是同一个函数
  { getSubjectList, getSecSubjectList, updataSubject }
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
    // this.getSubjectList(1,10)
    // 传递过来的请求方法
    this.props.getSubjectList(1,10)

  }

  // getSubjectList = async (page,pageSize) => {
  //   const res = await  reqGetSubjectList(page, pageSize)
  //   console.log(res)
  //   this.setState({
  //     subject: res
  //   })
  //   console.log(this.state.subject);
  // }
  
  // 点击页码获取对应页面
  handlePageChange = (page,pageSize) => {
    // this.getSubjcetList(page,pageSize)
    // 得到通过容器组件包装过的方法发送请求
    this.props.getSubjectList(page,pageSize)
    // 动态获取currentPage，使当前页与高亮显示的页数一致
    this.currentPage = page    
  }
  // 切换每页展示几条数据的事件处理回调
  handleSizeChange = (current,size) => {
    // this.getSubjcetList(current,size)
    // 得到通过容器组件包装过的方法发送请求
    this.props.getSubjectList(current,size)
    // 动态获取currentPage，使当前页与高亮显示的页数一致
    this.currentPage = current
    this.pageSize = size
  }
  // 点击跳转到添加课程分类
  handleGoAddSubject = () => {
    this.props.history.push('/edu/subject/add')
  }
  // 点击展开按钮的事件处理回调
  handleClickExpand = (expanded, record) => {
    // 判断是否展开了二级菜单
    if( expanded ) {
      // 若展开了，就发送请求获取二级菜单数据  getSecSubjectList是redux中的异步action方法
      this.props.getSecSubjectList(record._id)  
    }
  }
    // 点击更新按钮的事件处理函数
  handleUpdateClick = (value) => {
    return () => {
      this.setState({
        subjectId:value._id,
        subjectTitle:value.title
      })
      // 存储原来的老数据
      this.OldSubjectTitle = value.title
    }
  }
  // 修改数据时,受控组件input的change回调函数
  handleTitleChange = (e) => {
    this.setState({
      subjectTitle:e.target.value.trim()
    })
  }
  // 取消按钮的事件处理回调
  handleCancle = () => {
      this.setState({
        subjectId:'',
        subjectTitle:''
      })
  }
  // 更新确认按钮的事件处理函数
  handleUpdate =async () =>{
    // 将state中的状态数据解构出来
    let {subjectId ,subjectTitle } = this.state
    // 如果用户输入的字符串为空，则提升不能输入
    if(subjectTitle.length === 0) {
      message.error('课程名称不能为空')
      return
    }
    // 如果原数据与新数据相同，则不用发送请求
    // 思路：点击按钮时，获取输入框内原来的内容，再与输入的内容进行比较
    if(this.OldSubjectTitle === subjectTitle){
      message.error('修改的课程名称不能与之前相同')
      return
    }
    // 调用修改数据的方法
    await this.props.updataSubject(subjectTitle,subjectId)
    message.success('修改成功！')  
    // 手动调用取消的事件处理回调，显示内容
    this.handleCancle()

  }

  // 删除按键的事件处理回调
  handleDel= value => () => {
    confirm({
      title:(
        <>
          <div>
              确定要删除
              <span style={{color:'red',fontSize:15}}>{value.title}</span>吗？
          </div>
        </>
      ),
      icon: <ExclamationCircleOutlined />,
      onOk: async () =>{
        // 调用删除的action 进行删除
        await reqDelSubject(value._id)
        message.success('删除成功！')
        /* 删除成功后需要重新获取数据
           如果删除的是最后一页，最后一页只有一条数据并且当前页不为第一页时，那么请求的页面应该是上一页的数据
           1.首先判断当前页是否是第一页 this.currentPage !== 1
           2.判断当前是否是最后一页 
              subjectList.total 为当前的数据总条数
              currentPage 为当前页的页码数
              pageSize 为每页显示多少条数据
              可以通过计算得到一共有多少页
           3.在判断当前页的数据是否只有一条 
              由于没有修改当前页请求的redux，如果redux中的items.length为1 时，说明当前页只有一条数据
        */

        // 计算总页数   总页数 = 向上取整（总条数 / 每页显示条数）
        const totalPage = Math.ceil(
          this.props.subjectList.total / this.pageSize
        )
        console.log(this.props.subjectList.total);
        console.log(this.pageSize);
        if (
          this.currentPage !== 1 &&
          this.props.subjectList.items.length === 1 &&
          totalPage === this.currentPage
          ) {
            //若符合条件，则为最后一一页只有一个数据，应该请求上一页数
            this.props.getSubjectList(--this.currentPage, this.pageSize)
            return
          }
          // console.log(this.currentPage);
          // console.log(this.props.subjectList.items.length);

          this.props.getSubjectList(this.currentPage, this.pageSize)
      }
    })
  }

  render() {
    // 表格列数据  必须写在render中，因为state变化会调用render
    const columns = [
      // title 表头这一列展示文本
      // dataIndex 表示这一列要展示data中哪个部分的数据
      // key: 列的key属性
      { title: '分类名称', 
      // dataIndex: 'title',
       key: 'title',
      render:(value) => {
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
                <Button type='primary' className='update-btn' onClick={this.handleUpdate}>
                  确认
                </Button>
                <Button type='danger' onClick={this.handleCancle}>取消</Button>
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
              <Button type='danger' onClick={this.handleDel(value)}>
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
        dataSource={this.props.subjectList.items}
        // 告诉table组件 使用_id 作为key
        rowKey='_id'
        pagination = {{
          // total 总条数
          total:this.props.subjectList.total,
          // 是否显示快速跳转
          showQuickJumper:true,
          showTotal: () =>`共${this.props.subjectList.total}条`,
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
