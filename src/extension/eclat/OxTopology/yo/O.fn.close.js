import Ux from 'ux';

export default (reference) => (event) => {
    Ux.prevent(event);
    const {$metadata = {}, rxChannel} = reference.props;
    if (Ux.isFunction(rxChannel)) {
        const state = {};
        state[$metadata.key] = {
            $dialog: {
                $visible: false,        // 显示和隐藏
                $current: undefined     // 当前记录集
            }
        };
        rxChannel(state);
    }
}