export default (path, {props}) => {
    const {form} = props;
    const field = path[0];
    if (field) {
        const value = form.getFieldValue(field);
        return value;
    }
}