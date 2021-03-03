import {Of} from 'app';
import {Dsl} from 'entity';
import Ux from 'ux';

const yiPage = (reference) => {
    const user = Ux.isLogged();
    const state = {};
    const isLogged = (0 < Object.keys(user).length);
    state.$logged = isLogged;
    /* 菜单处理 */
    if (isLogged) {
        Dsl.of(reference).bind(Of.apiMenu).ok(values => {
            state.$menus = values;
            state.$ready = true;
            reference.setState(state);
        }).async()
    } else {
        state.$ready = true;
        reference.setState(state);
    }
}
export default {
    yiPage
}