import React from 'react';
import Op from './Op';
import Ex from 'ex';
import Yo from './yo';
import renderJsx from './Web';

const LOG = {
    name: "ExEditorBatch",
    color: "#228B22"
};

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
        }, LOG);
    }
}

export default Component;