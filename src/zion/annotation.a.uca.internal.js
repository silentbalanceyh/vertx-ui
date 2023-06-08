import __UT from './annotation.fn.anno.util';
import __AE from './annotation.fn.anno.error';
import __Zn from './zero.module.dependency';

export default (options = {}) => {
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
                    $hoc: __UT.annoI18n(target, options),
                    ...injectState,
                    ...original
                };
            }

            componentDidMount() {
                const error = verify(this);
                if (error) {
                    __Zn.of(this).in({
                        error
                    }).done();
                } else {
                    if (__Zn.isFunction(super.componentDidMount)) {
                        super.componentDidMount()
                    }
                }
                // this.?etState({error});
                // if (!error && super.componentDidMount) {
                //     super.componentDidMount();
                // }
            }

            render() {
                const {error} = this.state;
                if (error) return __AE.annoFailed(error);
                /*
                 * 去掉 Component Monitor 日志
                 */
                // const fullName = __UT.annoI18nName(this, options);
                // __Zn.dgUCA(this, fullName);
                return super.render();
            }
        }

        _target = __UT.annoConnect(_target, options);
        return _target;
    };
}