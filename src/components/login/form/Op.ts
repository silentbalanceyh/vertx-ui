// @ts-ignore
import {Of} from 'app';
// @ts-ignore
import {Dsl} from 'entity';
// @ts-ignore
import Ux from 'ux';
import Yi from './Op.Yi';

const $opLogin = (reference: any) => {
    /* 变更登录（二次跳转）*/
    const ref = Ux.onReference(reference, 1);
    ref.setState({$loading: true});
    return Dsl.of(reference).bind(Of.apiLogin).ok(values => {
        /* 登录用户 */
        Ux.storeUser(values);
        Ux.writeTree(reference, {user: values})
        if (ref) {
            /* */
            Dsl.of(reference).bind(Of.apiMenu).ok(values => {
                const state: any = {};
                state.$menus = values;
                state.$logged = true;
                state.$loading = false;
                ref.setState(state);
            }).async()
        } else {
            console.error("无顶层应用！");
        }
    }).to();
}
export default {
    $opLogin,
    ...Yi,
}