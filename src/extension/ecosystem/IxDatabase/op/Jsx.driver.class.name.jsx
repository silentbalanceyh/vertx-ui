import Ux from 'ux';

export default (reference, jsx) => {
    const {value = {}} = reference.props;
    if ("MYSQL" === value.category) {
        return Ux.aiOn(Ux.aiSelect).onChange(reference, {
            optionJsx: jsx,
            field: "driverClassName"
        });
    } else {
        jsx.readOnly = true;
        return Ux.aiInput(reference, jsx);
    }
}