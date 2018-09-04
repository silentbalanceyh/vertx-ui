import * as Immutable from 'immutable';

const setValue = (reference: any, field: any, value: any) => {
    const {set = {}} = reference.state;
    const $set = Immutable.fromJS(set).toJS();
    $set[field] = value;
    reference.setState({set: $set})
};

const setIcon = (type: any) => ({
    type,
    style: {
        fontSize: 20,
        color: "#1464b4"
    }
});
export default {
    setValue,
    setIcon
}