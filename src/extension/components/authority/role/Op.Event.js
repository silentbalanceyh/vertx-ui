import Ux from 'ux';

const $opSelect = (reference) => (data = {}) => {
    const $role = Ux.clone(data);
    reference.setState({$role});
}
const $opClean = (reference) => (event) => {
    Ux.prevent(event);
    reference.setState({$role: undefined});
}
const $opNav = (reference) => (event) => {
    Ux.prevent(event);
}
const $opSave = (reference) => (event) => {

}
export default {
    $opSelect,
    $opNav,
    $opClean,
    $opSave,
}