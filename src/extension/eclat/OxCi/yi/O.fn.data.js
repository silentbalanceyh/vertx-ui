import Ux from "ux";

const yiForm = (reference, state = {}) => {
    const {$index = 0, $stack = []} = state;
    const current = $stack[$index];
    if (current) {
        const {identifier} = current;
        const code = Ux.formatExpr("form.:identifier.view", {identifier});
        return Ux.ajaxGet('/api/ui/form/:code', {code}).then(response => {
            if (Ux.isEmpty(response)) {
                const error = Ux.fromHoc(reference, "error");
                state.failure = error.form;
            } else {
                let $raft = Ux.clone(response);
                /*
                 * 隐藏按钮
                 */
                $raft.ui.forEach(row => row.forEach(cell => {
                    if ((cell.field && "$button" === cell.field) ||
                        (cell.metadata && cell.metadata.startsWith("$button"))) {
                        cell.hidden = true;
                    }
                }));
                state.raft = $raft;
                state.$edition = false;
            }
            return Ux.promise(state);
        });
    }
};
const yiData = (reference, state = {}) => {
    const {$index = 0, $stack = []} = state;
    const current = $stack[$index];
    if (current) {
        const {key} = current;
        return Ux.ajaxGet('/api/ox/ci.device/:key', {key}).then(response => {
            state.$inited = response;
            /*
             * state.$identifier = 处理
             */
            const category = Ux.elementUniqueDatum(reference, "data.category",
                'key', response.categoryThird);
            state.$identifier = category.identifier;
            return Ux.promise(state);
        })
    }
};
export default (reference, state = {}) => yiForm(reference, state)
    .then(state => yiData(reference, state))