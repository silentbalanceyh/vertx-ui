// X_CATEGORY 表访问
import yiStandard from './yi.standard';
// X_MODULE 表访问
import yiModule from './yi.module';
// UI_LAYOUT 表访问
import yiLayout from './yi.layout';
// UI_FORM
import yiForm from './yi.form';
import yiAssist from './yi.assist';
// 特殊加载
import yiControl from './yi.control';

export default {
    /*
     * 1. yiModule
     * 2. 路由信息：/xxx/yyy/:type --> type,= <value>
     * 3. yiAssist
     */
    yiStandard,

    /*
     * X_MODULE 表连接，动态模块专用配置解析
     * 直接读取当前 URI 路径上的 X_MODULE 中存储的数据信息
     * */
    yiModule,
    /*
     * 模板专用处理器
     * 1）静态模板
     * 2）动态模板
     */
    yiLayout,
    /*
     * ExForm,
     * ExLogin,
     * ExEntry
     * 专用表单配置处理器
     */
    yiForm,
    /*
     * 辅助数据，只处理
     * _assist 的数据
     * */
    yiAssist,
    /*
     * 控件专用处理
     * 从后端读取配置：UI_CONTROL / UI_FORM / UI_LIST
     * */
    yiControl,
}