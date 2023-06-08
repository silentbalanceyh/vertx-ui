import React from 'react';
import {Col} from 'antd';
import Op from "../op";
import Rdr from "../component";
import CellDrop from './web.drop.cell';
import CellDropWeb from './web.drop.cell.content.js';
import __Zn from '../zero.uca.dependency';
import {uca} from 'zi';

@uca({
    "i18n.cab": require('../Cab.json'),
    "i18n.name": "Grid.Cell",
})
class Component extends React.PureComponent {
    componentDidMount() {
        Op.yiCell(this);
    }

    render() {
        const {config = {}, data = {}, $dndDrag} = this.props;
        const {span} = config;
        if (span) {
            return __Zn.xtReady(this, () => {
                const {$hover = false, $drawer} = this.state;
                const colAttrs = {};
                colAttrs.span = span;
                colAttrs.className = "canvas-cell " + ($hover ? "canvas-cell-hover" : "");
                if (!$drawer && data.render) {
                    /* 双击打开 */
                    colAttrs.onDoubleClick = Op.rxCellSelect(this);
                }
                return (
                    <Col {...colAttrs}>
                        <div className={"content"} ref={$dndDrag}>
                            <CellDrop {...this.props} reference={this}/>
                            <CellDropWeb {...this.props} reference={this}/>
                            <div className={"t-command"}>
                                {(() => {
                                    const {$merge} = this.state;
                                    if ($merge) {
                                        return Rdr.renderCmd(this, $merge, {
                                            ...config,
                                            placement: "bottom"
                                        })
                                    } else return false;
                                })()}
                            </div>
                        </div>
                        {Rdr.renderDrawer(this)}
                    </Col>
                )
            })
        } else return false;
    }
}

export default Component;