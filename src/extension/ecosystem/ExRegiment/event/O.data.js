import Ux from "ux";
import U from 'underscore';

const yoSelected = (reference) => {
    const {$data = [], $selected = []} =
        reference.state ? reference.state : {};
    const $keys = Ux.immutable($selected.map(each => each.key));
    return $data.filter(each => $keys.contains(each.key));
};
const yoUnSelected = (reference) => {
    const {$data = [], $selected = []} =
        reference.state ? reference.state : {};
    const $keys = Ux.immutable($selected.map(each => each.key));
    const {fnFilter} = reference.props;
    let result = $data.filter(each => !$keys.contains(each.key));
    if (U.isFunction(fnFilter)) {
        result = result.filter(fnFilter);
    }
    return result;
};
export default {
    yoSelected,
    yoUnSelected,
}