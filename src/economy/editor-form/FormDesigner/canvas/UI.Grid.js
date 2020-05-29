import React from 'react';
import Op from '../op';
import Ux from 'ux';

import LoadingContent from "../../../loading/LoadingContent/UI";
import RowEditor from './UI.Row';

class Component extends React.PureComponent {
    componentDidMount() {
        Op.yiGrid(this);
    }

    render() {
        return Ux.xtReady(this, () => {
            /* 行处理，每一行会包含 一个 RowEditor */
            const {$rows = []} = this.state;
            return $rows.map((row, index) => {
                const rowAttrs = Op.yoRow(this, row, index);
                return (
                    <RowEditor {...rowAttrs}
                               rxRowAdd={Op.rxRowAdd(this)}/* 添加行 */
                               rxRowDel={Op.rxRowDel(this)}/* 删除行 */
                    />
                );
            });
        }, {component: LoadingContent})
    }
}

export default Component