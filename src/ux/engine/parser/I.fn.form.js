import Cmn from './I.common';

export default (expression, {props}) => Cmn.fnPredicate("FORM", expression, () => {
    const {form} = props;
    if (form) {
        return form.getFieldValue(expression);
    }
});