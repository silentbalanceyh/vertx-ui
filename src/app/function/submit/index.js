import Ux from 'ux';

export default {
    $opAdd: (reference) => (params = {}) => {
        const ref = Ux.onReference(reference, 2);
        ref.setState({json: params});
        return Ux.promise(params);
    }
}