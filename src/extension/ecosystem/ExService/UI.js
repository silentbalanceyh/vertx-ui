import React from 'react';
import Ux from 'ux';
import Ex from 'ex';
import renders from './Renders';

/**
 * ## 「组件」`ExService`
 *
 * ```js
 * import { ExService } from 'ei';
 * ```
 *
 * ### 1. 生命周期
 *
 * |Hoc高阶周期|Mount初始化|Update更新|
 * |---|---|---|
 * |x|Ok|x|
 *
 * @memberOf module:uca/extension
 * @method ExService
 */
// =====================================================
// componentInit/componentUp
// =====================================================
const UCA_NAME = "ExService";
@Ux.zero(Ux.rxEtat(require('./Cab'))
    .cab(UCA_NAME)
    .to()
)
class Component extends React.PureComponent {
    displayName = UCA_NAME;
    componentDidMount() {
        Ex.yiPartForm(this, {
            id: "formService",
            renders,
        }).then(Ux.ready).then(Ux.pipe(this))
    }

    render() {
        const reference = Ux.onReference(this, 1);
        return Ex.yoRender({
            ...this,
            props: {
                ...this.props,
                form: reference.props.form,
            }
        }, () => {
            const {$form = {}} = this.state;
            const {$inited = {}} = this.props;
            /*
             * 读取 form 引用
             */
            return Ux.aiFormInput(reference, $inited, $form);
        }, Ex.parserOfColor(UCA_NAME).form())
    }
}

export default Component;