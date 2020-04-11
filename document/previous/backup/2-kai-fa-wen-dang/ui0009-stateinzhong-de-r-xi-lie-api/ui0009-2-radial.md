## radial

该方法用于读取`Assist/Tabular`专用数据

* `Assist`：关联表辅助数据，如用户管理时添加角色信息，角色在后端存储在另外一张数据表中，下拉选择时需要选择某个角色，这种属于关联表辅助数据；
* `Tabular`：字典数据，有些系统会使用到字典表，用于生成对应的字典数据，该数据来源于某一张表。

```typescript
radial(keys: any, isAssist: boolean = false): StateOut
```

### 1.状态树说明

![](/document/previous/backupus/backup/image/UI0009-2.png)

`Assist`和`Tabular`为专用节点，所以在前文[UI0009-1 - revamp](/document/previous/backup/2-kai-fa-wen-dangen-dang/ui0009-stateinzhong-de-r-xi-lie-api/ui0009-1-revamp.md)中传入的key不能为`assist`或`tabular`两个值，而这两种数据的读取方法则使用`radial`的API来实现。

### 2.状态写入

状态写入在Zero中有固定的API来实现：以Assist为例，可直接调用`Ux.rxAssist`的API来写入状态树

```js
    "categories": {
        ajax: params => Ux.microGet(Cv.App.Modal, "/api/categories", params, Mock.ListCategories),
        processor: data => Ux.rxAssist(data, "model.categories")
    },

    "selected.model": {
        ajax: params => Ux.microGet(Cv.App.Modal, "/api/models", params, Mock.ListModel),
        processor: data => Ux.rxAssist(data, "model.selected")
    },
```

从上图的状态树中，开发者可以看到节点被转换成了`permission_roles`的名称，这个在开发过程你可以不用担心，使用Ux中的API时，在使用层面会自动处理，并且从它的子节点`ready、data、length`可以知道这个节点的数据类型为`DataArray`，因为`DataObject`只有两个值：`data、ready`。

### 3.状态读取

```js
@zero(Ux.rxEtat(require('./Cab.json'))
    .init(Types.fnAccountAssignInited)
    .connect(state => Ux.dataIn(state)
        .rework({datum: ["inited"]})
        .radial(["permission.roles"], true)  // 读取assist，第二参数true，从assist中读取，如果为false则从tabular读取
        .rinit(['inited'])
        .to()
    )
    .loading("inited", "permission.roles")
    .cab('UI')
    .to()
)
```

### 4.代码中使用

```js
# 不论是Assist还是Tabular都可以统一调用该API来读取，如果有多个需要读取，则直接改变第二参
const roles = Ux.onDatum(this, "permission.roles");

# 老版本的直接引用（不推荐，目前已废弃）
# Assist
const { $a_permission_roles } = this.props;
# Tabular
const { $t_room_type } = this.props;
```

> 使用Ux的API达到的目的是写入状态树、读取状态树、从属性中拿数据全程统一。

### 5.总结

radial主要是用于读取`Assist`/`Tabular`专用节点的数据。

