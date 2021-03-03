import Ux from 'ux';

const rxChange = (reference, field) => (event) => {
    const {value} = reference.props;
    let $value = {};
    if (value) {
        Object.assign($value, value);
    }
    $value[field] = Ux.ambEvent(event);
    Ux.fn(reference).onChange($value);
}
export default {
    rxChange
}