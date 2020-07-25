import auth from './Op.Authorized';
import Ex from 'ex';
import Ux from 'ux';

const yiPage = (reference) => {
    const extract = auth.isAuthorized(reference);
    if (extract) {
        /*
         * 读取当前应用的权限定义集合
         */
        const state = {};
        state.$owner = extract;

        Ex.authRule(reference).then(response => {
            /*
             * grouped
             */
            state.$config = Ux.elementMap(response, 'code');
            state.$ready = true;
            reference.setState(state);
        })
    }
}
export default {
    yiPage,
}