import React, { Component, useState } from "react";
import { Form, Input, Button, Checkbox, Row, Col, Tabs } from "antd";
import {
  UserOutlined,
  LockOutlined,
  MobileOutlined,
  MailOutlined,
  GithubOutlined,
  WechatOutlined,
  QqOutlined,
} from "@ant-design/icons";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { login, mobileLogin } from "@redux/actions/login";
import { reqGetverifyCode } from '@api/acl/oauth'

import "./index.less";

const { TabPane } = Tabs;

// 函数组件中需要用到 props 时，可以通过传递参数获取
function LoginForm (props) {
 const [form] = Form.useForm()
 
 // 定义是否能点击获取验证码按钮的状态数据
 const [isShowDownCount, setIsShowDownCount] = useState(false)  // 默认值false为可以点击
 // 定义验证码过期时间的倒计时数据
 let [downCount, setDownCount] = useState(5)
 // 定义修改选中页签的状态数据
 const [ activeKey,setActiveKey] = useState('user')


  const onFinish = () => {
    // 判断当前点击的登录按钮是用户名密码登录还是手机号登录
    if( activeKey === 'user'){
      form.validateFields(['username','password']).then(res =>{
        let { username,password } = res 
        props.login(username, password).then((token) => {
            // 登录成功
            // console.log("登陆成功~");
            // 持久存储token
            localStorage.setItem("user_token", token);
            // 重定向到首页
            props.history.replace("/");
          });
      })
    }else{
      // 校验手机号和验证码
      // 校验用户名和密码
      form.validateFields(['phone', 'verify']).then(res => {
        let { phone, verify } = res
        props.mobileLogin(phone, verify).then(token => {
          // 登录成功
          // console.log("登陆成功~");
          // 持久存储token
          localStorage.setItem('user_token', token)
          props.history.replace('/')
        })
      })
    }
    // props.login(username, password).then((token) => {
    //   // 登录成功
    //   // console.log("登陆成功~");
    //   // 持久存储token
    //   localStorage.setItem("user_token", token);
    //   // 重定向到首页
    //   props.history.replace("/");
    // });
    // .catch(error => {
    //   notification.error({
    //     message: "登录失败",
    //     description: error
    //   });
    // });
  };

  //添加表单验证的函数  函数返回值是一个promise对象
  const validator = (rules, value) => {
    // rules 表示校验的是哪个表单项   value 表示表单项的值
    // 返回值为一个 promise 对象，
    return new Promise((resolve, reject) => {
      /* 用密码框的校验规则
          1.必填项
          2.长度大于4
          3.长度小于16
          4.只能是字母数组下划线
          表单验证触发时机：输入内容时会触发，点击提交按钮时也会触发
      */
     if(!value) {
       return reject('必须添加密码')
     }

     if( value.length <4) {
       return reject('密码长度不能小于4个字符')
     }

     if(value.length > 16) {
       return reject('密码长度不能大于16个字符')
     }

     if(!/^[0-9a-zA-Z_]+$/.test(value)) {
       return reject('密码只能输入数组、字母、下划线组成')
     }
     resolve()
    })

  }

  const getVerifyCode = async() => {
    // 1. 手动触发表单的表单的校验,只有校验通过了,才去执行后续代码
    const res = await form.validateFields(['phone'])
    console.log('成功',res);
     // 2. 给开发者服务器发送请求
    // 注意:为了节省开支,获取验证码的代码,测试一次之后,最好注释掉,手机登录所有逻辑完成再打开

    // await reqGetverifyCode(res.phone)

    //后面的代码可以执行,说明验证码请求成功了
    // 3. 当请求发出去之后,按钮应该展示倒计时,并且倒计时的过程中,按钮不能点击
    // 点击获取验证码之后,让按钮禁用,然后展示倒计时
    setIsShowDownCount(true)
    // 定义一个定时器,修改倒计时的时间
    let timeId = setInterval(() => {
      // console.log(downCount)
      // 修改倒计时的时间
      downCount--
      setDownCount(downCount)
      if (downCount <= 0) {
        // 清除定时器
        clearInterval(timeId)
        // 取消按钮禁用
        setIsShowDownCount(false)
        // 重置倒计时时间
        setDownCount(5)
      }
    }, 1000)
  }

  const handleTabChange = (activeKey) =>{ 
    setActiveKey(activeKey)
  }

  // git第三方授权登录点击事件
  const gitOauthLogin = () => {
    window.location.href =
      'https://github.com/login/oauth/authorize?client_id=fbeb41ce3f9acc6198a1'
  }

    return (
      <>
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          // 将form实例和Form组件关联起来
          form={form}
        >
          <Tabs
            defaultActiveKey="user"
            tabBarStyle={{ display: "flex", justifyContent: "center" }}
            // 切换页签的时触发的事件处理回调函数 ， 返回当前选中页签的key
            onChange = {handleTabChange}
          >
            <TabPane tab="账户密码登陆" key="user">
              <Form.Item 
                name="username"
                rules = {[
                  {required:true,
                  message: '必须输入用户名'
                  },
                  {
                    min: 4,
                    message: '用户名至少四个字符'
                  },
                  {
                    max: 16,
                    message: '用户名不能超过十六个字符'
                  },
                  {
                    pattern: /^[0-9a-zA-Z_]+$/,
                    message: '只能输入数字字母下划线'
                  }
                ]}
              >
                <Input
                  prefix={<UserOutlined className="form-icon" />}
                  placeholder="用户名: admin"
                />
              </Form.Item>
              <Form.Item 
                name="password"
                // antd 表单校验第二种方式
                rules={[{ validator }]}
              >
                <Input
                  prefix={<LockOutlined className="form-icon" />}
                  type="password"
                  placeholder="密码: 111111"
                />
              </Form.Item>
            </TabPane>
            <TabPane tab="手机号登陆" key="phone">
              <Form.Item
                name="phone"
                rules={[
                  {
                    required: true,
                    message: '请输入手机号'
                  },
                  {
                    pattern: /^1[3456789]\d{9}$/,
                    message: '你输入不是手机号'
                  }
                ]}
              >
                <Input
                  prefix={<MobileOutlined className="form-icon" />}
                  placeholder="手机号"
                />
              </Form.Item>

              <Row justify="space-between">
                <Col span={16}>
                  <Form.Item name="verify"
                   rules={[
                    {
                      required: true,
                      message: '请输入验证码'
                    },
                    {
                      pattern: /^[\d]{6}$/,
                      message: '请输入验证码'
                    }
                  ]}
                >
                    <Input
                      prefix={<MailOutlined className="form-icon" />}
                      placeholder="验证码"
                    />
                  </Form.Item>
                </Col>
                <Col span={7}>
                  <Button className="verify-btn" onClick={getVerifyCode} disabled={isShowDownCount}>
                  {isShowDownCount ? `${downCount}秒后获取` : '获取验证码'}
                  </Button>
                </Col>
              </Row>
            </TabPane>
          </Tabs>
          <Row justify="space-between">
            <Col span={7}>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>自动登陆</Checkbox>
              </Form.Item>
            </Col>
            <Col span={5}>
              <Button type="link">忘记密码</Button>
            </Col>
          </Row>
          <Form.Item>
            <Button
              type="primary"
              // htmlType="submit"
              className="login-form-button"
              onClick= {onFinish}
            >
              登陆
            </Button>
          </Form.Item>
          <Form.Item>
            <Row justify="space-between">
              <Col span={16}>
                <span>
                  其他登陆方式
                  <GithubOutlined 
                    className="login-icon"
                    onClick= {gitOauthLogin}
                  />
                  <WechatOutlined className="login-icon" />
                  <QqOutlined className="login-icon" />
                </span>
              </Col>
              <Col span={3}>
                <Button type="link">注册</Button>
              </Col>
            </Row>
          </Form.Item>
        </Form>
      </>
    );
  
}

export default withRouter(
  connect(
    null,
    { login,mobileLogin }
  )(LoginForm)
)
