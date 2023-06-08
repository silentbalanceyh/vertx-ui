import React from "react";
import Rdr from "../component";
import Op from "../op";
import Image from "../images";
import {Tag} from 'antd';
import __Zn from '../zero.uca.dependency';

const configCellCmd = {
    // 最外层 Css
    className: "c-command",
    // Tooltip
    placement: "top",
}

class Component extends React.PureComponent {
    state = {}

    componentDidUpdate(prevProps, prevState, snapshot) {
        const targetItem = Op.item(this.props);
        const sourceItem = this.props['dragItem'];
        if (!Op.itemCellSame(sourceItem, targetItem)) {
            const {reference} = this.props;
            __Zn.dndDropColor(reference, this.props['isOver']);
        }
    }

    render() {
        const {
            config = {}, data = {},
            $dndDrop, reference
        } = this.props;
        const {$hover = false} = this.state;

        return (
            <div ref={$dndDrop} className={`content-tool ${$hover ? "content-tool-hover" : ""}`}>
                <div className={"ant-input dropped"}>
                    {data.render ? (
                        <div>
                            {(() => {
                                const {$palette = {}} = this.props;
                                const text = $palette[data.render];
                                return (
                                    <Tag>
                                        {text}
                                    </Tag>
                                );
                            })()}
                            <img src={Image[data.render]} alt={data.render}/>
                            {(() => {
                                if (data.hidden) {
                                    const raft = __Zn.fromHoc(reference, "message");
                                    return (
                                        <Tag color={"red"}>
                                            {raft.hidden}
                                        </Tag>
                                    )
                                } else return false;
                            })()}
                        </div>
                    ) : false}
                </div>
                {Rdr.renderCmds(reference, {
                    ...config,
                    ...configCellCmd,
                    placement: "bottom"
                })}
            </div>
        )
    }
}

export default Component;