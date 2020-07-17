import React, { Component } from "react";
import { Button, message, Tooltip, Modal, Alert, Table } from "antd";
import {
  FullscreenOutlined,
  RedoOutlined,
  SettingOutlined,
  InfoCircleOutlined,
  PlusOutlined,
  FormOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

import relativeTime from "dayjs/plugin/relativeTime";

// 导入知乎提供的视频播放组件
import Player from 'griffith'

import { connect } from "react-redux";
import SearchForm from "./SearchForm";
// 导入全屏的包
import screenfull from 'screenfull'


// 引入获取章节信息列表的请求
import { 
  getLessonList,
  chapterList,
  batchDelChapter,
  batchDelLesson
 } from './redux'

import "./index.less";

dayjs.extend(relativeTime);

@connect(
  state => ({
    // courseList: state.courseList
    // permissionValueList: filterPermissions(
    //   state.course.permissionValueList,
    //   "Course"
    // )
    chapterList: state.chapterList
  }),
    { getLessonList,batchDelChapter, batchDelLesson }
  // { getcourseList }
  )
class Chapter extends Component {
  state = {
    searchLoading: false,
    previewVisible: false,  // 控制model窗口是否显示
    previewImage: "",
    selectedRowKeys: [],
    video: ''
  };

  // video就是要预览的视频的路径
  showModal = video => () => {
    this.setState({
      previewVisible: true,
      video
    })
  }

  handleImgModal = () => {
    this.setState({
      previewVisible: false,
    });
  };

  componentDidMount() {
    // const { page, limit } = this.state;
    // this.handleTableChange(page, limit);
  }

  handleTableChange = (page, limit) => {
    this.setState({
      tableLoading: true,
    });

    this.getcourseList({ page, limit }).finally(() => {
      this.setState({
        tableLoading: false,
        page,
        limit,
      });
    });
  };

  getcourseList = ({ page, limit, Coursename, nickName }) => {
    return this.props
      .getcourseList({ page, limit, Coursename, nickName })
      .then((total) => {
        if (total === 0) {
          message.warning("暂无用户列表数据");
          return;
        }
        message.success("获取用户列表数据成功");
      });
  };

  onSelectChange = (selectedRowKeys) => { // selectedRowKeys 表示选择项的id
    this.setState({
      selectedRowKeys,
    });
  };


  // 点击展开按钮的事件处理函数
  handleClickExpand = (expand, record) => {
    console.log(expand, record)
    // expand为是否展开，值为ture或false    record为记录，存储着点击时这一行的所有数据
    if (expand) {
      // 发送请求获取数据
      this.props.getLessonList(record._id)
    }
  }

 
  // 点击新增章节信息时进行页面跳转并且传递数据
  handleGoAddLesson = data => () => {
    this.props.history.push('/edu/chapter/addlesson',data)
  }

   // 批量删除按钮的事件处理函数
   handleBatchDel = () => {
    Modal.confirm({ // confirm 弹窗提升
      title : '你确定要删除选中项吗？',
      onOk: async () => { //确定删除的事件处理回调  
        // 在批量删除之前需要先将课时id和章节id区别开，先定义两个变量来保存课时id和章节id
        let chapterIds = [] //存储选中章节id
        let lessonIds = [] // 存储选中课时id

        // 先拿到所有选中的id
        let selectedRowKeys = this.state.selectedRowKeys
        // 从所有id中拿出章节id 其他的就是课时id，所有的章节id都存储在redux里面
        let chapterList = this.props.chapterList.items
        // 遍历查找章节id，拿到每一个章节id. 去selectedRowKeys里面查找是否存在
        chapterList.forEach(chapter => {
          // 找到每一条章节的id
          let chapterId = chapter._id
          // 拿这条章节id,去selectedRowKeys里面找,看看是否存储,如果存在就取出来
          // 如果selectedRowKeys里面有chapterId,就返回这个id对应的下标,否则返回-1
          let index = selectedRowKeys.indexOf(chapterId)
          if (index > -1) {
            //证明找到了,就从selectedRowKeys把这条数据切出来
            // selectedRowKeys.splice(开始的下标, 切几条)
            // splice会修改原来的数据,并且返回切割的新的数组
            let newArr = selectedRowKeys.splice(index, 1)
            // chapterIds = [...selectedRowKeys.splice(index, 1), ...chapterIds]
            chapterIds.push(newArr[0])
          }
        })
        lessonIds = [...selectedRowKeys]
        // 需要定义异步接口, 定义redux里面的代码
        //调用异步action,删除章节
        await this.props.batchDelChapter(chapterIds)
        await this.props.batchDelLesson(lessonIds)
        message.success('批量删除成功')
      } 
    })
  }

  // 让整个页面全屏
  handlescreenFull = () => {
    // screenfull.request()
    screenfull.toggle()
  } 


  render() {
    const { previewVisible, previewImage, selectedRowKeys } = this.state

    const columns = [
      {
        title: "章节名称",
        dataIndex: "title",
      },
      {
        title: "是否免费",
        dataIndex: "free",
        render: (isFree) => {

          return isFree === true ? "是" : isFree === false ? "否" : "";
         },
      },
      {
        title: '视频',
        // dataIndex: 'free',
        // 注意: 如果没有写dataIndex,render函数接收到的就是这一行数据(应该是一个对象)
        // 如果dataIndex写了值,那么render函数接收到的就是这一行数据中对应的dataIndex中那个属性的值
        render: value => {
          // 如果是章节数据,不展示任何内容
          // 如果是课时数据,判断是否是免费,如果是免费就展示预览按钮
          // 章节数据没有free属性, 什么都不展示
          // 如果课时的free是false, 也返回undefined. 符合项目业务逻辑
          if (!value.free) return
          return <Button onClick={this.showModal(value.video)}>预览</Button>
        }
      },
      {
        title: "操作",
        width: 300,
        fixed: "right",
        render: (data) => {  
          // if ("free" in data) {
            return (
              <div>
                {data.free === undefined && (
                  <Tooltip title="新增课时" >
                    <Button type='primary' 
                    style={{ marginRight: 10 }}
                    onClick={this.handleGoAddLesson(data)}>
                      <PlusOutlined />
                    </Button>
                  </Tooltip>
                )}
                  
                
                
                <Tooltip title={data.free === undefined ? '更新章节' : '更新课时'}>
                  <Button type="primary" style={{ margin: "0 10px" }}>
                    <FormOutlined />
                  </Button>
                </Tooltip>
                <Tooltip title={data.free === undefined ? '删除章节' : '删除课时'}>
                  <Button type="danger">
                    <DeleteOutlined />
                  </Button>
                </Tooltip>
              </div>
            );
          // }
        },
      },
    ];

    
    const sources = {
      hd: {
        play_url: this.state.video, //真正需要的属性 , 预览视频的路径
        // 下面这些属性,其实不写也可以,但是会提示这个必须属性,所以为了不展示错误提示,加了这些属性,值随便写就可以
        bitrate: 1,
        duration: 1000,
        format: '',
        height: 500,
        size: 160000,
        width: 500
      }
      // sd: {
      //   // play_url:
      // }
    }
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      // hideDefaultSelections: true,
      // selections: [
      //   Table.SELECTION_ALL,
      //   Table.SELECTION_INVERT,
      //   {
      //     key: "odd",
      //     text: "Select Odd Row",
      //     onSelect: changableRowKeys => {
      //       let newSelectedRowKeys = [];
      //       newSelectedRowKeys = changableRowKeys.filter((key, index) => {
      //         if (index % 2 !== 0) {
      //           return false;
      //         }
      //         return true;
      //       });
      //       this.setState({ selectedRowKeys: newSelectedRowKeys });
      //     }
      //   },
      //   {
      //     key: "even",
      //     text: "Select Even Row",
      //     onSelect: changableRowKeys => {
      //       let newSelectedRowKeys = [];
      //       newSelectedRowKeys = changableRowKeys.filter((key, index) => {
      //         if (index % 2 !== 0) {
      //           return true;
      //         }
      //         return false;
      //       });
      //       this.setState({ selectedRowKeys: newSelectedRowKeys });
      //     }
      //   }
      // ]
    };

    return (
      <div>
        <div className="course-search">
          <SearchForm />
        </div>
        <div className="course-table">
          <div className="course-table-header">
            <h3>课程章节列表</h3>
            <div>
              <Button type="primary" style={{ marginRight: 10 }}>
                <PlusOutlined />
                <span>新增</span>
              </Button>
              <Button type="danger" 
                style={{ marginRight: 10 }} 
                onClick={this.handleBatchDel}
              >
                <span>批量删除</span>
              </Button>
              <Tooltip title="全屏"
                className="course-table-btn" 
                onClick={this.handlescreenFull}
              >
                <FullscreenOutlined />
              </Tooltip>
              <Tooltip title="刷新" className="course-table-btn">
                <RedoOutlined />
              </Tooltip>
              <Tooltip title="设置" className="course-table-btn">
                <SettingOutlined />
              </Tooltip>
            </div>
          </div>
          <Alert
            message={
              <span>
                <InfoCircleOutlined
                  style={{ marginRight: 10, color: "#1890ff" }}
                />
                {`已选择 ${selectedRowKeys.length} 项`}
              </span>
            }
            type="info"
            style={{ marginBottom: 20 }}
          />
          <Table
            rowSelection={rowSelection}
            columns={columns}
            dataSource={this.props.chapterList.items}
            rowKey="_id"
            // 扩展的+号按钮
            expandable = {{
              onExpand:this.handleClickExpand
            }}
          />
        </div>

        <Modal
          title='视频'
          visible={previewVisible}   // 控制model窗口是否显示
          // 点击modal的关闭按钮,触发这个函数
          onCancel={this.handleImgModal}
          footer={null}
          destroyOnClose={true} //关闭modal销毁modal子元素
        >
          <Player
            sources={sources} // 必须有,定义预览视频的路径, 多个视频源
            id={'1'}
            cover={'http://localhost:3000/logo512.png'} //视频封面图片
            duration={1000}
          ></Player>
        </Modal>
      </div>
    );
  }
}

export default Chapter;
