### 1.说明

#### 1.1.基础

此处有三个函数需要特殊说明；

|组件名称|函数名|备注|
|-|-|-|
|ComplexList|rxDeletePost|删除ComplexList主表记录过后的回调|
|ComplexList|rxEditPost|点开ComplexList主记录中的某条记录时的回调|
|DialogList|rxDelete|删除DialogList中的某条记录过后的回调|

#### 1.2.关键点

此处的`rxEditPost`函数很重要，它要负责将`list.items`节点的数据初始化，它的签名如下：

```typescript
    const opEditPost = (reference: any) => (record: any, id: any) => {
        // record中会包含主记录的数据，id则是主记录的id
        // 在读取某个list的数据时，一般从record中的某个属性提取，类型为Array
    }
```

#### 1.3.提交模式

从DialogList中可以分为以下几种提交模式，不论哪种提交模式都是基于：`Ux.ai2Event`的API来封装：

|提交模式|对应的OP|备注信息|
|-|-|-|
|ADD|Op.Act.ts-$opAdd|「主表单」主记录提交模式（添加）|
|EDIT|Op.Act.ts-$opSave|「主表单」主记录编辑模式（编辑）|
|ADD-ADD|Op.Sub.ts-$opSubAdd|「子表单」双添加模式：主表单添加，子表单添加|
|ADD-EDIT|Op.Sub.ts-$opSubSave|「子表单」添加编辑模式：主表单添加，子表单编辑|
|EDIT-ADD|Op.Sub.ts-$opSubAdd|「子表单」编辑添加模式：主表单编辑，子表单添加|
|EDIT-EDIT|Op.Sub.ts-$opSubSave|「子表单」双编辑模式：主表单编辑，子表单编辑|

> 在子表单处理模式中，如果想要得到子表单中的items的数据，则可以直接从`values`的`_items`属性中提取

### 2.代码

```typescript
    import Ux from 'ux';
    import Mock from './mock';
    import Act from './Op.Act';
    import Sub from './Op.Sub';

    const opDeletePost = (reference: any) => (id: any) => {
        // 列表删除回调，目前没有设置相关回调信息
        console.info(id, reference)
    };

    const opEditPost = (reference: any) => (record: any, id: any) => {
        // 在编辑点击过后操作，将数据写入到items
        const mockData = Mock.fnUsers;
        let dataArray = mockData.mock ? mockData.data : (
            record["users"] ? record["users"] : []
        );
        // 读取当前记录中的子列表
        dataArray = dataArray.filter(item => item.deptId === id);
        // 从$items（DataObject）中更新id = dataArray的子列表
        const {$items} = reference.props;
        const dataRecord = Ux.rapitRecord($items, id, dataArray);
        // 将最终生成的Record写入到状态树 list.items
        Ux.writeTree(reference, {
            "list.items": dataRecord
        })
    };
    export default {
        Act,
        Sub,
        opDeletePost,
        opEditPost
    }
```