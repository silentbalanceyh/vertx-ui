import Ux from 'ux';
import rxSubmit from './Op.Submit';

const rxAdd = (reference) => (event) => {
    Ux.prevent(event);
    let {$data = []} = reference.state;
    $data = Ux.clone($data);
    $data.push({key: Ux.randomUUID()});
    reference.setState({$data});
};
const rxRemove = (reference, key) => (event) => {
    Ux.prevent(event);
    let {$data = []} = reference.state;
    $data = Ux.clone($data);
    $data = $data.filter(item => key !== item.key);
    reference.setState({$data});
};
const rxChange = (reference, record) => (select) => {
    let {$data = []} = reference.state;
    $data = Ux.clone($data);
    $data.filter(item => record === item.key).forEach(each => {
        each.name = select; // 根据字段选择
        if (!each.hasOwnProperty('value')) {
            delete each.value;  // 清空值
        }
    });
    reference.setState({$data});
};
const rxInput = (reference, key) => (event) => {
    const text = Ux.ambiguityEvent(event);
    let {$data = []} = reference.state;
    $data = Ux.clone($data);
    $data.filter(item => key === item.key).forEach(each => each.value = text);
    reference.setState({$data});
};
export default {
    rxAdd,
    rxRemove,
    rxChange,
    rxSubmit,
    rxInput,
}