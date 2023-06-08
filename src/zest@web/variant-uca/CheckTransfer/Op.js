import __Zn from '../zero.uca.dependency';

const onChangeSelect = (reference) => (sourceKeys, targetKeys) => {
    /*
     * 暂时不考虑右边的选中
     */
    if (0 === targetKeys.length) {
        /*
         * 选中时回调
         */
        const {config = {}} = reference.props;
        if (config.hasOwnProperty("limit")) {
            /*
             * 选中时的限制
             */
            const {max, message} = config.limit;
            const $sourceKeys = [...sourceKeys, ...targetKeys];
            /*
             * 判断条件
             */
            const {$targetKeys = []} = reference.state;
            if (max >= ($sourceKeys.length + $targetKeys.length)) {
                __Zn.of(reference).in({$sourceKeys}).done();
                // reference.?etState({$sourceKeys});
            } else {
                __Zn.messageFailure(message);
            }
        } else {
            const $sourceKeys = [...sourceKeys, ...targetKeys];
            __Zn.of(reference).in({$sourceKeys}).done();
            // reference.?etState({$sourceKeys});
        }
    } else {
        const $sourceKeys = [...sourceKeys, ...targetKeys];
        __Zn.of(reference).in({$sourceKeys}).done();
        // reference.?etState({$sourceKeys});
    }
};
const onChange = (reference, config = {}) => ($targetKeys) => {
    // reference.?etState({$targetKeys});
    __Zn.of(reference).in({
        $targetKeys
    }).handle(() => {

        const {valueKey = "key"} = config;
        const {onChange, $source = []} = reference.props;
        if (__Zn.isFunction(onChange)) {
            /*
             * $targetKeys，native （Ant Design模式。）
             */
            const items = $source
                .filter(item => $targetKeys.includes(item.key))
                .map(item => item[valueKey]);
            /*
             * items 处理
             */
            onChange(items);
        }
    })
    // const {valueKey = "key"} = config;
    // const {onChange, $source = []} = reference.props;
    // if (__Zn.isFunction(onChange)) {
    //     /*
    //      * $targetKeys，native （Ant Design模式。）
    //      */
    //     const items = $source
    //         .filter(item => $targetKeys.includes(item.key))
    //         .map(item => item[valueKey]);
    //     /*
    //      * items 处理
    //      */
    //     onChange(items);
    // }
};
export default {
    onChange,
    onChangeSelect
}