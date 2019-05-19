const isMock = (reference, options = {}) => {
    const {$mockData = {}} = reference.props;
    let mock = false;
    if (options['mock.enabled'] && $mockData.mock) {
        const {$list} = reference.props;
        if (!$list) {
            mock = true;
        }
    }
    return mock;
};
export default {
    isMock
}