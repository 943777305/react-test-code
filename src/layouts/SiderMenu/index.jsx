import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Menu } from 'antd'
import {
  DesktopOutlined,
  PieChartOutlined,
  FileOutlined,
  TeamOutlined,
  UserOutlined
} from '@ant-design/icons'
import Icons from '@conf/icons'
import { Link, withRouter } from 'react-router-dom'
import { defaultRoutes } from '@conf/routes'
const { SubMenu } = Menu

// 获取redux中的 数据和方法
@withRouter
@connect(state => ({ permissionList: state.user.permissionList }))

 class SiderMenu extends Component {

  // 定义函数在函数中遍历数据进行动态渲染
  renderMenu = menus => {  // 将需要变量的数组传递进来
    return menus.map(menu => {  // 遍历得到的新数组返回出去
      // 遍历完成后判断菜单是否需要渲染，通过hidden的属性值进行判断
      if(menu.hidden) return
      // 通过icon字符串找到对应的icon组件
      const Icon = Icons[menu.icon]
      if(menu.children && menu.children.length) {
        // 若遍历的菜单有二级菜单则对二级菜单进行渲染
        return(
          <SubMenu key={menu.path} icon={<Icon/>} title={menu.name}>
            {menu.children.map(secMenu =>{  // 遍历二级菜单
              if(secMenu.hidden) return  //若hidden为ture则不渲染
              return <Menu.Item key={menu.path + secMenu.path}>
                        {/* 动态改变地址栏路径 */}
                        <Link to={menu.path + secMenu.path} >{secMenu.name}</Link>
                      </Menu.Item>
            })}
          </SubMenu>
        )
      }else{
        // 只有一级菜单
        return(  // 这里return是给新数组添加一个菜单组件
          <Menu.Item key={menu.path} icon={<PieChartOutlined/>}>
            {/* 点击的一级菜单的路由路径是‘/’ 则不修改地址栏路径 */}
            {menu.path === '/' ? <Link to='/'>{menu.name}</Link> : menu.names}
          </Menu.Item>

        )
      }
    })
  }




  render() {
    const path = this.props.location.pathname
    console.log(this.props);
    // 
    const reg = /[/][a-z]*/   // 提取一级菜单路径的正则
    const firstPath = path.match(reg)[0]
    return (
      <>
        <Menu 
          theme='dark' 
          // 默认高亮的菜单项
          defaultSelectedKeys={[path]}
          mode='inline'
          // 默然展开的一级菜单
          defaultOpenKeys={[firstPath]}
        >
          {/* 调用函数遍历数据 */}
          {this.renderMenu(defaultRoutes)}
          {this.renderMenu(this.props.permissionList)}
        </Menu>
      </>
    )
  }
}

export default SiderMenu