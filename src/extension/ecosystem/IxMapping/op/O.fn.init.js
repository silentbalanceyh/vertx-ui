import Cmn from './O.common';
import Ux from 'ux';

export default (reference) => {
    const {$identifier} = reference.props;
    /* 根节点专用 */
    if ($identifier) {
        /* 根节点模型字段属性信息 */
        return Cmn.onStore(reference).init($identifier)
            .then(fetched => {
                const state = {};
                state.$stored = fetched;
                /* 存储节点信息 */
                return Ux.promise(state);
            })
            .then(state => {
                state.$alert = Ux.fromHoc(reference, "alert");
                return Ux.promise(state)
            });
    } else {
        const state = {};
        state.$ready = true;
        reference.setState(state);
    }
}