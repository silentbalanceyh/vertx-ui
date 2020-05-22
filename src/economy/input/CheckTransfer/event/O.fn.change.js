import U from "underscore";
import Ux from "ux";

export default (reference, config = {}) => ($targetKeys) => {
    reference.setState({$targetKeys});
    const {valueKey = "key"} = config;
    const {onChange, $source = []} = reference.props;
    if (U.isFunction(onChange)) {
        /*
         * $targetKeys，native （Ant Design模式.
         * ）
         */
        const $keys = Ux.immutable($targetKeys);
        const items = $source
            .filter(item => $keys.contains(item.key))
            .map(item => item[valueKey]);
        /*
         * items 处理
         */
        onChange(items);
    }
};