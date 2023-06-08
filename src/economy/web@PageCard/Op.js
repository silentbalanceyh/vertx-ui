import Ux from "ux";

const onClickBack = (reference, topBar) => (event) => {
    event.preventDefault();
    // 写状态树
    if (topBar.back.state) {
        Ux.writeTree(reference, topBar.back.state);
    }
    // 可使用target
    const target = Ux.toQuery("target");
    let previous;
    if (target) {
        previous = target;
    } else {
        previous = topBar.back.uri ? topBar.back.uri : Ux.Env.ENTRY_ADMIN;
    }
    // 导航处理
    Ux.toRoute(reference, previous);
};
export default {
    onClickBack,
}