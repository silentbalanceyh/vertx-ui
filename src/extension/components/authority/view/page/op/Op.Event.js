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
            return Ex.authRequest(reference, Array.from(selected),
                event => Sd.authEvent(event, reference, (resource = {}) => {
                    if (resource) {
                        const {config = {}} = reference.props;
                        const {group = {}} = config;
                        const {visitant = {}} = group.config ? group.config : {};
                        if (!Ux.isEmpty(visitant)) {
                            // 合并赋值
                            const {
                                $keySet,
                                $selected = {}
                            } = reference.state;
                            // 资源定位
                            const params = Sd.authDataVisit(reference.state, config, $selected);

                            // 修改掉运算
                            const $opSet = new Set();
                            const {$source = []} = reference.state ? reference.state : {};
                            $source.filter(item => $keySet.has(item.key)).forEach(item => {
                                if (Ux.isArray(item.data)) {
                                    item.data.forEach(key => $opSet.add(key));
                                }
                            })

                            params.aclVisible = Array.from($opSet);
                            // 默认是 EAGER：当前
                            params.phase = visitant.phase ? visitant.phase : "EAGER";
                            // 合法性 visitant 追加到 resource
                            resource.visitantData = params;
                            resource.visitant = true;   // true for visitant
                        }
                    }
                    return resource;
                }))
        });
    },
    isCheckedAll: Sd.isCheckedAll,
    rxCheckAll: (reference) => (event) => {
        const checked = event.target.checked;
        const {$source = []} = reference.state;
        if (checked) {
            // 全部选中
            const $keySet = new Set($source.map(item => item.key));
            reference.setState({$keySet});
        } else {
            // 全部取消选中
            const checked = $source
                .filter(item => "SYSTEM" === item._type)
                .map(item => item.key);
            const $keySet = new Set(checked);
            const $keyView = new Set();
            reference.setState({$keySet, $keyView});
        }
    },
    rxCheck: (reference, item) => (checked) => {
        let {$keySet} = reference.state;
        const isChecked = checked.target.checked;
        const keySet = new Set($keySet ? Array.from($keySet) : [])
        if (isChecked) {
            keySet.add(item.key);
        } else {
            keySet.delete(item.key);
        }
        reference.setState({$keySet: keySet});
    }
}