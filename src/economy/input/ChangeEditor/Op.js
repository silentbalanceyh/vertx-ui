import U from 'underscore';
import Ux from 'ux';

const on2Change = (reference, key) => (event) => {
    if (U.isFunction(event.preventDefault)) event.preventDefault();
    const text = event.target.value;
    if (text && key) {
        const value = {};
        value[key] = text;
        reference.setState(value);
        Ux.xtChange(reference, value);
    }
};

export default {
    on2Change
};
