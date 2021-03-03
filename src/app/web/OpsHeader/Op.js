import Ux from "ux";
import {Dsl} from 'entity';
import Of from '../../action/Of';
import Event from './Op.Event';

const yiSelected = (reference, state = []) => {
    const menus = state.$menus;
    const module = Ux.toQuery("mid");
    let menu;
    if (module) {
        menu = Ux.elementUnique(menus, "key", module);
    } else {
        menu = menus[0];
    }
    if (menu) {
        state.$module = menu.key;
        reference.setState(state);
        const ref = Ux.onReference(reference, 1);
        ref.setState({$identifier: menu.key, $navTop: menu, $navLeft: undefined});
    }
}

const yiPage = (reference) => {
    const state = {};
    const user = isLogged();
    Object.assign(state, user);
    const {$nav = false} = reference.props;
    if ($nav) {
        Dsl.of(reference).bind(Of.apiMenu).ok(response => {
            state.$menus = response;
            /* 父类菜单处理 */
            yiSelected(reference, state);
        }).async()
    } else {
        reference.setState(state);
    }
}
const isLogged = () => {
    const user = Ux.isLogged();
    if (0 === Object.keys(user).length) {
        return ({$logged: false});
    } else {
        return ({$logged: true});
    }
}
const yuPage = (reference, virtualRef) => {
    const {$user} = reference.props;
    const $previous = virtualRef.props.$user;
    /* 登录的判断 */
    if (!$previous.is() && $user.is()) {
        reference.setState(isLogged())
    }
    /* 已经登录 */
    if ($previous.is() && !$user.is()) {
        reference.setState(isLogged())
    }
    /* 刷新注销 */
    const {$logged} = reference.state;
    if ($logged) {
        if (!$previous.is() && !$user.is()) {
            reference.setState(isLogged())
        }
    }
}
export default {
    yiPage,
    yuPage,
    ...Event
}