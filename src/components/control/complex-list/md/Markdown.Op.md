### 1.说明

* Ux.ai2Event为专用函数，用于生成可直接提交的函数流，该函数有两个主要参数：
    * reference：当前Form的React组件引用，包含了`Ant Design`中的form属性；
    * fnSuccess：成功的回调函数（通过了Ant Design中的Validation周期）；
    * fnFailure：提交失败过后的回调函数；
* Ux.ai2Event最终生成的函数参数为`event`，但该参数在`Op.ts`中被隐藏，开发者不用关心；
* `values`实际上就是当前Form提交过后的表单数据信息；
* `mockData`只有在Mock环境中才会使用到，如果是非Mock环境中，可直接忽略掉该参数；

### 2.代码

```typescript
    import Ux from 'ux';

    const $opSave = (reference: any) => Ux.ai2Event(reference,
        (values, mockData) =>
            Ux.ajaxPut("/api/dept", values, mockData)
                .then(data => Ux.showDialog(reference, "edit", () => {
                    console.info("更新成功：", data);
                    reference.props.fnClose();
                })));
    const $opAdd = (reference: any) => Ux.ai2Event(reference,
        (values, mockData) => Ux.ajaxPost("/api/dept", values, mockData)
            .then(data => Ux.showDialog(reference, "add", () => {
                console.info("添加成功：", data);
                reference.props.fnClose();
            })));
    const $opReset = (reference: any) => (event: any) => {
        event.preventDefault();
        Ux.formReset(reference);
    };
    export default {
        $opSave,
        $opAdd,
        $opReset
    }
```