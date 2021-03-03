import Ux from "ux";

const yiPage = (reference) => {
    const user = Ux.isLogged();
    if (0 === Object.keys(user).length) {
        reference.setState({$logged: false});
    } else {
        reference.setState({$logged: true});
    }
}
const yuPage = (reference, virtualRef) => {
    const {$user} = reference.props;
    const $previous = virtualRef.props.$user;
    /* 登录的判断 */
    if (!$previous.is() && $user.is()) {
        yiPage(reference);
    }
    /* 已经登录 */
    if ($previous.is() && !$user.is()) {
        yiPage(reference);
    }
    /* 刷新注销 */
    const {$logged} = reference.state;
    if ($logged) {
        if (!$previous.is() && !$user.is()) {
            yiPage(reference);
        }
    }
}
export default {
    yiPage,
    yuPage
}