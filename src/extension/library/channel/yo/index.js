import yoAmbient from './yo.ambient';
import yoDynamic from './yo.dynamic';
import yoPolymorphism from './yo.polymorphism';
/*
 * -------------> Component规范
 * 「一个组件传入到另外一个组件的基本规范参考此文件」：
 * 注意连接的生命周期位置：
 * 1）`yo`打头的
 *    说明：yo 打头的函数用于外置组件连接内置组件，写法自由，传入参数为
 *    (reference, addOn)
 *       - reference 是外置组件引用
 *       - addOn 是外置组件需要传入给内置组件的属性值
 * 1.1）传入统一说明（目前出现的）：
 * {
 *      $app: DataObject - 应用程序配置：X_APP 表内容,
 *      $router：DataRouter - (react-router）构造对象，保存了路由处理,
 *      $menus：DataArray - X_MENU 菜单数据信息，
 *      $user：DataObject - 登录用户基本数据信息,
 *      $inited：Object - Form专用初始化数据（外置传入）
 *      config：{
 *          配置数据，按 Component 处理自由度（不同组件配置信息有所区别）
 *      },
 *      data：[
 *          核心数据，按 Component 需求处理
 *      ],
 *      fnOut：redux 专用公共写数据,
 *      css：{
 *          `cls`打头，专用于Css中的 className 处理
 *      }
 * }
 * `yo`组件以目标组件需求格式为主，上述格式是最终的子组件的 props
 */
/*
 * Form表单专用
 */
/*
 * 1.2）列表：
 * - yoSider：ExSider
 * - yoNavigation: Ex
 *
 * Component规范 -------------->
 * 2）`yi`打头的
 *    说明：yi 打头的函数用于内置函数初始化专用，传入内容统一
 *    (reference)
 *       - reference 是内置组件引用
 *    `yi`会将内置组件 reference 解开，然后生成状态信息：state 并且设置到当前组件
 *    不同组件内置状态结构会有所区别
 *
 * Initialize规范 ------------->
 * 3）`yl`打头的
 *    说明：yl 打头的函数主要用于初始化操作
 */
import yoRender from './yo.render';
/*
 * yo - 哟，origin
 * yi - 嗨，hi - initialize
 * yc - 配，config
 * yx - yxRender -> 切换 render 处理
 */
import yoList from './yo.list';
import yoForm from './yo.form';
import yoFilter from './yo.filter';
/*
 * 动态 Control
 */
import yoControl from './yo.control';
/*
 * 按钮专用过滤函数，主要过滤几种：
 * 1）Open区
 * 2）Batch区
 * 3）Search区
 * 4）Extra区
 * 5）Row区
 */
import yoAction from './yo.action';
/*
 * 几个特定函数
 * -- yoList -> 列表区域
 * -- yoTab -> Tab页
 * -- yoForm -> 表单区域
 * -- yoTable -> 列表区域
 */
import yo from './component';

export default {
    ...yo,

    yoAmbient,              // 环境数据（统一处理）
    yoDynamic,
    yoPolymorphism,
    /**
     * ## 扩展函数
     *
     * 同`yoAmbient`，重名函数，赋予语义的函数名。
     *
     * @memberOf module:_channel
     * @method yoComponent
     * @param {ReactComponent} reference React对应组件引用
     * @param {Object} config 额外的配置数据
     * @returns {Object} 计算最终生成的继承属性专用方法
     */
    yoComponent: yoAmbient, // 环境数据（统一处理）
    yoControl,
    yoForm,
    yoFilter,
    yoAction,
    yoList,
    yoRender,           // 普通组件专用渲染
}