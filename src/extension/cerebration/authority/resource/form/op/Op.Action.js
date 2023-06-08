import Ex from "ex";
import Ux from "ux";
import {Dsl} from 'entity';
/*
 * 根据现有权限去读取
 */
const fetchActions = (reference, keyArray = []) => {
    if (0 < keyArray.length) {
        return Ux.ajaxPost('/api/action/search', {
            criteria: {
                "permissionId,i": keyArray
            }
        }).then(actions => {
            const {list = []} = actions;
            return Ux.promise(list);
        })
    } else {
        return Ux.promise([]);
    }
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
    Free: {
        actions: {
            $opAdd: (reference) => params => Ex.form(reference).add(params, {
                uri: "/api/permission",
                dialog: "added"
            }),
            $opSave: (reference) => params => Ex.form(reference).save(params, {
                uri: "/api/permission/:key",
                dialog: "saved"
            }),
            $opDelete: (reference) => params => Ex.form(reference).remove(params, {
                uri: "/api/permission/:key",
                dialog: "removed"
            })
        }
    },
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
            /*
             * 1 reference：是当前表单引用
             * 2 reference -> reference：DialogEditor引用
             * 3 reference -> reference -> reference：DialogEditor所属表单引用
             * 所以此处需要执行2级操作
             */
            $opSavePerm: (reference) => (params = {}, config = {}) => {
                const ref = Ux.onReference(reference, 2);
                if (ref) {
                    const {form} = ref.props;
                    const formValues = form.getFieldsValue();
                    /*
                     * permissions 和当前数据执行合并，查看 $mode 信息
                     */
                    const {$mode = Ux.Env.FORM_MODE.ADD, $inited = {}} = reference.props;
                    const {permissions = []} = formValues;
                    /*
                     * 数组处理，执行 Save 操作
                     */
                    const original = Dsl.getArray(permissions);
                    /*
                     * 直接添加 params 到当前系统中
                     */
                    original.saveElement(params)
                    const controlRef = Ux.onReference(reference, 1);
                    if (Ux.Env.FORM_MODE.EDIT === $mode) {
                        /*
                         * 是否执行替换
                         */
                        if (params.key !== $inited.key) {
                            original.removeElement($inited.key);
                        }
                    }
                    Ux.fn(controlRef).onChange(original.to());

                    /*
                     * 还原表单操作，如果是添加则不关闭窗口，仅执行
                     * reset
                     */
                    if (Ux.Env.FORM_MODE.ADD === $mode) {
                        /*
                         * 重置当前表单
                         */
                        Ux.formReset(reference);
                        Ux.of(controlRef).load().handle(() => {
                            /*
                             * 继续添加
                             */
                            const highRef = Ux.onReference(reference, 3);
                            Ux.sexMessage(highRef, "added");
                        })
                        // controlRef.?etState({$loading: false, $submitting: false});
                        // const highRef = Ux.onReference(reference, 3);
                        // Ux.sexMessage(highRef, "added");
                    } else {
                        /*
                         * 编辑模式，直接关闭窗口
                         */
                        Ux.of(controlRef).load().open().handle(() => {
                            const highRef = Ux.onReference(reference, 3);
                            Ux.sexMessage(highRef, "saved");
                        })
                        // controlRef.?etState({$loading: false, $submitting: false, $visible: false});
                        // const highRef = Ux.onReference(reference, 3);
                        // Ux.sexMessage(highRef, "saved");
                    }
                }
            },
            $opStep1: (reference) => (params = {}) => {
                // 第一步
                const {permissions = [], ...rest} = params;
                // 读取当前全县下所有关联的资源
                if (0 === permissions.length) {
                    const ref = Ux.onReference(reference, 1);
                    if (ref) {
                        Ux.sexMessage(ref, "empty");
                    }
                    Ux.of(reference).load().done();
                    // reference.?etState({$loading: false, $submitting: false});
                } else {
                    /*
                     * 新流程，根据最终的 permissions 计算结果
                     * 1）reference 的 props 中 $permissions 为数据库中原始存储的权限
                     * 2）permissions 为输入中的，更新过的新值，新值可能会包含数据库中存储的权限值
                     * 3）$permissions 中包含，而 permissions 中不包含的权限为权限移除
                     * 4）根据合并过后的 permissionId 计算 actions
                     */
                    const {$permissions = []} = reference.props;

                    /*
                     * 请求过程中的ID集
                     */
                    const requestIdSet = new Set();
                    $permissions.map(item => item.key).forEach(key => requestIdSet.add(key));
                    permissions.map(item => item.key).forEach(key => requestIdSet.add(key));
                    const keys = Array.from(requestIdSet);

                    /*
                     * 读取原始的 Action 列表
                     */
                    return fetchActions(reference, keys).then((actions = []) => {
                        // 分组操作
                        const permMap = Ux.elementGroup(actions, "permissionId");
                        // 请求数据
                        const input = Ux.clone(rest);
                        const inputPerms = Ux.clone(permissions);
                        inputPerms.forEach(permission => {
                            const actions = permMap[permission.key];
                            if (actions) {
                                permission.actions = actions;
                            }
                        })
                        input.permissions = inputPerms;
                        // 下一步执行
                        Ux.of(reference).load().handle(() => {
                            // 将删除数据放到 input 中，需要执行 $removed 的操作
                            {
                                const $removedPerm = new Set();
                                const {$permissions = []} = reference.props;
                                /*
                                 * 原始 $permissions 中包含了数据，而新请求中不包含该数据
                                 */
                                $permissions.forEach(item => $removedPerm.add(item.key));
                                inputPerms.forEach(item => $removedPerm.delete(item.key));

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
                        // reference.?etState({$loading: false, $submitting: false});
                        // {
                        //     const $removedPerm = new Set();
                        //     const {$permissions = []} = reference.props;
                        //     $permissions.forEach(item => $removedPerm.add(item.key));
                        //     inputPerms.forEach(item => $removedPerm.delete(item.key));
                        //
                        //     const $removed = new Set();
                        //     Array.from($removedPerm).forEach(permissionKey => {
                        //         if (permMap[permissionKey]) {
                        //             const actions = permMap[permissionKey];
                        //             actions.forEach(action => $removed.add(action.key));
                        //         }
                        //     });
                        //     input.$removed = $removed;
                        // }
                        // Ux.fn(reference).rxNext(1, input);
                    })
                }
            }
        }
    }
}