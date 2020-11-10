import Abs from "../abyss";
import Ele from '../element';

const xtAntRowU = (reference, rowKey, field) => (event) => {
    let {value = []} = reference.props;
    if (Abs.isArray(value) && rowKey && field) {
        value = Abs.clone(value);
        const fieldValue = Ele.ambEvent(event);
        value.forEach(each => {
            if (rowKey === each.key) {
                each[field] = fieldValue;
            }
        });
        Abs.fn(reference).onChange(value);
    }
}
export default {
    xtAntRowU
}