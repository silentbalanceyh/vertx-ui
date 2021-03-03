import React from 'react';
import Ux from 'ux';
import {Card, Icon, Input, Tree} from 'antd';
import Op from './Op';
import Ex from "ex";

@Ux.zero(Ux.rxEtat(require("./Cab"))
    .cab("UI")
    .to()
)
class Component extends React.PureComponent {
    componentDidMount() {
        Op.yiSource(this)
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        Op.yuSource(this, {props: prevProps, state: prevState});
    }

    render() {
        return Ex.yoRender(this, () => {
            const card = Ux.fromHoc(this, "card");
            const search = Ux.fromHoc(this, "search");
            const {__dialog} = this.state;
            return (
                <Card className={"ops-card"} style={{
                    height: Ux.toHeight(64)
                }} title={((() => {
                    return (
                        <a href={""} onClick={Op.onShow(this)}>
                            <Icon type={card.icon}/>
                            {card.text}
                        </a>
                    );
                })())}>
                    {/* 不可以放到 title 属性中，该属性是最初的操作 */}
                    {__dialog.render()}
                    <div className={"ops-search"}>
                        <Input.Search
                            placeholder={search.placeholder}/>
                    </div>
                    {(() => {
                        const {$sources = []} = this.state;
                        const tree = Ux.toTree($sources, {text: "text", title: "text"});
                        return (
                            <Tree className={"ops-tree"}
                                  onSelect={Op.onSelect(this)}
                                  treeData={tree} defaultExpandAll/>
                        );
                    })()}
                </Card>
            )
        }, Ex.parserOfColor("OpsSource").define())
    }
}

export default Component