import Ux from "ux";
import Ex from "ex";

export default (state = {}, reference) => {
    const {$current = {}, data = {}} = reference.props;
    /* 读取当前关系 */
    return Ux.ajaxGet('/api/relation/definition/:category', {category: $current.key}).then(response => {
        let $data = Ex.g6GraphicInit(response, {
            data, config: state.$config, reference,
            current: $current
        });
        /* 分开计算 */
        if (!$data.nodes) $data.nodes = [];
        if (!$data.edges) $data.edges = [];
        /* 关系原始数据信息（更新基础） */
        state.$relation = response['relations'];
        state.$data = $data;
        /* 计算 $drop */
        const $dropped = [];
        $data.nodes.forEach(dataItem => $dropped.push(dataItem.data.identifier));
        state.$dropped = $dropped;

        return Ux.promise(state);
    })
}