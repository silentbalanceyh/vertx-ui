import React from 'react';
import {Affix, Card, Icon} from 'antd';
import Ux from "ux";

@Ux.zero(Ux.rxEtat(require("./Cab.json"))
    .cab("UI.Summary")
    .to()
)
class Component extends React.PureComponent {
    render() {
        const info = Ux.fromHoc(this, "info");
        const {data = {}} = this.props;
        const {relations = [], actions = []} = data;
        return (
            <Affix style={{position: 'absolute', top: 216, right: 8}}>
                <div className={"ops-model-summary"}>
                    <Card title={<span>
                        <Icon type={"double-right"} style={{
                            color: "#19aaff"
                        }}/>&nbsp;
                        {info.title}
                    </span>}
                    >
                        <ul>
                            <Icon type={"user"} style={{
                                color: "#19aaff"
                            }}/>&nbsp;{info.data}
                            <li>
                                {data.modelName ? data.modelName : ""}
                            </li>
                        </ul>
                        {0 < relations.length ? (
                            <ul>
                                <Icon type={"hdd"} style={{
                                    color: "#19aaff"
                                }}/>&nbsp;{info.relation}
                                {relations.map(relation => {
                                    return (
                                        <li key={relation.key}>
                                            {relation.modelName}
                                        </li>
                                    )
                                })}
                            </ul>
                        ) : false}
                        {0 < actions.length ? (
                            <ul>
                                <Icon type={"interaction"} style={{
                                    color: "#19aaff"
                                }}/>&nbsp;{info.action}
                                {actions.map(action => {
                                    return (
                                        <li key={action.key}>
                                            {action.modelName}
                                        </li>
                                    )
                                })}
                            </ul>
                        ) : false}
                    </Card>
                </div>
            </Affix>
        )
    }
}

export default Component