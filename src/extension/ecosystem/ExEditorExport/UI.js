import React from 'react';
import Ex from 'ex';
import Ux from 'ux';
import Op from './Op';
import renderJsx from './Web.jsx';

const LOG = {
    name: "ExEditorExport",
    color: "#228B22"
};

/*
 * 导出
 */
class Component extends React.PureComponent {
    state = {
        $ready: false
    };

    componentDidMount() {
        Op.yiEditor(this);
    }

    render() {
        return Ex.yoRender(this, () => {
            /*
             * 根据核心状态处理
             */
            const {
                $button = {}, $options = {},
                $submitting = false,
                $group = {}, $notice = {}
            } = this.state;
            /*
             * 选项处理
             */
            const group = Ux.clone($group);
            const button = Ux.clone($button);
            if (!Ux.isEmpty(button)) {
                button.loading = $submitting;
            }
            return renderJsx(this, {
                button,
                options: Ux.clone($options),
                notice: Ux.clone($notice),
                group,
            });
        }, LOG);
    }
}

export default Component;