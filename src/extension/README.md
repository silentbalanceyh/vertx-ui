# 扩展包基本规范

　　扩展包和Zero后端的`Zero Extension`扩展模块是一致的，主要有一些功能：
1. 扩展模块会直接被Zero前端识别，并且进入到系统内，不需要用户定义。
2. 扩展模包含三部分：
    1. `extension/components`：页面
    2. `extension/ecosystem`：组件
    3. `extension/library`：库

　　扩展模块的使用如下：

```javascript
// 库引用
import Ex from 'ex';
// 组件引用
import {ExSider} from 'ei';
```

## 1. 基本规范

* [项目结构](document/project-structure.md)
* [基本命名](document/name-spec.md)
