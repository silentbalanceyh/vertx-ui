import Ux from 'ux';

const _opSubmit = (reference) => (params = {}) => {
    const ref = Ux.onReference(reference, 2);
    ref.setState({json: params});
    reference.setState({$loading: false, $submitting: false});
    return Ux.promise(params);
};
export default {
    $opAdd: _opSubmit,
    $opSave: _opSubmit
}