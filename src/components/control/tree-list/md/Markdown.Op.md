### 1.说明

该文件仅仅为一个连接文件，需要注意的是，它不连接`Op.Tree.ts`文件。

### 2.代码

```typescript
    import Act from './Op.Act';
    import Item from './Op.Item';

    export default {
        ...Act,
        ...Item
    }
```