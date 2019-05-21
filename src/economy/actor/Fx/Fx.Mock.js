const isMock = (reference, options = {}) => {
    let mock = false;
    if (options['mock.enabled']) {
        const {$list} = reference.props;
        if (!$list) {
            mock = true;
        }
    }
    return mock;
};
export default {
    isMock
};