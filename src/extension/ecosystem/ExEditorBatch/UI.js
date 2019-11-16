import React from 'react';
import Op from './Op';
import Ex from 'ex';
import Yo from './yo';
import renderJsx from './Web';

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
             * 表格
             */
            const tables = Yo.yoTable(this);
            /*
             * 按钮
             */
            const buttons = Yo.yoButton(this);
            return renderJsx(this, {
                tables,
                buttons,
            });
        }, Ex.parserOfColor("ExEditorBatch").private());
    }
}

export default Component;