import Ux from 'ux';
import renders from './Op.render';

export default {
    attrAdd: (reference) => (event) => {
        Ux.prevent(event);
        const added = {
            key: Ux.randomUUID()
        }
        let {value = []} = reference.props;
        value = Ux.clone(value);
        value.push(added);
        Ux.fn(reference).onChange(value);
    },
    attrDel: (reference, key) => (event) => {
        Ux.prevent(event);
        const {value = []} = reference.props;
        const updated = value.filter(item => key !== item.key);
        Ux.fn(reference).onChange(updated);
    },
    ...renders,
}