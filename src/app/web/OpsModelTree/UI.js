import React from 'react';
import Ux from "ux";
import Op from "./Op";
import Ex from "ex";
import {Card, Icon, Input, Tree} from 'antd';

@Ux.zero(Ux.rxEtat(require("./Cab"))
    .cab("UI")
    .to()
)
class Component extends React.PureComponent {
    componentDidMount() {
        Op.yiModel(this);
    }

    render() {
        return Ex.yoRender(this, () => {
            const info = Ux.fromHoc(this, "info");
            const {$adjust = 64} = this.props;
            return (
                <Card className={"ops-card"} style={{
                    height: Ux.toHeight($adjust)
                }} title={(() => {
                    return (
                        <a className={"link"} onClick={event => {
                            Ux.prevent(event);
                            Ux.toRoute(this, '/asset/model-map-flow?selected=DataAsset&target=/asset/model-config')
                        }}>
                            <Icon type={"plus"}/>
                            {info.link}
                        </a>
                    )
                })()}>
                    {/* 上边有标题 */}
                    <div className={"ops-search"}>
                        <Input.Search placeholder={info.search}/>
                    </div>
                    {(() => {
                        const source = Ux.onDatum(this, "model.information");
                        const treeData = Ux.toTree(source, {title: "name"})
                        return (
                            <Tree className={"ops-tree"}
                                  treeData={treeData}
                                  onSelect={Op.rxTree(this)}
                                  defaultExpandAll/>
                        )
                    })()}
                </Card>
            )
        }, Ex.parserOfColor("PxDataModel").control());
    }
}

export default Component