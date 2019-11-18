import React from 'react';
import Op from './Op';
import Ex from 'ex';
import Ux from 'ux';
import renderJsx from './Web.jsx';

class Component extends React.PureComponent {
    state = {
        $buttons: [],   // 按钮初始化
        $options: [],   // 全列初始化
        $selected: [],  // 选择项初始化
        $submitting: false,
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
                $buttons = [], $options = [],
                $submitting = false,
                $group = {}, $selected = []
            } = this.state;

            const buttons = Ux.clone($buttons);
            buttons.forEach(button => button.loading = $submitting);
            /*
             * 选项处理
             */
            const group = Ux.clone($group);
            group.value = $selected;
            return renderJsx(this, {
                group,
                options: Ux.clone($options),
                buttons
            });
        }, Ex.parserOfColor("ExEditorColumn").private())
    }
}

export default Component;