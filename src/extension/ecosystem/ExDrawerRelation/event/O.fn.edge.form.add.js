import Ux from "ux";

export default (reference) => (input = {}) => {
    const {$supplier = {}} = reference.state;
    /*
     * 改变关系窗口
     */
    if (Ux.isFunction($supplier.exEdgeAdd)) {
        const {config = {}} = reference.props;
        if (config.init) {
            const types = Ux.onDatum(reference, config.init.types);
            const type = types.filter(item => item.code === input.type)[0];
            if (type) {
                $supplier.exEdgeAdd(type.name);
            }
        }
    }
    reference.setState({$visible: false, $inited: undefined});
}