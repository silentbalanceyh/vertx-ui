import Ux from 'ux';
import Ex from 'ex';

const Actions = {
    $opSave: (reference) => (event) => {
        Ux.prevent(event);
        const {$keySet, $keyDefault = [], $validation} = reference.state;
        let selected = new Set();
        if ($keySet) {
            Array.from($keySet).forEach(key => selected.add(key));
        } else {
            selected = [];
        }
        const validationKeys = Ux.immutable($validation);
        const validation = Array.from(selected).filter(key => validationKeys.contains(key));
        if (0 === validation.length) {
            Ux.sexMessage(reference, "empty")
        } else {
            reference.setState({$submitting: true});
            /*
             * 计算 selected
             *
             * - 如果本节点被选中，则它的父节点必须被选中
             */
            $keyDefault.forEach(item => {
                if (Ux.Env.MENU_TYPE.NAV === item.type) {
                    selected.delete(item.key);
                } else {
                    selected.add(item.key);
                }
            });
            {
                const {config = {}} = reference.props;
                const {datum = []} = config;
                Array.from(selected).forEach(each => {
                    const keys = Ux.elementBranch(datum, each, "parentId");
                    if (1 < keys.length) {
                        // 添加父ID
                        keys.forEach(item => selected.add(item.key));
                    }
                })
            }
            const request = Ex.authRequest(reference, Array.from(selected));
            // 保存
            Ux.ajaxPut("/api/view/:ownerType/:ownerId", request).then(processed => {
                Ux.sexDialog(reference, "saved",
                    () => reference.setState({$submitting: false}));
            }).catch(error => {
                console.error(error);
                Ux.sexMessage(reference, "server");
                reference.setState({$submitting: false});
            })
        }
    }
}

const mountData = (state = {}, data = {}) => {
    if (data.selected) {
        const {keys = []} = data.selected;
        const keySet = new Set();
        keys.forEach(key => keySet.add(key));
        state.$keySet = keySet;
    }
}

const yiPage = (reference) => {
    const state = {};
    const {config = {}, data = {}} = reference.props;
    const $op = Ux.fromHoc(reference, "op");
    if (Ux.isArray($op)) {
        $op.forEach(op => {
            op.onClick = Actions[op.key](reference);
        });
    }
    state.$button = $op;
    state.$op = {
        $opChecked: Actions.$opChecked
    }

    const {datum = []} = config;
    const source = datum.filter(item => Ux.Env.MENU_TYPE.SIDE === item.type);
    /*
     * 选择的数据
     */
    mountData(state, data, source);
    {
        // 设置默认菜单
        state.$keyDefault = datum.filter(item => Ux.Env.MENU_TYPE.SIDE !== item.type);   // 默认值
    }
    /*
     * $validation：验证过程中必须添加的菜单
     */
    state.$validation = source.map(item => item.key);
    state.$source = Ux.toTree(source, {title: "text", sort: 'order'});
    state.$ready = true;
    reference.setState(state);
}
export default {
    yiPage
}