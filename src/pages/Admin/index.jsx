import React, { Component } from "react";

import Analysis from "./Analysis";
import Scales from "./Scales";
// 引入饼状图组件
import Search from './Search'
//引入折线图
import Static from './Static'

export default class Admin extends Component {
  render() {
    return (
      <div>
        <Analysis />
        <Scales />
        <Search/>
        <Static/>
      </div>
    );
  }
}
