### 1.说明

核心执行逻辑，添加/删除相关逻辑，有几点需要说明：

* 函数本身使用`Ux.ai2Event`函数进行包装。
* 回调中使用`Ux.rxAct`模式执行。
    * 设置响应数据。
    * 完成Form的提交过程（防重复提交状态）。
    * 重置当前表单，调用`form`引用中的 reset 。
* 最终执行`rxAct`中的回调。

### 2.代码

```typescript
    import Ux from 'ux';
    import {Fn} from 'app';

    const $opAdd = (reference: any) => Ux.ai2Event(reference,
        (values) => Ux.rxAct(reference)
            .response(values.version)
            .submitted()
            .reset()
            .to(() => Fn.demoJson(reference, 1, {version: values.version})));
    const $opSave = (reference: any) => Ux.ai2Event(reference,
        (values) => Ux.rxAct(reference)
            .response(values.version)
            .submitted()
            .reset()
            .to(() => Fn.demoJson(reference, 1, {version: values.version})));
    export default {
        $opAdd,
        $opSave,
    }
```