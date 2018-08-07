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
| readOnly | readOnly=true | optionJsx.readOnly |
| placeholder | placeholder=必填 | optionJsx.placeholder |
| valuePropName | valuePropName=checked | optionJsx.valuePropName |
| sorter | sorter=name\`ASC;createTime\`DESC | optionConfig.config.ajax.metadata，组件ListSelector专用解析器，解析排序规则 |



