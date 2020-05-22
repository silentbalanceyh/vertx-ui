import Ux from 'ux';
import Event from './event';

const yiPage = (reference) => {
    const state = {};
    const {config = {}} = reference.props;
    // state.$source = $source;
    /*
     * 抽取 jsx 数据（除开 onChange）
     */
    const {...rest} = config;
    const $transfer = Ux.clone(rest);

    $transfer.onChange = Event.onChange(reference, config);
    $transfer.onSelectChange = Event.onSelectChange(reference, config);
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