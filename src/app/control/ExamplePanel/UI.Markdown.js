import React from 'react'
import {Tabs} from "antd";
import {MarkdownViewer} from 'web';
import Ux from 'ux';
import DataFlow from './UI.DataFlow';

const {zero} = Ux;

@zero(Ux.rxEtat(require("./Cab.json"))
    .cab("UI.Markdown")
    .to()
)
class Component extends React.PureComponent {
    render() {
        const {$markdown = [], $diagram = {}} = this.props;
        const table = Ux.fromHoc(this, "table");
        if (0 < $markdown.length) {
            const key = $markdown[0].key;
            return (
                <Tabs className={"page-card-subtab"} tabPosition={"left"}
                      defaultActiveKey={key} size={"small"}>
                    {$markdown.map(markdown => {
                        const {content, ...rest} = markdown;
                        const graphicData = $diagram[rest.tab];
                        return (
                            <Tabs.TabPane {...rest}>
                                {Ux.auiTab(this)
                                    .to(
                                        <MarkdownViewer $source={content}/>,
                                        <DataFlow $source={graphicData} $table={table}/>
                                    )}
                            </Tabs.TabPane>
                        )
                    })}
                </Tabs>
            )
        } else {
            return false;
        }

    }
}

export default Component