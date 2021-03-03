import Ux from "ux";
import {Dsl} from 'entity';
/*
 * 上一步
 */
const onPrev = (reference) => (event) => {
    const {$step = 0} = reference.state;
    if (1 === $step) {
        reference.setState({$step: 0});
    }
}
/*
 * 下一步
 */
const onNext = (reference) => (event) => {
    Ux.prevent(event);
    const {$step = 0} = reference.state;
    if (0 === $step) {
        // 第一个阶段的下一步
        Ux.connectId("$opStep1");
    } else if (1 === $step) {
        // 第二个阶段
        Ux.sexDialog(reference, "saved", () => {
            // 处理当前按钮信息
            reference.setState({$submitting: true});
            // 读取所有数据
            const {$wizard, $removed} = reference.state;
            const {permissions = [], group, type} = $wizard;

            // 参数构造
            const params = {
                data: [],        // 权限信息（Save）
                relation: {},    // 关系信息 actionId = permissionId
                group,           // 编辑的权限组信息（中文可靠）
                type,            // 权限的类型，该类型影响类型树
            };
            permissions.forEach(permission => {
                const {actions = [], ...rest} = permission;
                // 权限部分
                const permData = Ux.clone(rest);
                permData.group = group;
                params.data.push(permData);
                // 关系部分
                actions.forEach(action => params.relation[action.key] = permission.key);
            })
            // 移除部分
            if ($removed) {
                params.removed = Array.from($removed);  // Set
            } else {
                params.removed = [];
            }
            Ux.ajaxPut("/api/permission/definition/saving", params).then(nil => {
                // 调用删除关联的专用方法（批量删除）
                reference.setState({$step: 2, $submitting: false});
                // 刷新
                Ux.fn(reference).rxRefresh();
            })
        })
    }
}
/*
 * 添加/删除/下一步
 */
const rxNext = (reference) => ($step = 1, stepData = {}) => {
    const {$removed, ...$stepData} = stepData;
    const $wizard = Ux.clone($stepData);
    // 注意这里需要修正数据，存储的是上一步的数据信息
    const state = {
        $step,
        $wizard,
        $group: $wizard.group // 更新当前操作组
    };

    if ($removed) {
        state.$removed = $removed;
    }
    reference.setState(state);
}
const rxDelete = (reference) => (permId, actionId) => {
    let {$wizard = {}} = reference.state;
    $wizard = Ux.clone($wizard);
    const {permissions = []} = $wizard;
    permissions.filter(item => permId === item.key)
        .forEach((permission) => {
            const foundIndex = Ux.elementIndex(permission.actions, actionId, 'key');
            if (-1 !== foundIndex) {
                // 清空
                permission.actions = Ux.clone(permission.actions)
                    .filter((item, index) => index !== foundIndex);
            }
        });
    $wizard.permissions = Ux.clone(permissions);
    // 已删除的 Action
    let {$removed} = reference.state;
    if (!$removed) {
        $removed = new Set();
    }
    $removed.add(actionId);
    reference.setState({$wizard, $removed});
}
const rxAdd = (reference) => (permId, action) => {
    let {$wizard = {}} = reference.state;
    $wizard = Ux.clone($wizard);
    const {permissions = []} = $wizard;
    permissions.filter(item => permId === item.key)
        .forEach((permission) => {
            const data = Dsl.getArray(permission.actions);
            data.saveElement(action);
            permission.actions = data.to();
        });
    $wizard.permissions = Ux.clone(permissions);
    let {$removed} = reference.state;
    if ($removed) {
        $removed.delete(action.key);
    }
    reference.setState({$wizard, $removed});
}
export default {
    onPrev,
    onNext,
    // 传入时使用
    rxNext,
    rxDelete,
    rxAdd,
}