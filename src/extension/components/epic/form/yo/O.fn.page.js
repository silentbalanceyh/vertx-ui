import Ex from "ex";
import Ux from "ux";

import tabForm from '../Web.Fn.Page.Main';

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
                tabForm: tabForm(reference),
                tabDesign: () => {

                    return false;
                },
            }).onMount(state))
        )
        .then(Ux.pipe(reference));
}