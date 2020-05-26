import Ux from 'ux';

export default {
    onCheck: (reference) => (checked) => {
        const $checked = Ux.ambEvent(checked);
        reference.setState({$checked});
    }
}