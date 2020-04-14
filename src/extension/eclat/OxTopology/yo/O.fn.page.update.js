import Ux from 'ux';
import yiPage from './O.fn.page';

export default (reference, virtualRef) => {
    const previous = virtualRef.props.$inited;
    const current = reference.props.$inited;
    if (previous && current) {
        /*
         * 条件变化
         * up / down
         */
        if (Ux.isArray(previous.up) && Ux.isArray(current.up)) {
            if (current.up.length !== previous.up.length
                && Ux.isDiff(current.up, previous.up)) {
                /*
                 * up 条件变化
                 */
                reference.setState({$ready: false});
                yiPage(reference);
            }
        }
        if (Ux.isArray(previous.down) && Ux.isArray(current.down)) {
            if (current.down.length !== previous.down.length
                && Ux.isDiff(current.down, previous.down)) {
                /*
                 * down 条件变化
                 */
                reference.setState({$ready: false});
                yiPage(reference);
            }
        }
    }
}