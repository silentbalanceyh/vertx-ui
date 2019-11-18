import Ux from 'ux';
import {Fn} from 'app';

/**
 * 第一次初始化
 * @private
 */
const _initFirst = () => {
    const init: any = {};
    init.name = Ux.Env['APP'];
    init.path = Ux.Env['ROUTE'];
    // 入口和出口可以和环境变量绑定
    const prefix = `/${Ux.Env['ROUTE']}`;
    const reg = new RegExp(prefix, 'g');
    init.urlEntry = Ux.Env['ENTRY_LOGIN'].replace(reg, '');
    init.urlMain = Ux.Env['ENTRY_ADMIN'].replace(reg, '');
    // key和language在初始化的时候设置
    init.key = Ux.randomUUID();
    init.language = Ux.Env['LANGUAGE'];
    return init;
};
/**
 * 进入该页面的应用程序初始化流程，替换Form内的初始化方法专用
 * application - 基础表单数据
 * dataSource - 应用程序数据
 * OOB部分不需要核心数据
 * 最终存储到reference的state中 $data
 * @param reference
 */
const initData = (reference: any) => {
    const $data = {};
    // 读取应用程序数据
    const {$app} = reference.props;
    const appData = $app.to();
    if (Ux.isEmpty(appData)) {
        const init = _initFirst();
        Object.assign($data, init);
    } else {
        Object.assign($data, appData);
    }
    // 设置$data数据
    reference.setState({
        $data,
        $activeKey: "keyBasic"
    });
};
const initTab = (reference: any) => {
    // 目前的activeKey
    const {$activeKey} = reference.state;

    if ("keyBasic" === $activeKey) {
        return ["keySource", "keyInit"];
    } else if ("keySource" === $activeKey) {
        return ["keyInit"];
    } else {
        return [];
    }
};
const initTabChange = (reference: any) => ($activeKey) => {
    if ($activeKey) {
        reference.setState({$activeKey});
    }
};
const initCategory = (reference: any) => (category) => {
    // 处理函数
    if (category) {
        const values = Ux.formRead(reference);
        // 直接读取values中的source部分
        const jdbcUrl = Fn.obtainJdbcUrl(category, values.source);
        Ux.formHit(reference, "source.jdbcUrl", jdbcUrl);
    }
};
const initCategoryDisabled = (reference: any) => {
    const values = Ux.formRead(reference);
    const {source = {}} = values;
    return !(source.hostname && source.port && source.instance);
};
export default {
    initData,
    initTab,
    initTabChange,
    initCategory,
    initCategoryDisabled,
}