import Ux from 'ux';

export default (reference, item = {}) => (event) => {
    Ux.prevent(event);
    let {$selected = []} = reference.state ? reference.state : {};
    $selected = Ux.clone($selected);
    $selected = $selected.filter(each => each.key !== item.key);
    reference.setState({$selected});
}