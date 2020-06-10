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
    item: (props) => {
        const item = {};
        const {config = {}} = props;
        item.rowIndex = config.rowIndex;
        if (config.rowKey) {
            item.rowKey = config.rowKey;
        }
        item.key = config.key;
        if (config.hasOwnProperty('cellIndex')) {
            item.cellIndex = config.cellIndex;
        }
        if (config.hasOwnProperty("span")) {
            item.span = config.span;
        }
        if (config.render) {
            item.render = config.render;
        }
        if (props.data) {
            item.raft = props.data;
        }
        return item;
    },
    itemRowSame: (left, right) => {
        if (left && right) {
            return left.rowIndex === right.rowIndex;
        } else return true;
    },
    itemCellSame: (left, right) => {
        if (left && right) {
            return (left.rowIndex === right.rowIndex
                && left.cellIndex === right.cellIndex)
        } else return true;
    }
}