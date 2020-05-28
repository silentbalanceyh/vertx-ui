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
            /* 处理 columns 列信息 */
            const {data = {}} = this.props;
            const rowConfig = {};
            {
                /* 列类型 */
                if (!data.columns) data.columns = 4;
                rowConfig.grid = data.columns;
            }
            return $rows.map((row, index) => {
                const key = `key-row-${index}`;
                return (<RowEditor config={rowConfig} data={row}
                                   key={key}/>);
            });
        }, {component: LoadingContent})
    }
}

export default Component