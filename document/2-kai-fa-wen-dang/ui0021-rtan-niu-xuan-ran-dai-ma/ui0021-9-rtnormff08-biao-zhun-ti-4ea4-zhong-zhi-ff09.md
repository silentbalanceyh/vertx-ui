# UI0021-9 - rtNorm（标准提交/重置）

标准提交重置为双按钮配置，主要针对：提交/重置的绑定

## 1.配置

```json
{
    "metadata": "$button",
    "hidden": true,
    "optionJsx.buttons": {
        "submit": "$opSave",
        "reset": "$opReset"
    }
}
```

## 2.按钮效果

* 提交调用`rtAnt`方法
* 重置调用`rtRet`方法

其他信息参考另外两个按钮的文档：

* [UI0021-6 - rtAnt（全提交专用按钮）](/document/2-kai-fa-wen-dang/ui0021-rtan-niu-xuan-ran-dai-ma/ui0021-6-rtantff08-quan-ti-jiao-zhuan-yong-an-niu-ff09.md)
* [UI0021-2 - rtRet（重置按钮专用）](/document/2-kai-fa-wen-dang/ui0021-rtan-niu-xuan-ran-dai-ma/ui0021-2-rtretff08-zhong-zhi-an-niu-zhuan-yong-ff09.md)



