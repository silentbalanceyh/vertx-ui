import Ex from "ex";
import Ux from "ux";

export default (reference) => {
    Ex.yiStandard(reference)
        .then(state => {
            state.$menus = Ux.g6DataTree({state}, {
                category: "data.category"
            });
            state.$selected = undefined;
            return Ux.promise(state);
        })
        .then(Ux.pipe(reference));
}