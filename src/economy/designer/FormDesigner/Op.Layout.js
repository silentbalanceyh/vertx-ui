import randomjs from 'random-js';
import Immutable from 'immutable';

const generateKey = (length = 8) => {
    const engine = randomjs.engines.mt19937().autoSeed();
    return randomjs.string()(engine, length);
};
const rowAdd = (reference) => (event) => {
    event.preventDefault();
    let {rows = []} = reference.state;
    rows = Immutable.fromJS(rows).toJS();
    const item = {};
    item.key = generateKey(29);
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
    generateKey
};