import React from 'react';
import Ex from 'ex';
import Ux from 'ux';
import Op from './Op';
import renderJsx from './Web.jsx';

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
                $button = {}, $options = [],
                $submitting = false,
                $group = {}, $notice = {},
            } = this.state;
            /*
             * 选项处理
             */
            const group = Ux.clone($group);
            const button = Ux.clone($button);
            if (!Ux.isEmpty(button)) {
                button.loading = $submitting;
            }
            /*
             * 受控选项处理，默认权限
             */
            return renderJsx(this, {
                button,
                options: Ux.clone($options),
                notice: Ux.clone($notice),
                group,
            });
        }, Ex.parserOfColor("ExEditorExport").private());
    }
}

export default Component;