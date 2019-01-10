# UI0011 - TypeScript数据模型

Zero UI中的所有数据模型都是用TypeScript书写，可直接从`entity`包中导入所有数据模型，它的入口文件如下：

```ts
export { default as StateIn } from "./state/StateIn";
export { default as StateOut } from "./state/StateOut";
export { default as Navigator } from "./flow/Navigator";

export { default as DataObject } from "./data/DataObject";
export { default as DataArray } from "./data/DataArray";
export { default as DataRouter } from "./flow/DataRouter";
export { default as DataLabor } from "./DataLabor";

export { default as HocI18n } from "./hoc/HocI18n";

export { default as QTree } from "./query/QTree";
```

## 1.数据模型结构

整体的数据模型结构如下：

![](/document/backup/image/UI0011-01.png)

## 2.高频使用的API

### 2.1.读取数据

一般读取数据有两种方式，通常不调用`raw`读取原始数据，这一点请注意，`raw`方法提供的目的是方便调试。

**\_**：读取Object中的某个字段，下边代码演示了`$user`中读取`logo`属性

```js
<Avatar size="default" className="avatar" 
        src={($user._("logo") ? $user._("logo") : "/img/hotel/login/default.jpeg")} />
```

**to**：读取所有数据，转换成JavaScript中的Object/Array专用方法

```js
        const {$app, $menus, $_collapsed} = this.props;
        const dataUris = Op.fnUriMapping($menus.to());
        const dataArray = Op.fnMenuData($menus.to(), $app);
```

**$**：DataArray专用读取方法，读取数组中某个索引上的元素中的field单个字段，该方法后期可能会移除

### 2.2.判断函数

**is\(\)**：使用`is()`的方法判断当前数据是否已经准备好了，这个地方这个设计是有必要的，主要设计目的如下：

* `is()`的返回值为`false`则表示当前的数据模型没有准备好，需要重新加载或刷新，如果想要让它变成重新加载，可传入新数组调用`dirty(Array)`方法；
* `is()`的返回值还可以判断`undefined`和`{}、[]`这种有无数据的情况；
* 如果数据本身是`undefined`，则不会抛出JavaScript中的Error，只是无法读取相关数据；
* 对于React中的render方法中的判断尤其有用，并且在浏览器中打印时可清楚看到当前数据类型不是Object/Array，而是指定类型；

### 2.3.数组专用

* `saveElement`：可以让数组元素实现不重复添加；
* `removeElement`：移除某个元素；
* `getElement`：读取某个元素中的某个属性的值；
* `updateElement`：更新某个元素；
* `searchElement`：搜索某个元素；

## 3. 总结

暂时不介绍其他的API的相关用法，不过大部分API都包含了`to()`和`_`取数据和转换的方法，参考下边截图打印的数据类型不是JavaScript中的Object/Array，而是自定义的数据模型类型。

![](/document/backup/image/UI0011-11.png)

