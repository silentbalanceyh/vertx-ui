import Etat from "./Fx.Etat";
import Ux from "ux";
import Unity from "./Fx.Unity";
import Inherit from './Fx.Event.Inherit';
import U from "underscore";
import {Modal} from "antd";
/* ExComplexList 引用 */
const rxAddTab = reference => event => {
    // 添加按钮
    event.preventDefault();
    const view = Etat.View.switch(reference, "add", undefined);
    const tabs = Etat.Tab.add(reference);
    reference.setState({tabs, ...view});
};
/* ExComplexList 引用 */
const rxRemoveTab = (reference) => (key, action) => {
    if ("remove" === action) {
        const state = Etat.Tab.remove(reference, key);
        reference.setState(state);
    }
};
/* ExComplexList 引用 */
const rxClickTab = reference => key => {
    const state = Etat.Tab.click(reference, key);
    reference.setState(state);
};
/* ExComplexList 引用 */
const rxCloseTab = (reference, key) => () => {
    const state = Etat.Tab.close(reference, key);
    reference.setState(state);
};
/* IxTable 引用 */
const rxEditTab = (reference, id, data = {}) => {
    const ref = Ux.onReference(reference, 1);
    const view = Etat.View.switch(ref, "edit", id);
    const tabs = Etat.Tab.edit(ref, data);
    Unity.consume(reference, 'fnInit')(fnInit => fnInit(data, {tabs, ...view}));
};
const rxOpenDialog = (reference, config = {}, supplier) => (event) => {
    event.preventDefault();
    const {window, popover, drawer} = config;
    if (window || popover || drawer) {
        // 弹出
        reference.setState({$visible: true});
    } else {
        const {confirm = {}} = reference.state;
        const config = Ux.clone(confirm);
        if (U.isFunction(supplier)) {
            const onOk = supplier(reference);
            if (U.isFunction(onOk)) {
                config.onOk = onOk;
            }
        }
        Modal.confirm(config);
    }
};
/* ExComplexList 引用 */
const rxSwitchView = (reference) => (data = {}) => {
    const view = Etat.View.switch(reference, "edit", data.key);
    const tabs = Etat.Tab.edit(reference, data);
    Inherit.fnInit(reference)(data, {tabs, ...view});
};
export default {
    rxAddTab,       // 添加按钮
    rxRemoveTab,    // 删除 Tab
    rxClickTab,     // 移动 Tab 页，选择某个页
    rxCloseTab,     // 关闭某个 Tab页
    rxSwitchView,   // 进入编辑页面
    rxEditTab,      // 编辑 Tab 页呈现
    rxOpenDialog,   // 打开窗口统一函数
};