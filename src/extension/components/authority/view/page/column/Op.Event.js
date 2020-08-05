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
                event => Sd.authEvent(event, reference))
        });
    },
    isCheckedAll: Sd.isCheckedAll,
    rxCheckAll: Sd.rxCheckAll,
    rxCheck: (reference) => (keys = []) => {
        const {$source = []} = reference.state;
        const $keySet = new Set($source.filter(item => "SYSTEM" === item._type).map(item => item.key));
        // 然后追加 keys
        keys.forEach(key => $keySet.add(key));
        reference.setState({$keySet});
    }
}