import {HocI18n} from "entity";
import Logger from './ix.logger';
import {connect} from "react-redux";
import Ux from "ux";

const _ixFullName = (Component, Cab = {}, Name) => {
    // ns 属性检查
    Ux.E.fxTerminal(!Cab || !Cab.hasOwnProperty("ns"), 10050, Cab);
    // 参数名称检查
    Ux.E.fxTerminal(!Name, 10051, Name);
    // 返回全称
    const fullName = Cab['ns'] + "/" + Name;
    if (Component) Component.displayName = fullName;
    return fullName;
};
const _ixI18nName = (target, options = {}) => {
    let fullName;
    if (options.hasOwnProperty("i18n.cab") && options.hasOwnProperty("i18n.name")) {
        const cab = options['i18n.cab'];
        const name = options['i18n.name'];
        if (name && cab) {
            fullName = _ixFullName(target, cab, name);
        }
    }
    return fullName;
};
const _ixI18n = (target, options = {}) => {
    let i18n;
    const fullName = _ixI18nName(target, options);
    if (fullName) {
        const cab = options["i18n.cab"];
        i18n = new HocI18n(cab.ns, fullName, {});
    }
    return i18n;
};

const _ixConnect = (target, options = {}) => {
    if (options.connect) {
        const s2p = options.connect.s2p;
        const d2p = options.connect.d2p;
        // 如果没有d2p，则仅使用State -> Prop
        // 否则使用State -> Prop和Dispatch -> Prop
        if (!d2p) {
            target = connect(s2p, {})(target);
        } else {
            target = connect(s2p, d2p)(target);
        }
    }
    return target;
};
const _zero = (options = {}) => {
    return (target, property, descriptor) => {
        const injectState = options.state ? options.state : {};
        const verify = options.verify ? options.verify : () => undefined;

        class _target extends target {
            constructor(props) {
                super(props);
                // 静态资源放到State状态中
                const original = this.state ? this.state : {};
                this.state = {
                    // $hoc变量处理
                    $hoc: _ixI18n(target, options),
                    ...injectState,
                    ...original
                };
            }

            componentDidMount() {
                const error = verify(this);
                this.setState({error});
                if (!error && super.componentDidMount) {
                    super.componentDidMount();
                }
            }

            render() {
                const {error} = this.state;
                if (error) return Ux.fxError(error);

                const fullName = _ixI18nName(this, options);
                Logger.debug(this, fullName);
                return super.render();
            }
        }

        _target = _ixConnect(_target, options);
        return _target;
    };
};
export default _zero;