import Ux from 'ux';

const fnEdit = (reference) => (line, text) => (event) => {
    event.preventDefault();
    Ux.fadeIn(reference);
    const ref = reference.props.reference;
    if (ref) {
        ref.setState({$_editKey: text});
        const {fnEdit} = reference.props;
        if (fnEdit) {
            fnEdit(text);
        }
    }
};
const fnRemove = (reference) => (line, text) => (event) => {
    event.preventDefault();
    const {fnRemove} = reference.props;
    // 传入了fnRemove则自定义
    if (fnRemove) {
        fnRemove(text);
    } else {
        const {$items} = reference.props;
        if ($items) $items.removeElement(text);
        const state = {};
        if (line.dataPath) {
            state[line.dataPath] = $items.to();
            // Redux触发才使用
            if (reference.props.fnOut) {
                Ux.writeTree(reference, state);
            }
        }
    }
};
export default {
    fnEdit,
    fnRemove
};
