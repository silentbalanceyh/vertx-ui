const isGridUpdated = (reference, config = {}) => {
    /**
     * 1.pager检查，如果没有$metadata则是第一次，直接返回true
     */
    console.error(config);
    const {$metadata} = reference.state;
    if (!$metadata) return true;
};
const installMetadata = (reference, config = {}, state = {}) => {
    console.error(state);
    return state;
};
export default {
    isGridUpdated,
    installMetadata
};