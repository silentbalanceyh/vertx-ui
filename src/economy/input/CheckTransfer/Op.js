import Ux from 'ux';
import U from 'underscore';

const yiPage = (reference) => {
    const state = {};
    const {config = {}, $source = []} = reference.props;
    // state.$source = $source;
    /*
     * 抽取 jsx 数据（除开 onChange）
     */
    const {onChange, valueKey = "key", ...rest} = config;
    const $transfer = Ux.clone(rest);

    $transfer.onChange = ($targetKeys) => {
        reference.setState({$targetKeys});
        const {onChange} = reference.props;
        if (U.isFunction(onChange)) {
            /*
             * $targetKeys
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
    $transfer.onSelectChange = (sourceKeys, targetKeys) => {
        /*
         * 暂时不考虑右边的选中
         */
        const $sourceKeys = [...sourceKeys, ...targetKeys];
        reference.setState({$sourceKeys});
    };
    /*
     * 处理可选择的 key
     */
    // $transfer.targetKeys = $source.map(item => item.key);
    $transfer.render = (item) => item.label;
    // $transfer.dataSource = $source;
    state.$transfer = $transfer;
    state.$ready = true;
    // state.$sourceKeys = $source.map(item => item.key);
    reference.setState(state);
};
const yuPage = (reference, {prevState, prevProps}) => {
    /*
     * 判断重置专用方法
     */
    Ux.xtReset(reference, {props: prevProps, state: prevState}, ($targetKeys) => {
        /*
         * values 是初始值
         */
        reference.setState({$targetKeys});
    })
};
export default {
    yiPage,
    yuPage,
}