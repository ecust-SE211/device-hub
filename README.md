# device-hub

> FE for DeviceHub

## 说明

设备管理系统(DeviceHub)的前端模块

### 架构

| Name   | Version  | Description |
| ------ | -------- | ----------- |
| next   | 14.2.7   | 页面框架    |
| react  | ^18      | 界面库      |
| antd   | ^5       | UI 组件库   |
| lodash | ^4.17.21 | 工具库      |

## 运行

### 使用 npm

```bash
npm install
npm run dev
```

### 页面说明

| Name           | Route          | Description                                           |
| -------------- | -------------- | ----------------------------------------------------- |
| 首页(MainPage) | /              | 根页面，用户可以选择登录方式                          |
| 管理员登录页面 | /login/manager | 完成登录跳转到 space                                  |
| 领导登录页面   | /login/leader  | 完成登录跳转到 space                                  |
| 管理页面首页   | /space         | 显示用户的信息; 本页面及子页面有统一的侧边栏和 Layout |
