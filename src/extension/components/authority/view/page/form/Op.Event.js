import Ux from "ux";
import Sd from "../_shared";
import Ex from "ex";

export default {
    $opSave: (reference) => (event) => {
        Ux.prevent(event);
        Sd.doRequest(reference, (selected) => {
            /*
             * 计算 selected
             */
            return Ex.authRequest(reference, Array.from(selected), event => Sd.authEvent(event, reference, (resource = {}) => {
                if (resource) {
                    const {config = {}} = reference.props;
                    const {group = {}} = config;
                    const {visitant = {}} = group.config ? group.config : {};
                    if (!Ux.isEmpty(visitant)) {
                        // 合并赋值
                        const {
                            $keySet, $keyView,
                            $selected = {}
                        } = reference.state;
                        // 资源定位
                        const params = Sd.authDataVisit(reference.state, config, $selected);
                        params.aclVisible = Array.from($keySet);
                        if ($keyView) params.aclView = Array.from($keyView);
                        // 默认是 EAGER：当前
                        params.phase = visitant.phase ? visitant.phase : "EAGER";
                        // 合法性 visitant 追加到 resource
                        resource.visitantData = params;
                        resource.visitant = true;   // true for visitant
                    }
                }
                return resource;
            }));
        });
    },
    isCheckedAll: Sd.isCheckedAll,
    rxCheckAll: Sd.rxCheckAll,
    /* 开关专用函数 */
    rxCheck: (reference, item) => (checked) => {
        let {$keySet, $keyView, $source = []} = reference.state;
        // 系统字段
        const keySet = new Set($keySet ? Array.from($keySet) : []);
        $source.filter(item => "SYSTEM" === item._type).forEach(item => keySet.add(item.key));
        const keyView = new Set();
        if ($keyView) Array.from($keyView).forEach(key => keyView.add(key));
        if (checked) {
            keySet.add(item.key);
        } else {
            keySet.delete(item.key);
            keyView.delete(item.key);
        }
        reference.setState({$keySet: keySet, $keyView: keyView});
    },
    /* 可编辑和只读 */
    rxView: (reference, item) => (checked) => {
        const isEdit = checked.target.value;
        let {$keyView} = reference.state;
        if (isEdit) {
            $keyView.delete(item.key);
        } else {
            $keyView.add(item.key);
        }
        $keyView = new Set(Array.from($keyView));
        reference.setState({$keyView});
    }
}