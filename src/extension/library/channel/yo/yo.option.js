import Ux from 'ux';

export default (reference) => {
    const {options = {}} = reference.state ? reference.state : {};
    let stateOpt = Ux.clone(options);
    const {$options = {}} = reference.props ? reference.props : {};
    if (!Ux.isEmpty($options)) {
        /*
         * 如果 $options 中存在 identifier
         * 那么该操作会覆盖掉 identifier
         */
        Object.assign(stateOpt, $options);
    }
    return Ux.sorterObject(stateOpt);
}