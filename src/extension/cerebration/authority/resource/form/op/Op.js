import Ux from 'ux';
import wizard from './Op.Wizard';
import event from './Op.Event';
import control from './Op.Control';
import action from './Op.Action';
/*
 * 初始化 resource 专用方法
 */
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
export default {
    /*
     * yiStep2
     * yuStep2
     * yiSelect
     */
    ...wizard,
    /*
     * toData
     * rxConfirm
     * rxDelete
     * rxAdd
     * rxSearch
     * rxSelect
     */
    ...event,
    /*
     * yiWebSource
     * yuWebSource
     * rxSrcSelect
     * rxSrcUnselect
     */
    ...control,

    /*
     * ResAdd -> actions:
     * {
     *     "$opAdd": ??
     *     "$opSave": ??
     *     "$opDelete": ??
     * }
     *
     * Perm -> actions
     * {
     *     "$opSavePerm": ??
     *     "$opStep1": ??
     * }
     *
     * Perm -> done
     * {
     *     "$opBack": ??
     * }
     */
    ...action,
    inResource,
}