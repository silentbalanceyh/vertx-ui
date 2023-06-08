import Ex from 'ex';
import Ux from 'ux';

const yiPage = (reference) => {
    /*
     * Extract following parameters from $router
     * Build the json input for aclRegion such as:
     * {
     *     "type": "view -> ROLE | USER",
     *     "owner": "id of role / user"
     * }
     */
    const {$router} = reference.props;
    const state = {};
    const $param = {};
    $param.type = $router._("_view");
    $param.key = $router._("_key");
    $param.data = $router._("_data");
    state.$param = $param;
    Ex.yiAssist(reference, state)
        .then(Ux.ready)
        .then(Ux.pipe(reference));
}
export default {
    yiPage,
}