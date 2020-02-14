import Ux from "ux";

export default (reference, keys = [], key) => {
    const data = reference.state.$data;
    /*
     * 选择的 keys 的记录处理
     */
    let relations = [];
    if (Ux.isArray(data.up) && Ux.isArray(data.down)) {
        const $keys = Ux.immutable(keys);
        /*
         * 上下互斥
         */
        if ("up" === key) {
            relations = data.up.filter(item => $keys.contains(item.key));
        } else {
            relations = data.down.filter(item => $keys.contains(item.key));
        }
    }
    return relations.map(item => item.key);
}