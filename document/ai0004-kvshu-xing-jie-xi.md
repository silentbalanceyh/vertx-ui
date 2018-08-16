# AI0004 - $KV$属性解析

`$KV$`属性解析器为属性解析器的辅助工具，用于解析：值为**非Object和非Array**的属性，如果是Object或Array两种属性的情况则不能使用纯属性模式配置。如下：

```json
"contactMobile,手机,6,70%,aiInput,readOnly=true"
```

根据字段配置[AI0003 - aiExprField属性解析器](/document/ai0003-aiexprfieldshu-xing-jie-xi-qi.md)说明，`5+`为`$KV$`信息，也就是后续所有的键值对都可以通过`$KV$`进行属性注入，如上边的`readOnly=true`则会被`$KV$`解析器解析过后反向注入到字段配置中。

## 目前支持

| 名称 | 写法 | 对应配置 |
| :--- | :--- | :--- |
| normalize | normalize=number:10 | optionConfig.normalize |
| addonAfter | addonAfter=人 | optionJsx.addonAfter |
| addonBefore | addonBefore=人 | optionJsx.addonBefore |
| readOnly | readOnly=true | optionJsx.readOnly |
| placeholder | placeholder=必填 | optionJsx.placeholder |
| valuePropName | valuePropName=checked | optionJsx.valuePropName |
| sorter | sorter=name\`ASC;createTime\`DESC | optionConfig.config.ajax.metadata，组件ListSelector专用解析器，解析排序规则 |
| format | format=YYYY年MM月DD日 | DatePicker专用属性，设置时间格式 |
| listType | listType=picture-card | 上传组件专用属性，设置上传的模式 |
| text | text=上传 | 上传组件专用属性，设置上传的文字 |
| labelSpan | labelSpan=4 | optionItem.labelCol.span |
| wrapperSpan | wrapperSpan=4 | optionItem.wrapperCol.span |
| allowClear | allowClear=true | optionJsx.allowClear，对应Ant Design的Select专用 |
| sorter | sorter=name\`ASC | 【自定义】专用于解析查询引擎中的排序参数 |
| rows | rows=5 | TextArea专用，设置默认占多少行 |
| \_submit | \_submit=DIRECT | 【自定义】按钮专用，用于标识当前按钮是提交按钮 |
| moment | moment=true | 【自定义】用于标识当前字段是时间字段，初始化时会转成Moment对象 |
| itemClass | itemClass=grid-left | 【自定义】optionItem.className |
| colon | colon=false | 设置标签的逗号：optionItem.colon |



