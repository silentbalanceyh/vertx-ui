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
            return Ex.authRequest(reference, Array.from(selected), event => {
                const $event = {};
                const {$resources} = reference.state;
                if ($resources) {
                    const resKey = new Set();
                    if (Ux.isArray($resources)) {
                        $resources.forEach(resource => resKey.add(resource));
                    } else {
                        resKey.add($resources);
                    }
                    Object.keys(event).filter(key => resKey.has(key))
                        .forEach(resourceId => $event[resourceId] = event[resourceId]);
                }
                return $event;
            });
        });
    },
    isCheckedAll: (reference) => {
        const {$source = [], $keySet = new Set()} = reference.state;
        const business = $source.filter(item => "SYSTEM" !== item._type).map(item => item.key);
        const filtered = business.filter(item => $keySet.has(item));
        return filtered.length === business.length;
    },
    rxCheckAll: (reference) => (event) => {
        const checked = event.target.checked;
        const {$source = []} = reference.state;
        if (checked) {
            // 全部选中
            const $keySet = new Set($source.map(item => item.key));
            reference.setState({$keySet});
        } else {
            // 全部取消选中
            const $keySet = new Set([]);
            reference.setState({$keySet});
        }
    },
    rxCheck: (reference) => (keys = []) => {
        const {$source = []} = reference.state;
        const $keySet = new Set($source.filter(item => "SYSTEM" === item._type).map(item => item.key));
        // 然后追加 keys
        keys.forEach(key => $keySet.add(key));
        reference.setState({$keySet});
    }
}