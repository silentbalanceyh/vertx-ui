import Ux from 'ux';

const fnEdit = (reference) => (line, text) => (event) => {
    event.preventDefault();
    Ux.fadeIn(reference);
    const ref = reference.props.reference;
    if (ref) {
        ref.setState({$_editKey : text});
    }
};
const fnRemove = (reference) => (line, text) => (event) => {
    event.preventDefault();
    const {$items} = reference.props;
    if ($items) $items.removeElement(text);
    const state = {};
    if (line.dataPath) {
        state[line.dataPath] = $items.to();
        Ux.writeTree(reference, state);
    }
};
export default {
    fnEdit,
    fnRemove
}
