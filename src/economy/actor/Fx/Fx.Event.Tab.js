import Etat from "./Fx.Etat";
import Ux from "ux";
import Unity from "./Fx.Unity";
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
const rxCloseTab = (reference, key) => {
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
export default {
    rxAddTab,       // 添加按钮
    rxRemoveTab,    // 删除 Tab
    rxClickTab,     // 移动 Tab 页，选择某个页
    rxCloseTab,     // 关闭某个 Tab页
    rxEditTab,      // 编辑 Tab 页呈现
}