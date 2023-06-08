import React from 'react';
import Op from '../op';
import __Zn from '../zero.uca.dependency';

import {LoadingContent} from 'zi';
import RowEditor from './web.drag.row';
import RowDrop from './web.drop.row';

class Component extends React.PureComponent {
    componentDidMount() {
        Op.yiGrid(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        Op.yuGrid(this, {props: prevProps, state: prevState});
    }

    render() {
        return __Zn.xtReady(this, () => {
            /* 行处理，每一行会包含 一个 RowEditor */
            const {$rows = []} = this.state;
            return $rows.map((row, index) => {
                const rowAttrs = Op.yoRow(this, row, index);
                const {key, ...rest} = rowAttrs;
                return (
                    <div key={key}>
                        <RowEditor {...rest}
                                   rxRowAdd={Op.rxRowAdd(this)}         /* 添加行 */
                                   rxRowDel={Op.rxRowDel(this)}         /* 删除行 */
                                   rxRowConfig={Op.rxRowConfig(this)}   /* 配置行 */
                        />
                        <RowDrop {...rest}
                                 rxRowWrap={Op.rxRowWrap(this)}     /* 交换行，目标对象触发 */
                        />
                    </div>
                );
            });
        }, {component: LoadingContent})
    }
}

export default Component