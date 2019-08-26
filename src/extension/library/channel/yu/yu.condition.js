import Fn from '../../functions';
import Ux from 'ux';

export default (reference, virtualRef) => {
    /*
     * 先检查 $condition 是否有变化
     */
    const prevProps = virtualRef.props;
    const props = reference.props;
    /*
     * 默认的 $condition
     */
    const $defaultCond = Fn.upCondition(props, prevProps);
    if ($defaultCond) {
        /*
         * 外层组件引起的变化
         */
        const $condition = $defaultCond.current;
        reference.setState({$condition});
    } else {
        const prevState = Fn.state(virtualRef);
        const state = Fn.state(reference);
        /*
         * 检查 $condition
         */
        const checked = Fn.upCondition(state, prevState);
        if (checked) {
            const {current = []} = checked;
            /*
             * 使用新的 $condition
             */
            Ux.dgDebug(checked, "[ ExU ] $condition 改变");
            /*
             * 读取 condition 专用配置，列变更时会使用的配置，直接从 state 中读取
             */
            Fn.rx(reference).condition(current);
        }
    }
}