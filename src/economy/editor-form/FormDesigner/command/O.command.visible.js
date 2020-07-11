export default {
    fullscreen: (reference, item, config = {}) => {
        /*
         * 禁用扩展基本规则
         * 1. 当前行还有多余的 span
         * 2. 当前列是最后一列
         */
        const {$status = {}} = reference.props;
        if (24 === $status.used) {
            return false;
        } else {
            const {cellIndex} = config;
            return cellIndex === $status.cells - 1;
        }
    }
}