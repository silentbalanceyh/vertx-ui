import {connect} from "react-redux";
import __Zn from './zero.module.dependency';
import {HocI18n} from 'zmr';

const annoI18nName = (target, options = {}) => {
    let fullname;
    if (options.hasOwnProperty("i18n.cab") && options.hasOwnProperty("i18n.name")) {
        const cab = options["i18n.cab"];
        const name = options["i18n.name"];
        if (name && cab) {
            // 参数严格检查
            __Zn.fxTerminal(!cab || !cab.hasOwnProperty("ns"), 10061, cab, "ns");
            __Zn.fxTerminal(!name, 10062, name);
            fullname = cab['ns'] + "/" + name;
            if (target) target.displayName = fullname;
        }
    }
    return fullname;
}
const annoConnect = (target, options = {}) => {
    if (options.connect) {
        const s2p = options.connect.s2p;
        const d2p = options.connect.d2p;
        /*
         * 基本代码逻辑
         * 如果没有d2p，则仅使用State -> Prop
         * 否则使用State -> Prop和Dispatch -> Prop
         *
         * 新增 options 解决问题：
         * Function components cannot be given refs. Attempts to access this ref will fail.
         * Did you mean to use React.forwardRef()
         */
        if (!d2p) {
            target = connect(s2p, {},
                null, {forwardRef: true})(target);
        } else {
            target = connect(s2p, d2p,
                null, {forwardRef: true})(target);
        }
    }
    return target;
};
const annoI18n = (target, options = {}) => {
    let i18n;
    const fullname = annoI18nName(target, options);
    if (fullname) {
        const cab = options["i18n.cab"];
        i18n = new HocI18n(cab.ns, fullname, {});
    }
    return i18n;
};
export default {
    annoConnect,          // redux-connect
    annoI18n,             // HocI18n / HocI18r bind
    annoI18nName,         // name for metadata
}