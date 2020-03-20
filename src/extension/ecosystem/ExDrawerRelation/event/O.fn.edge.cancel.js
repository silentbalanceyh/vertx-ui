import Ux from 'ux';

export default (reference) => (event) => {
    Ux.prevent(event);
    const {$supplier = {}} = reference.state;
    if (Ux.isFunction($supplier.exEdgeCancel)) {
        $supplier.exEdgeCancel();
    }
    /* 关闭 */
    reference.setState({
        $visible: false,
        $inited: undefined
    });
}