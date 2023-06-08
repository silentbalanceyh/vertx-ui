import Ux from "ux";
import Ex from 'ex';
import Op from './Op.Step';

const yiData = (data, reference, state = {}) => {
    if (data) {
        // 状态数据（更新）
        const {dataCode = [], dataName, dataType} = data;
        // group 条件处理权限读取
        return Ux.ajaxPost('/api/permission/search', {
            criteria: {
                "code,i": dataCode
            },
            sorter: [
                "name,ASC"
            ]
        }).then((permissions = {}) => {
            const inited = {};
            // 表单核心数据
            const $permissions = Ux.valueArray(permissions);
            if (0 < $permissions.length) {
                const source = Ux.onDatum(reference, "resource.models");
                const root = source.filter(item => !item.parentId);
                /*
                 * 此处由于读取到的权限信息，则需要执行两个字段的计算
                 * resourceType 和 modelKey
                 * 这两个字段的目的只是为了计算 identifier
                 */
                $permissions.forEach(permission => {
                    const found = Ux.elementFind(source, {identifier: permission.identifier});
                    if (found[0]) {
                        const record = found[0];
                        permission.modelKey = record.key;
                        /*
                         * 计算资源类型
                         */
                        const branch = Ux.elementBranch(source, record.key, "parentId");
                        const resourceKey = branch[0] ? branch[0].key : undefined;
                        if (resourceKey) {
                            const resource = Ux.elementUnique(root, 'key', resourceKey);
                            if (resource) {
                                /*
                                 * 资源类型计算
                                 */
                                permission.resourceType = resource.code;
                            }
                        }
                    }
                    // type，资源类型计算
                })
            }

            /*
             * 初始化核心字段
             */
            inited.permissions = $permissions;
            inited.type = dataType;
            inited.group = dataName;

            state.$data = Ux.clone(inited);
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
        // reference.?etState({
        //     // 权限重新加载
        //     $readyPart: false,
        //     // 重置步骤数据
        //     $wizard: undefined, // $wizard 专用数据
        //     $removed: undefined, // 移除部分
        //     // 步骤退回第一步
        //     $step: 0,
        // });
        Ux.of(reference).in({
            // 权限重新加载
            $readyPart: false,
            // 重置步骤数据
            $wizard: undefined, // $wizard 专用数据
            $removed: undefined, // 移除部分
            // 步骤退回第一步
            $step: 0,
        }).done();
        /*
         * Ux.toLoading(() => yiData($checked.current)
            .then(Ux.ready).then(Ux.pipe(reference)), 32.8)
         */
    } else {
        const {data} = reference.props;
        const {$readyPart = true} = reference.state;
        if (!$readyPart) {
            Ux.of(reference).in({
                $wizard: undefined, // $wizard 专用数据
                $removed: undefined, // 移除部分
                $step: 0,
            }).handle(() => yiData(data, reference)
                .then(Ux.ready).then(Ux.pipe(reference)), 32.8
            )
            // reference.?etState({
            //     $wizard: undefined, // $wizard 专用数据
            //     $removed: undefined, // 移除部分
            //     $step: 0,
            // });
            // Ux.toLoading(() => yiData(data, reference)
            //     .then(Ux.ready).then(Ux.pipe(reference)), 32.8)
        }
    }
}
export default {
    yiWizard,
    yuWizard,
    ...Op
}