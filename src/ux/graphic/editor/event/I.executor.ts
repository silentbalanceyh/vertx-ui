import Abs from "../../../abyss";
import Dev from '../../../develop';
import Fn from '../func';

const onEdgeRemove = (gEvent, params: any = {}) => {
    Dev.dgGraphic(params, " I onEdgeRemove");
    const {model, hide} = params;
    /* 隐藏 */
    if (Abs.isFunction(hide)) hide();

    if (model) {
        /* 移除元素 */
        gEvent.g6Remove(model);
    }
};
const onNodeRemove = (gEvent, params: any = {}) => {
    Dev.dgGraphic(params, " I onNodeRemove");
    const {model = {}, hide} = params;
    if (model.data && model.data.identifier) {
        const {identifier} = model.data;
        /* 删除 $dropped 节点 */
        gEvent.rsDropRemove(identifier);
        /* 隐藏 */
        if (Abs.isFunction(hide)) hide();
        /* 移除元素 */
        gEvent.g6Remove(model);
    }
};
const onAfterAddItem = (gEvent, params: any = {}) => {
    Dev.dgGraphic(params, " I onAfterAddItem");
    const {model, item} = params;
    const type = item.getType();
    if ("node" === type) {
        if (model.data && model.data.identifier) {
            const {identifier} = model.data;
            /* 增加 identifier 中的 $dropped 节点 */
            gEvent.rsDropAdd(identifier);
        }
    }
};
const onAfterEachAnchorActive = (gEvent, params: any = {}) => {
    const {target} = params;
    gEvent.g6Forbidden(target);
};
const onWindowClose = (gEvent, params: any = {}) => {
    /* 读取 Source（已存储于 gEvent 中 */
    const type = gEvent.dataSource("types");
    const typeMap = Fn.g6DataEdgeType(type);
    /* 更新当前 model */
    const model = gEvent.dataFocus();
    gEvent.g6Update(model, {
        label: typeMap[params.type],
        data: params,
        id: params.key,
    });
    /* 关闭窗口 */
    gEvent.rsClose();
};
const onWindowCancel = (gEvent, event: any) => {
    /* 关闭窗口 */
    const model = gEvent.dataFocus();
    /* 移除 */
    gEvent.g6Remove(model);
    /* 关闭窗口 */
    gEvent.rsClose();
};
export default {
    /*
     * 两个窗口专用函数
     */
    onWindowClose,
    onWindowCancel,
    /*
     * 其他专用函数
     */
    onEdgeRemove,
    onNodeRemove,
    onAfterAddItem,
    onAfterEachAnchorActive
};