import Ux from 'ux';

const itEdit = (reference, executor) => {
    const {config = {}} = reference.props;
    /*
     * 无默认值
     */
    if (config.editable && Ux.isFunction(executor)) {
        executor(config);
    }
};
const itCombine = (reference, executor) => {
    const {config = {}} = reference.props;
    /*
     * 默认为
     * 1）combine = false
     * 2）条件为 !combine
     */
    const {combine = false} = config;
    if (!combine) {
        const relation = Ux.fromHoc(reference, "relation");
        if (relation && relation.combine) {
            executor(relation.combine);
        }
    }
};
export default {
    itEdit,
    itCombine,
}