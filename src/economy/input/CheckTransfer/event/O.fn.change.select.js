import Ux from "ux";

export default (reference) => (sourceKeys, targetKeys) => {
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
                reference.setState({$sourceKeys});
            } else {
                Ux.messageFailure(message);
            }
        } else {
            const $sourceKeys = [...sourceKeys, ...targetKeys];
            reference.setState({$sourceKeys});
        }
    } else {
        const $sourceKeys = [...sourceKeys, ...targetKeys];
        reference.setState({$sourceKeys});
    }
};