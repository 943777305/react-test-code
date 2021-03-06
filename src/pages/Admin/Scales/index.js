import React, { Component } from 'react'

import { Card, Button, DatePicker } from 'antd'

import moment from 'moment'

// 导入日期范围选择器
const { RangePicker } = DatePicker

const tabListNoTitle = [
  {
    key: 'scales',
    tab: '销售量'
  },
  {
    key: 'visits',
    tab: '访问量'
  }
]

// 表示每一个页签对应正文要展示的内容
const contentListNoTitle = {
  scales: <p>销售量...</p>,
  visits: <p>访问量....</p>
}

export default class Scales extends Component {
  // 设置状态数据
  state = {
    // 初始化选中的页签
    activeKey: 'scales',
    // 初始化高亮按钮
    activeBtn: 'day', // day 今日, week 本周, month 本月, year 本年

    // rangeDate 用于控制时间范围组件的值，需要引入包
    rangeDate: [moment(), moment()]
  }

  // 切换时间的事件处理回调
  handleBtnClick = activeBtn => () => {  // 传入点击的时的按钮状态
    // 通过传入的按钮状态判断显示哪个区间的日期 ，计算范围时间
    let rangeDate
    switch (activeBtn) {
      case 'day':
        rangeDate = [moment(), moment()]
        break
      case 'week':
        rangeDate = [moment(), moment().add(1, 'w')]  // w表示周
        break
      case 'month':
        rangeDate = [moment(), moment().add(1, 'M')]  // M表示月
        break
      case 'year':
        rangeDate = [moment(), moment().add(1, 'y')]  // y表示年
        break
    }

    this.setState({
        // 修改高亮显示的按钮和显示的时间
      activeBtn,
      rangeDate
    })
  }

  // 在rangePicker组件中选择了新的日期范围后触发的事件处理函数
  handleRangeChange = (dates, dateString) => {
    // dates拿到的就是 rangepicker中选择的日期范围
    // console.log(dates, dateString)

    this.setState({
      rangeDate: dates
    })
  }

  render() {
    // 将状态数据解构出来
    let { activeBtn, rangeDate } = this.state

    const extra = (
      <>
        <Button
          type={activeBtn === 'day' ? 'link' : 'text'}
          onClick={this.handleBtnClick('day')}
        >
          今日
        </Button>
        <Button
          type={activeBtn === 'week' ? 'link' : 'text'}
          onClick={this.handleBtnClick('week')}
        >
          本周
        </Button>
        <Button
          type={activeBtn === 'month' ? 'link' : 'text'}
          onClick={this.handleBtnClick('month')}
        >
          本月
        </Button>
        <Button
          type={activeBtn === 'year' ? 'link' : 'text'}
          onClick={this.handleBtnClick('year')}
        >
          本年
        </Button>
        {/* 想要控制RangePicker里面展示什么范围,实际就是操作这个组件value的值 */}
        {/* value的值的规则: 
        
            value值应该是一个数组: []
            第一个参数: 范围的开始时间
            第二个参数: 范围的结束时间
            // 一般使用moment来定义事件
            今日 [moment(), moment()]
        */}
        <RangePicker value={rangeDate} onChange= {this.handleRangeChange} />
      </>
    )

    return (
      <div>
        <Card
          style={{ width: '100%' }}
          // 表示标签页展示的标题
          tabList={tabListNoTitle}
          // 表示当前选中了哪一个标签页
          activeTabKey={this.state.activeKey}
          tabBarExtraContent={extra}
          // 点击标签页的时候,会触发
          onTabChange={key => {
            console.log(key)
            // this.onTabChange(key, 'noTitleKey')
            this.setState({
              activeKey: key
            })
          }}
        >
          {contentListNoTitle[this.state.activeKey]}
        </Card>
      </div>
    )
  }
}