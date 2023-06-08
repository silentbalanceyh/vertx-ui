import React from 'react';
import {Row} from 'antd';
import Op from '../op';
import Rdr from "../component";
import CellEditor from './web.drag.cell';
import {uca} from 'zi';
import __Zn from '../zero.uca.dependency';

const configRowCmd = {
    // 最外层 Css
    className: "v-command",
    // Tooltip
    placement: "left",
    // 内置的浮游窗口
    popover: {
        // 按命令分组
        setting: {
            placement: "right"
        }
    }
}

@uca({
    "i18n.cab": require('../Cab.json'),
    "i18n.name": "Grid.Row",
})
class Component extends React.PureComponent {
    componentDidMount() {
        Op.yiRow(this);
    }

    render() {
        return __Zn.xtReady(this, () => {
            const {config = {}, $dndDrag} = this.props;
            const {$drawer} = this.state;
            const active = $drawer ? "middle-active" : "";
            return (
                <div className={"canvas-row"} ref={$dndDrag}>
                    <div className={"left"}>
                        {Rdr.renderCmds(this, {
                            ...config,
                            ...configRowCmd,
                        })}
                    </div>
                    <Row className={`middle ${active}`}>
                        {(() => {
                            const {data = []} = this.props;
                            return data.map(cell => {
                                const cellAttrs = Op.yoCell(this, cell, config);
                                return (
                                    <CellEditor {...cellAttrs}
                                                reference={this}
                                                rxCellConfig={Op.rxCellConfig(this)}
                                                rxCellRefresh={Op.rxCellRefresh(this)}/* 单元格刷新 */
                                                rxCellFill={Op.rxCellFill(this)}    /* 单元格填充 */
                                                rxCellSplit={Op.rxCellSplit(this)}  /* 单元格拆分 */
                                                rxCellMerge={Op.rxCellMerge(this)}  /* 单元格合并 */
                                                rxCellDel={Op.rxCellDel(this)}      /* 单元格删除 */
                                                rxCellWrap={Op.rxCellWrap(this)}    /* 单元格交换 */
                                    />
                                )
                            })
                        })()}
                        {(() => {
                            const extraAttrs = Op.yoExtra(this);
                            const {$extra = []} = this.state;
                            return Rdr.renderCmds(this, $extra, extraAttrs)
                        })()}
                    </Row>
                    {Rdr.renderDrawer(this)}
                </div>
            )
        })
    }
}

export default Component;