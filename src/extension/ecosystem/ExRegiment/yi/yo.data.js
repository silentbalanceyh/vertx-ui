import Ux from 'ux';

export default (reference) => {
    const {$data = [], $selected = []} =
        reference.state ? reference.state : {};
    const $keys = Ux.immutable($selected.map(each => each.key));
    return $data.filter(each => !$keys.contains(each.key));
}