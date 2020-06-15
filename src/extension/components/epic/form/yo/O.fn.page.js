import Ex from "ex";
import Ux from "ux";
import page from '../page';

export default (reference) => {
    Ex.yiStandard(reference)
        .then(state => {
            state.$menus = Ux.g6DataTree({state}, {
                category: "data.category"
            });
            state.$selected = undefined;
            return Ux.promise(state);
        })
        .then(state => Ux.promise(Ex.uiTab(reference)
            .children({
                /* 表单管理主界面，Tab页面一 */
                tabForm: page.pageMain(reference),
                /* 表单管理设计界面，Tab页面二 */
                tabDesign: page.pageDesigner(reference),
            }).onMount(state))
        )
        .then(Ux.pipe(reference));
}