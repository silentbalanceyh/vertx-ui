import Ux from 'ux';

const rxChange = (reference) => (content) => {
    const {onChange} = reference.props;
    if (Ux.isFunction(onChange)) {
        const body = content.jsObject;
        if (body) {
            onChange(body);
        }
    }
};
export default {
    rxChange,
}