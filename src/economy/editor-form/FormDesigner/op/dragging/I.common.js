export default {
    /*
     * Hover 放上去的时候，Target 变色处理
     * 只执行一次 $hover 的开关操作
     */
    dropColor: (reference, isOver) => {
        const state = reference.state ? reference.state : {};
        if (isOver) {
            /*
             * 悬停在 Drop 组件
             */
            const {$hover} = state;
            if (!$hover) {
                reference.setState({$hover: true})
            }
        } else {
            /*
             * 离开了 Drop 组件
             */
            const {$hover} = state;
            if ($hover) {
                reference.setState({$hover: false});
            }
        }
    },
    itemRow: (props) => {
        const item = {};
        const {config = {}} = props;
        item.rowIndex = config.rowIndex;
        item.key = config.key;
        return item;
    },
    itemRowSame: (left, right) => {
        if (left && right) {
            return left.rowIndex === right.rowIndex;
        } else return true;
    },
}