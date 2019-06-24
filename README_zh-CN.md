# Fetch2
[![Build Status](https://travis-ci.org/misaka-ink/fetch2.svg?branch=master)](https://travis-ci.org/misaka-ink/fetch2)
[![npm version](https://badge.fury.io/js/%40misaka.ink%2Ffetch2.svg)](https://badge.fury.io/js/%40misaka.ink%2Ffetch2)
[![Coverage Status](https://coveralls.io/repos/github/misaka-ink/fetch2/badge.svg)](https://coveralls.io/github/misaka-ink/fetch2)

Fetch-based front-end middleware development model

[English](./README.md) | 简体中文

## 理念

基于中间件模式处理请求，隔离数据处理与业务、视图的相关代码，注重数据的数据处理细节与代码复用性，为数据请求提供更大的想象空间.

## 特性

- 基于单例模式初始化并配置请求库，发起Fetch请求
- 支持取消、重试、超时、默认参数、前缀
- 支持中间件，借用了`koa-compose`的`compose`代码

## 安装

```bash
npm install --save @misaka.ink/fetch2
```

## 例子

##### 初始化

```javascript
import fetch2, {method} from '@misaka.ink/fetch2'

const f2 = fetch2.getInstance()

// 默认参数

const defaultOptions = {
    // 默认请求方法
    // *GET、POST、PATCH、PUT、DELETE 
    method: method.GET,
    
    // 浏览器发送包含凭据的请求  
    // include, *same-origin, omit
    credentials: 'same-origin',
    
    // manual, *follow*, error
    redirect: 'follow',
    
    // 请求的模式
    // same-origin, no-cors, cors, navigate
    mode: 'cors',
    
    // 请求的来源
    // *client, no-referrer, URL
    referrer: 'no-referrer',
    
    // 缓存
    // *default, no-cache, reload, force-cache, only-if-cached
    cache: 'no-cache',
    
    // 超时，不需要超时可设置为0
    timeout: 3000,
    
    // 重试次数，0不重试
    count: 0,
    
    // 默认参数，如果为函数会在请求前被执行
    params: undefined,
    
    // Path前缀
    prefix: undefined,
    
    // 中止请求
    controller: new AbortController(),
    
    // BODY
    body: null
    
}

```

##### 发起一个GET请求

```javascript
import fetch2, {method} from '@misaka.ink/fetch2'
const f2 = fetch2.getInstance()

f2.request('/get', {p1: 10, p2: [1, 2, 3]})
// -> /get?p1=10&p2="%5B1%2C2%2C3%5D"
.then(result => {})
.catch(err => {})
```

##### 发起一个POST请求

```javascript
import fetch2, {method} from '@misaka.ink/fetch2'
const f2 = fetch2.getInstance()

// async func

async function post () {
    const result = await f2.post('/post', {}, {
        method: method.POST,
        body: {
            p1: 10, 
            p2: [1, 2, 3]
        }
    })
}
```

##### 取消请求

```javascript
async function controllerFunc() {
    const controller = new AbortController()
    const result = await f2.request('http://localhost:3000/timeout', null, {
        controller
    })
    // 触发中止
    controller.abort()
}
```

##### 使用中间件

```javascript
import fetch2, {method} from '@misaka.ink/fetch2'
import middleware from 'middleware'
const f2 = fetch2.getInstance()

f2.use(middleware)
```
