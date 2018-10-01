### 1.说明

该代码提供了`$functions`属性的信息，直接绑定，为所有单元格中的删除回调函数提供了定义。

### 2.代码

```typescript
    const rxDelThird = (reference: any) => (record) => {
        console.info("三级归类", record);
    };
    const rxDelSecond = (reference: any) => (record) => {
        console.info("二级归类", record);
    };
    const rxDelFirst = (reference: any) => (record) => {
        console.info("一级归类", record);
    };
    const rxDelProd = (reference: any) => (record) => {
        console.info("管理项", record);
    };

    export default {
        rxDelThird,
        rxDelProd,
        rxDelFirst,
        rxDelSecond
    }
```