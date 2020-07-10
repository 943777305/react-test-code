
// 引入 express 
const express = require('express')
 
// 引入 mock
const Mock = require('mockjs')

// 从 mock 上拿到 Random
const Random = Mock.Random

// 返回一个中文标题的方法
Random.ctitle ()



// 调用 express 创建一个服务器对象
const app = express()

// 解决跨越
app.use((req, res, next) => {
    //设置响应头
    res.set('Access-Control-Allow-Origin', '*')
    res.set('Access-Control-Allow-Headers', 'content-type,token')
    res.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE')
    //调用下一个中间件
    next()
  })

// 创建服务路由
app.get('/admin/edu/subject/:page/:limit',(req,res) => {
    // req 是请求对象
    let {page,limit} = req.params

    // 利用 mock 创建随机的虚拟 data 数据
    const data = Mock.mock({
        total:Random.integer(+limit, limit*2),
        [`items|${limit}`]:[
            {
                '_id|+1': 1,
                // 返回2-5个中文
                title: '@ctitle(2,5)',
                parentId: 0
            }
        ]
    })

    //res 是响应数据
    // 后台返回给浏览器的应该是json格式的字符串
    // 下面代码的作用: 把对象转成json格式的字符串,返回给浏览器
    res.json({
        code: 20000,
        success: true,
        data,
        message: ''
    })
})

// 监听并启动服务
app.listen (8888,(err)=>{
    if(err) {
       return console.log('服务启动失败')
    }
     console.log('服务启动成功');
    
})