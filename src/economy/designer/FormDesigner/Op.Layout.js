import Immutable from 'immutable';
import Ux from 'ux';

const rowAdd = (reference) => (event) => {
    event.preventDefault();
    let {rows = []} = reference.state;
    rows = Immutable.fromJS(rows).toJS();
    const item = {};
    item.key = Ux.randomString(29);
    rows.push(item);
    reference.setState({rows});
};
const rowRemove = (reference, key) => (event) => {
    event.preventDefault();
    let {rows = []} = reference.state;
    rows = Immutable.fromJS(rows).toJS();
    rows = rows.filter(item => item.key !== key);
    reference.setState({rows});
};
const colSelect = (reference) => (event) => {
    reference.setState({columns: parseInt(event, 10)});
};
export default {
    rowRemove,
    rowAdd,
    colSelect,
    // 生成key
    generateKey: (length) => Ux.randomString(29)
};