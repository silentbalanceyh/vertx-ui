### 1.说明

* Ux.ai2Event为专用函数，用于生成可直接提交的函数流，该函数有两个主要参数：
    * **reference**：当前Form的React组件引用，包含了`Ant Design`中的form属性；
    * **fnSuccess**：成功的回调函数（通过了Ant Design中的Validation周期）；
    * **fnFailure**：提交失败过后的回调函数；
* Ux.ai2Event最终生成的函数参数为`event`，但该参数在`Op.ts`中被隐藏，开发者不用关心；
* `values`实际上就是当前Form提交过后的表单数据信息；
* `mockData`只有在Mock环境中才会使用到，如果是非Mock环境中，可直接忽略掉该参数；

### 2.Connect机制

#### 2.1.连接点

一般ComplexList会写三个事件，这三个事件会在ComplexList中的Hoc中进行配置，对应到它的options中：

* **submit.add**：添加按钮对应函数，添加函数不会执行动态连接，该选项会直接链接到按钮`$opAdd`函数中；
* **submit.edit**：编辑按钮对应函数，编辑函数会执行动态连接，连接过程会遵循`$opSave + (id)`的函数中；
* **submit.reset**：重置按钮对应函数，添加模式直接链接`$opReset`，编辑模式则是`$opReset + (id)`的函数中；

> 这些按钮都启用了Zero UI的Connect机制，点击过后则可直接通过工具「连接点接收器」来查看当前页面拥有的所有连接点。

#### 2.2.被连接点

除了上述的三个基本配置以外，按钮本身还支持"被连接"的动作，被连接的配置主要包含：

* **op.connect.edit**：【编辑按钮】作为被连接点，外置按钮可直接点击该按钮触发Connect机制；
* **op.connect.reset**：【重置按钮】重置按钮作为被连接点，外置按钮可连接；

上述配置只适合详情页（点击某条记录过后详情页右上角的按钮），暂时不提供「删除」的连接点。

### 3.代码

```typescript
    import Ux from 'ux';

    /**
     * 主表单中的提交数据（保存专用）
     * @param reference
     */
    const $opSave = (reference: any) => Ux.ai2Event(reference,
        (values, mockData) => Ux.ajaxPut("/api/dept", values, mockData)
            .then(data => Ux.showDialog(reference, "edit",
                () => Ux.rxAct(reference).response(data).close().to()
            )));
    /**
     * 主表单中的提交数据（添加专用）
     * @param reference
     */
    const $opAdd = (reference: any) => Ux.ai2Event(reference,
        (values, mockData) => Ux.ajaxPost("/api/dept", values, mockData)
            .then(data => Ux.showDialog(reference, "add",
                () => Ux.rxAct(reference).response(data).close().to())));
    /**
     * 主表单中的重置数据（重置专用）
     * @param reference
     */
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