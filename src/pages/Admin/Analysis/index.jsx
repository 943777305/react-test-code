import React, { Component } from "react";

// 导入antd中栅格布局的组件  Row 表示一行  Col 表示一列
import { Row, Col, Statistic } from 'antd'

import { CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons'

// 导入项目中自己封装的Card组件
import Card from '@comps/Card'
const firstRowCol = {
  // xs, md, lg 表示不同的屏幕尺寸 具体见antd文档
  // span表示col在行中占的格数
  // 一行共24个格
  xs: { span: 24 },
  md: { span: 12 },
  lg: { span: 6 }
}

export default class Analysis extends Component {



  render() {
    return (
      <div>
        {/* guttet 表示栅格之间的间隔，第一个参数是水平间隔，第二个参数是垂直间隔，单位是px */}
        <Row gutter={[16, 16]}>
          <Col {...firstRowCol}>
            <Card  // 标题和底部写在 Card 的属性当中，中间内容写在子节点位置
              // Card标题
              title={
                <Statistic title='总销售额' value={112893} prefix={'￥'} />
              }
              footer={<span>日销售额 ￥12,423</span>}
            >
              {/* card的内容,写在子节点的位置 */}
              <span>
                周同比 12% <CaretUpOutlined style={{ color: 'red' }} />
              </span>
              <span style={{ marginLeft: 10 }}>
                日同比 10% <CaretDownOutlined style={{ color: 'pink' }} />
              </span>
            </Card>
          </Col>
          <Col {...firstRowCol}>
            <Card
              // Card标题
              title={
                <Statistic title='访问量' value={22222} prefix={''} />
              }
              footer={<span>日销售额 ￥12,423</span>}
            ></Card>
          </Col>
          <Col {...firstRowCol}>
            <Card
              title={
                <Statistic title='支付笔数' value={33333} prefix={''} />
              }
              footer={<span>转换率60%</span>}
            ></Card>
          </Col>
          <Col {...firstRowCol}>
            <Card
            title={
              <Statistic title='运营结果' value={44444} prefix={''} />
            }
            footer={<span>转化率80.9%</span>}
            >
              
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}
