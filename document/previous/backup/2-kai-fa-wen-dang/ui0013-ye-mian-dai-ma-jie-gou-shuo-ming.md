# UI0013 - 页面代码结构说明

下边两篇已经介绍了模板和页面组件的开发：

* [UI0004 - 开发第一个模板](/document/previous/backupus/backup/ui0004-kai-fa-di-yi-ge-mo-ban.md)
* [UI0005 - 开发第一个页面](/document/previous/backupus/backup/ui0005-kai-fa-di-yi-ge-ye-mian.md)

那么接下来看看页面的代码结构究竟是怎么组织到一起的。

## 1.整体结构

![](/document/previous/backupus/backup/image/UI0013-1.png)

## 2.说明

* `PORT`和`Z_ROUTE`两个环境变量会控制访问地址中的根路径和端口；
* `Z_LANGUAGE`会控制资源目录中读取的包的根路径；
* 风格文件依靠`Z_CSS_PRIFIX`来设置前缀，例子中为`ima`；
* 每个页面都是模板 + 页面组件的结构，模板可在多个页面中共享，由路由生成器来实现编连；
* 资源文件`Cab.json`中的ns表示名空间，名空间一般为目录名，比如`src/components/login/index/Cab.json`中的ns名空间的值为`components/login/index`，这样资源文件会位于同样的目录路径下（方便扩展、管理、替换）；
* 资源文件命名和组件名一致，如`UI.js`的资源文件名为`UI.json`；
* 默认模板只有一个，本例中的默认模板为`_ima_admin`模板；

## 3.总结

大部分代码在编程过程中使用了`Ux`包，该包为Zero UI提供的工具包，参考【[UT0001 - yuidoc工具生成API文档](/document/previous/backupus/backup/3-jiao-shou-jia-jie-xi/ut0001-yuidocgong-ju-sheng-cheng-api-wen-dang.md)】查看如何使用工具包文档，基本日志可以从浏览器的Console中打印看到（包含Ux的API，模板、页面组件）；

![](/document/previous/backupus/backup/image/UI0013-2.png)



