import React from 'react';
import Ex from 'ex';
import Op from './Op';
import {ExComplexList} from 'ei';
import Ux from 'ux';

const LOG = {
    name: "OxList",
    color: "#A52A2A"
};

class Component extends React.PureComponent {
    state = {};

    componentDidMount() {
        Op.yiModule(this);
    }

    render() {
        return Ex.yoRender(this, () => {
            const {config = {}, $record = {}} = this.props;  // 基本配置
            const $config = Ux.clone(config);
            if ($config.options) {
                // 动静切换（由于OxList外置已经处理过 Op了，所以此处仅强制 dynamic.op = false;
                $config.options[Ex.Opt.DYNAMIC_OP] = false;
                // 编辑按钮在 EXTRA 中不呈现
                $config.options[Ex.Opt.TABS_EXTRA_EDIT] = false;
            }
            const {$form = {}} = this.state;   // 表单配置
            const inherit = Ex.yoDynamic(this); // 新方法
            return (
                <ExComplexList {...inherit} config={$config}
                               $form={$form}    // 添加专用
                               $record={$record}/>
            );
        }, LOG);
    }
}

export default Component;