import abs from './interface.abyss';
import ajax from './interface.ajax';
import constant from './constant';
import develop from './interface.develop';
import element from './interface.element';
import engine from './index.entry.engine';
import entity from './interface.entity';
import unity from './index.entry.unity';
import xweb from './interface.xweb';
import romantic from './interface.romantic';
import aggr from './interface.aggr';

// 图相关
import g6 from './interface.g6';
import g2 from './interface.g2';

import E from './interface.error';

import {zero} from 'zero';

const exported = {
    /**
     * # 核心注解`@zero`
     *
     * ## 1. 基本介绍
     *
     * zero注解过后执行Hoc高阶封装操作
     *
     * 核心配置类，使用注解语法`@zero`执行资源文件绑定，这个注解在整个框架中为最底层注解，
     * 定义组件本身的元数据，它所处理的工作流程如下：
     *
     * 1. 和 `cab/<LANGUAGE>/` 链接，读取配置信息，构造`HocI18n`对象。
     * 2. redux 映射处理，用于处理 StateToProps 和 DispatchToProps 两种映射关系。
     * 3. 绑定 Ant Design的表单 Form 实现表单的核心绑定。
     * 4. 操作绑定构造 $op 变量，存储在状态中。
     *
     *
     * ```js
     * import Ux from 'ux';
     *
     * &#64;Ux.zero() -- 注释掉的调用方法，由于包含 @ 符号不可解析
     * class Component extends React.Component{
     *
     * }
     * ```
     *
     * ## 2. 代码规范
     *
     * Zero UI中定义了特定的代码规范`src`目录下：
     *
     * |目录|类型|说明|
     * |:---|---|:---|
     * |`cab/<LANGUAGE>`|Json资源|当前页面/容器绑定的资源文件地址。|
     * |container|Js代码|容器组件专用地址。|
     * |components|Js代码|页面组件专用地址。|
     *
     * @method @zero
     */
    zero,
    ...abs,
    ...ajax,
    ...develop,
    ...element,
    ...engine,
    ...entity,

    ...unity,

    ...g6,
    ...g2,

    ...xweb,
    ...aggr,
    ...romantic,
    Env: {
        ...constant,
    },
    E,
};
develop.dgJs(exported, "[Ux] API函数：", "#CB4DA3")
export default exported;

