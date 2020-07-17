import React, { Component } from 'react'
import { Upload, Button, message } from 'antd'
import { UploadOutlined } from '@ant-design/icons'


// 引入请求获取Token的接口
import { reqGetQiniuToken } from '@api/edu/lesson'


import * as qiniu from 'qiniu-js'
import { nanoid } from 'nanoid'


// 定义一个限制上传视频大小的常量
const MAX_VIDEO_SIZE = 20 * 1024 * 1024

export default class MyUpload extends Component {
    // 定义构造函数，构造函数只从缓存中获取数据
    constructor () {
        super()

        // 进来首先从缓存中获取有没有token
        const str = localStorage.getItem('upload_token')
        if(str){ // 若之前存储过，就将之前的token修改为当前的
            // 通过是有内容的字符串则说明之前存储过token，这里指将缓存中拿到的数据赋值给state，不判断token是否过期
            const res = JSON.parse(str)
            this.state = {
                expires: res.expires,
                uploadToken: res.uploadToken
            }
        } else { //若没存储过，就初始state
            this.state = {
                expires: 0,
                uploadToken: ''
            }
            
        }
    }

    // 上传视频前调用   
    handleBeforeUpload = (file,fileList) => {
        // file是我们要上传的文件
        return new Promise(async (resolve, reject) => {
            // 在上传视频前需要先判断视频大小，再获取请求的token
            if(file.size > MAX_VIDEO_SIZE) { // 判断视频大小
                message.error('上传视频过大，视频文件不能超过20M！')
                reject('上传视频过大，视频文件不能超过20M！')
                return
            }
            // 请求上传的token，请求之前判断token是否过期
            if (Date.now() > this.state.expires) {
                // 过期了则重新获取
                const { uploadToken, expires } = await reqGetQiniuToken() 
                // 将最新的数据存储起来
                this.saveUploadToken( uploadToken,expires)
            }
            resolve(file)
        })
        // 获取请求上传的token 
        // return false
    }
   
  

    // 存储 uploadToken和过期时间的方法
    saveUploadToken = (uploadToken , expires ) => {
        //  将传递过来的时间周期加上当前时间，得到token过期的时间
        const targetTime = Date.now() + expires * 1000 -2 * 60 * 1000
        expires = targetTime
        // 将对象转为字符串存储到localStorage中
        const upload_token = JSON.stringify({uploadToken, expires})
        localStorage.setItem('upload_token',upload_token)
        // 存储到state里面
        this.setState({
            uploadToken,
            expires
        })
    }


    // 真正上传视频时调用, 这个函数会覆盖默认的上传方式
    handleCustomRequest = (value) => {
        console.log('上传了')
        // console.log(this.state.uploadToken)
        // 要上传的文件
        const file = value.file
        // key为定义的新文件名
        const key = nanoid(10)
        // token 是七牛返回的token
        const token = this.state.uploadToken
        // putExtra 是配置上传项的 ， 可配置上传文件类型
        const putExtra = {
            mimeType: 'video/*' // 只允许上传视频文件
        }
        // config 配置项  可以控制上传到哪个区域
        const config = {
            region: qiniu.region.z2
        }
    
        const observable = qiniu.upload(file, key, token, putExtra, config)
        
        const observer = {
            next(res) {
              console.log(res)
              // 由于res.total是一个对象,并且又percent属性.所以可以展示进度条
              value.onProgress(res.total)
            },
            error(err) {
              // ...
              console.log(err)
              // 上传失败,调用onError, 会展示一个错误的样式
              value.onError(err)
            },
            complete: res => {
              // ...
              console.log(res)
              // 上传成功会调用. 展示一个上传成功的样式
              value.onSuccess(res)
              // 注意:解决视频上传成功,表单验证不通过的问题
              // 手动调用Form.Item传过来onChange方法,onChange方法中传入需要表单控制的数据
              // 未来要给本地服务器存储的实际上就是 上传视频成功的地址
              // 地址: 自己七牛云空间的域名 + 文件名
              this.props.onChange('http://qdcdb1qpp.bkt.clouddn.com/' + res.key)
      
              // console.log()
            }
        }
        this.subscription = observable.subscribe(observer) // 上传开始
    }
    // 如果组件卸载,上传取消
    componentWillUnmount() {
        // console.log(this)
        this.subscription && this.subscription.unsubscribe() // 上传取消
    }
   

    render() {
        return (
            <div>
                <Upload
                    beforeUpload={this.handleBeforeUpload}
                    customRequest={this.handleCustomRequest}
                >
                    <Button>
                        <UploadOutlined /> 上传视频
                    </Button>
                </Upload>
            </div>
        )
    }
}
