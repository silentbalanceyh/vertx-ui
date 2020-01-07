import Dt from '../datum';

const formAdvReset = (reference, keys = []) => {
    const {form} = reference.props;
    if (form) {
        if (0 < keys.length) {
            form.resetFields(keys);
        } else {
            form.resetFields();
        }
    } else {
        const ref = Dt.onReference(reference, 1);
        if (ref) {
            formAdvReset(ref, keys)
        }
    }
};

export default {
    formAdvReset
}