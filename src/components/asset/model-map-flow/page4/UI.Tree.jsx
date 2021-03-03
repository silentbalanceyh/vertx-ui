import Ux from "ux";
import {Card, Input, Tree} from "antd";
import Op from "./Op";
import React from "react";

export default (reference) => {
    const card = Ux.fromHoc(reference, "card");
    const search = Ux.fromHoc(reference, "search");
    return (
        <Card className={"ops-card"} style={{
            height: Ux.toHeight(340)
        }} title={card.text}>
            {/* 不可以放到 title 属性中，该属性是最初的操作 */}
            <div className={"ops-search"}>
                <Input.Search
                    placeholder={search.placeholder}/>
            </div>
            {(() => {
                const {$sources = []} = reference.state;
                const tree = Ux.toTree($sources, {text: "text", title: "text"});
                return (
                    <Tree className={"ops-tree"}
                          onSelect={Op.rxSelect(reference)}
                          treeData={tree} defaultExpandAll/>
                );
            })()}
        </Card>
    )
}