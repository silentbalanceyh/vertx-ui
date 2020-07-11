import Ux from 'ux';
import wizard from './Op.Wizard';
import event from './Op.Event';
import Ex from "ex";

const inResource = (params = {}, reference) => {
    /*
     *  读取资源信息
     *  resource: {
     *      action:{
     *
     *      }
     *  }
     */
    const {action = {}, ...rest} = params;
    const input = Ux.clone(rest);
    {
        if (rest['modeGroup']) {
            // 启用了用户组
            input.isGroup = true;
        }
        if (rest['modeTree']) {
            // 启用了继承
            input.isInherit = true;
        }
        input.actionName = action.name;
        input.actionCode = action.code;
        input.actionUri = action.uri;
        input.actionMethod = action.method;
        input.actionKey = action.key;
        // identifier -> modelKey
        const model = Ux.elementUniqueDatum(reference,
            'resource.models', 'identifier', input.identifier);
        if (model) {
            input.modelKey = model.key;
        }

    }
    return input;
}
const outResource = (params = {}, reference, isAdd = true) => {
    const {
        actionName,
        actionCode,
        actionUri,
        actionMethod,
        ...rest
    } = params;
    const input = Ux.clone(rest);
    let normalized = {};
    if (isAdd) {
        Object.assign(normalized, input);
    } else {
        const {$inited = {}} = reference.props;
        Object.assign(normalized, $inited, input);
    }

    const action = {};
    action.name = actionName;
    action.code = actionCode;
    action.uri = actionUri;
    action.method = actionMethod;
    if (normalized.action) {
        Object.assign(normalized.action, action);
    } else {
        normalized.action = action;
    }
    return normalized;
}
export default {
    ...wizard,
    ...event,
    inResource,
    ResAdd: {
        actions: {
            $opAdd: (reference) => params => Ex.form(reference).add(outResource(params, reference), {
                uri: "/api/resource",
                dialog: "added",
            }),
            $opSave: (reference) => params => Ex.form(reference).save(outResource(params, reference, false), {
                uri: "/api/resource/:key",
                dialog: "saved"
            }),
            $opDelete: (reference) => params => Ex.form(reference).remove(params, {
                uri: "/api/resource/:key",
                dialog: "removed"
            })
        }
    },
    Perm: {
        done: {
            $opBack: (reference) => (event) => {
                Ux.prevent(event);
                Ux.fn(reference).rxBack();
            }
        },
        actions: {
            $opStep1: (reference) => (params = {}) => {
                // 第一步
                const {permissions = [], ...rest} = params;
                // 读取当前全县下所有关联的资源
                if (0 === permissions.length) {
                    const ref = Ux.onReference(reference, 1);
                    if (ref) {
                        Ux.sexMessage(ref, "empty");
                    }
                    reference.setState({$loading: false, $submitting: false});
                } else {
                    const {$permissions = []} = reference.props;
                    Ux.ajaxPost("/api/action/search", {
                        criteria: {
                            "permissionId,i": $permissions.map(item => item.key)
                        }
                    }).then((actions = {}) => {
                        const {list = []} = actions;
                        // 分组操作
                        const permMap = Ux.elementGroup(list, "permissionId");

                        const input = Ux.clone(rest);
                        const inputPerms = Ux.clone(permissions);
                        inputPerms.forEach(permission => {
                            if (permMap[permission.key]) {
                                permission.actions = Ux.clone(permMap[permission.key]);
                            }
                        });
                        input.permissions = inputPerms;
                        // 下一步处理
                        reference.setState({$loading: false, $submitting: false});
                        // 将删除数据放到 input 中，需要执行 $removed 的注入
                        {
                            const $removedPerm = new Set();
                            $permissions.forEach(item => $removedPerm.add(item.key));
                            inputPerms.forEach(keeped => $removedPerm.delete(keeped.key));

                            const $removed = new Set();
                            Array.from($removedPerm).forEach(permissionKey => {
                                if (permMap[permissionKey]) {
                                    const actions = permMap[permissionKey];
                                    actions.forEach(action => $removed.add(action.key));
                                }
                            });
                            input.$removed = $removed;
                        }
                        Ux.fn(reference).rxNext(1, input);
                    })
                }
            }
        }
    }
}