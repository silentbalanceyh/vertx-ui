import Ux from "ux";
import Ex from 'ex';
import Op from './Op.Step';

const yiData = (data, reference, state = {}) => {
    if (data) {
        // 状态数据（更新）
        const {__group, __parent = {}} = data;
        // group 条件处理权限读取
        return Ux.ajaxPost('/api/permission/search', {
            criteria: {
                group: __group.group,
            },
            sorter: [
                "name,ASC"
            ]
        }).then((permissions = {}) => {
            const data = {};
            // 表单核心数据
            data.group = __group.group;
            const {list = []} = permissions;
            // 需要给每个 permissions 追加 type 信息
            const $permissions = Ux.isArray(list) ? Ux.clone(list) : [];
            if (0 < $permissions.length) {
                $permissions.forEach(permission => {
                    permission.type = __parent.code;
                    // modelKey 的计算
                    const model = Ux.elementUniqueDatum(reference,
                        'resource.models', 'identifier', permission.identifier);
                    if (model) {
                        permission.modelKey = model.key;
                    }
                })
            }
            data.permissions = $permissions;
            state.$data = Ux.clone(data);
            state.$readyPart = true;

            return Ux.promise(state);
        })
    } else {
        // 清空数据
        state.$data = {};
        state.$readyPart = true;
        // 状态数据（添加）
        return Ux.promise(state);
    }
}

const yiWizard = (reference) => {
    const state = {};
    /*
     * 权限定义
     */
    state.$step = 0;
    const $steps = Ux.fromHoc(reference, 'helps');
    $steps.forEach(Ux.applyKey);
    state.$stepConfig = $steps;
    /*
     * 操作处理
     */
    state.$actions = Ux.fromHoc(reference, "actions");
    /*
     * 设置
     */
    const {data} = reference.props;
    yiData(data, reference, state)
        .then(Ux.ready).then(Ux.pipe(reference))
}
const yuWizard = (reference, virtualRef) => {
    const $checked = Ex.upValue(reference.props, virtualRef.props, "data");
    if ($checked) {
        /*
         * 当前数据处理
         */
        reference.setState({
            // 权限重新加载
            $readyPart: false,
            // 重置步骤数据
            $wizard: undefined, // $wizard 专用数据
            $removed: undefined, // 移除部分
            // 步骤退回第一步
            $step: 0,
        });
        /*
         * Ux.toLoading(() => yiData($checked.current)
            .then(Ux.ready).then(Ux.pipe(reference)), 32.8)
         */
    } else {
        const {data} = reference.props;
        if (data) {
            const {$readyPart = true} = reference.state;
            if (!$readyPart) {
                reference.setState({
                    $wizard: undefined, // $wizard 专用数据
                    $removed: undefined, // 移除部分
                    $step: 0,
                });
                Ux.toLoading(() => yiData(data, reference)
                    .then(Ux.ready).then(Ux.pipe(reference)), 32.8)
            }
        }
    }
}
export default {
    yiWizard,
    yuWizard,
    ...Op
}