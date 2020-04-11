# AI0003 - aiExprField属性解析表

根据前边[UI0015 - Form中的Field](/document/previous/backupus/backup/2-kai-fa-wen-dang/ui0015-formzhong-de-zi-duan-yan-zheng.md)的说明，一个Field的配置如下：

## 1.标准格式

```json
{
    "field": "contactMobile",
    "optionConfig": {
        "normalize": "number,15",
        "rules": [
            {
                "required": true,
                "message": "请输入手机！"
            }
        ]
    },
    "optionItem": {
        "label": "手机"
    }
}
```

## 2.多路径树模式

```json
{
    "metadata":"contactMobile,手机,6,70%,aiInput",
    "optionConfig.normalize":"number,15",
    "optionConfig.rules":[
        "required,请输入手机！"
    ]
}
```

* 多路径模式以`metadata`为标识，必须配置`metadata`后才能启用多路径模式；
* 多路径模式支持以`.`分隔符作为属性路径信息；
* `metadata`的值为属性表达式。

## 3.属性表达式

```json
"contactMobile,手机,6,70%,aiInput,readOnly=true"
```

最简单的模式为属性表达式模式，该表达式模式会参考下表进行（每个属性以逗号分隔）。

| 分隔过后的索引 | 属性 | 等价 | 含义 |
| :--- | :--- | :--- | :--- |
| 0 | field | field = contactMobile | 字段名 |
| 1 | optionItem.label | optionItem.label = 手机 | 字段前边的标签 |
| 2 | span | span = 6 | 字段在Grid的宽度 |
| 3 | optionJsx.style.width | optionJsx.style.width = "70%" | 当前字段宽度 |
| 4 | render | render = aiInput | 默认渲染方法文本框 |
| 5+ | $KV$ |  |  |

> 关于render中的值可参考：[AI0005 - 自动Render组件配置](/document/previous/backupus/backup/ai0005-zi-dong-render-zu-jian-pei-zhi.md)

## 4.总结

上述表格中的`$KV$`参考文档：[AI0004 - $KV$属性解析](/document/previous/backupus/backup/ai0004-kvshu-xing-jie-xi.md)。

