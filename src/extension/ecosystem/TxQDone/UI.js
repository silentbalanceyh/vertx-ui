import React from 'react';
import Ux from "ux";
import Ex from "ex";
import ExListComplex from '../ExListComplex/UI';
import FormEdit from '../TxFormEdit/UI';

@Ux.zero(Ux.rxEtat(require("./Cab"))
    .cab("TxQDone")
    .to()
)
class Component extends React.PureComponent {
    componentDidMount() {
        Ex.yiCompany(this).then(Ux.pipe(this));
    }

    render() {
        return Ex.yoRender(this, () => {
            const hocConfig = Ux.fromHoc(this, "grid");
            let $config = Ux.clone(hocConfig);
            const form = {
                FormEdit,
            };
            // Workflow Processing
            const {config = {}} = this.props;
            if (config.options) {
                Object.assign($config.options, config.options);
            }
            const inherits = Ex.yoAmbient(this);
            // 强制更新底层逻辑
            const {$forceUpdate} = this.props;
            if ($forceUpdate) {
                inherits.$forceUpdate = $forceUpdate;
            }
            return (
                <div>
                    <ExListComplex {...inherits}
                                   config={$config} $form={form}/>
                </div>
            )
        }, Ex.parserOfColor("TxQueue").control());
    }
}

export default Component