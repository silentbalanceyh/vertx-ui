# AI0005 - 自动Render组件配置

本文主要讲解`field`配置中的render属性可配置的内容，可配置的内容不能是`二阶`，所有的`二阶`都是自定义的时候需要使用的专用列表，一般是书写一些事件，如`onChange`等。

## 1.支持表

| render | 二阶（自定义事件时用） | 组件类型 | 含义 |
| :--- | :--- | :--- | :--- |
| aiInput |  | Ant Design | 文本输入框 |
| aiInputNumber | ai2InputNumber | Ant Design | 数字输入框 |
| aiSelect | ai2Select | Ant Design | 下拉框 |
| aiCheckbox | ai2Checkbox | Ant Design | 多选按钮 |
| aiRadio | ai2Radio | Ant Design | 单选按钮组 |
| aiTextArea |  | Ant Design | 大文本输入框 |
| aiTreeSelect | ai2TreeSelect | Ant Design | 树形选择菜单 |
| aiDatePicker | ai2DatePicker | Ant Design | 日历控件 |
| aiFileUpload |  | 自定义 | 上传组件 |
| aiTimePicker |  | Ant Design | 时间选择框 |
| aiTimeRanger |  | 自定义 | 从HH:mm到HH:mm的时间范围选择 |
|  | ai2ListSelector | 自定义 | 弹出可搜索的列表（带分页、排序、查询） |
| aiAction |  | 自定义 | 提交按钮设置 |



