import Cmn from './I.common';

export default (expression, {props}) => Cmn.fnPredicate("FORM", expression, () => {
    const {form} = props;
    return form.getFieldValue(expression);
});