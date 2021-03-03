import Ux from 'ux';

const onSelected = (reference) => (menu) => {
    reference.setState({$module: menu.key})
    const ref = Ux.onReference(reference, 1);
    const $identifier = menu.key;
    const {data = {}} = menu.item.props;
    ref.setState({$identifier, $navTop: data, $navLeft: undefined});
    Ux.toRoute(reference, Ux.Env.ENTRY_ADMIN, {mid: menu.key, pid: undefined});
}
export default {
    onSelected
}