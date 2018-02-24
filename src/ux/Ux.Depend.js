import Prop from './Ux.Prop'

const dependReadOnlyDatum = (reference, sourceKey, filterFun, formField) => {
    const items = Prop.onDatum(reference, sourceKey);
    let filtered = items.filter(filterFun);
    const {form} = reference.props;
    const current = form.getFieldValue(formField);
    filtered = filtered.filter(item => item.key === current);
    return 0 < filtered.length;
};
export default {
    dependReadOnlyDatum
};
