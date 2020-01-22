import Ux from 'ux';

export default (reference) => {
    const {options = {}} = reference.state ? reference.state : {};
    let stateOpt = Ux.clone(options);
    const {$options = {}} = reference.props ? reference.props : {};
    if (!Ux.isEmpty($options)) {
        Object.assign(stateOpt, $options);
    }
    return Ux.sorterObject(stateOpt);
}