### 1.说明

由于第一部分属性同`ComplexList`，可直接进入`ComplexList`中查看详细信息：

<a href="/zui/control/complex-list" target="_blank">ComplexList教程</a>

> 仅多了一个opAddRow的高阶函数用于生成快速添加行的核心回调函数。

### 2.代码

```typescript
    import Ux from 'ux';

    /**
     * 主表单中的提交数据（保存专用）
     * @param reference
     */
    const $opSave = (reference: any) => Ux.ai2Event(reference,
        (values, mockData) => Ux.ajaxPut("/api/dept", values, mockData)
            .then(data => Ux.showDialog(reference, "edit", () =>
                Ux.rxAct(reference).response(data).close().to())));
    /**
     * 主表单中的提交数据（添加专用）
     * @param reference
     */
    const $opAdd = (reference: any) => Ux.ai2Event(reference,
        (values, mockData) => Ux.ajaxPost("/api/dept", values, mockData)
            .then(data => Ux.showDialog(reference, "add", () =>
                Ux.rxAct(reference).response(data).close().to())));
    /**
     * 主表单中的重置数据（重置专用）
     * @param reference
     */
    const $opReset = (reference: any) => (event: any) => {
        event.preventDefault();
        Ux.formReset(reference);
    };

    const opAddRow = (reference: any) => (record: any, id: any, fnClose) =>
        Ux.rxAct(null).close(fnClose).to();
    export default {
        $opSave,
        $opAdd,
        $opReset,
        opAddRow
    }
```