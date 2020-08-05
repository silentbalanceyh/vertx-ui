import Ux from "ux";
import Visit from './I.group.visitant';

export default {
    isCheckedAll: (reference) => {
        const {$source = [], $keySet} = reference.state;
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
            const $keyView = new Set();
            reference.setState({$keySet, $keyView});
        }
    },
    authEvent: (event, reference, fnResource) => {
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
                .forEach(resourceId => {
                    if (Ux.isFunction(fnResource)) {
                        $event[resourceId] = fnResource(event[resourceId], reference);
                    } else {
                        $event[resourceId] = event[resourceId];
                    }
                });
        }
        return $event;
    },
    authDataVisit: Visit.authDataVisit,
}