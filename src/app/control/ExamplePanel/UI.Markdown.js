import React from 'react'
import {Tabs} from "antd";
import {MarkdownViewer} from 'web';
import Ux from 'ux';

const {zero} = Ux;

@zero(Ux.rxEtat(require("./Cab.json"))
    .cab("UI.Markdown")
    .to()
)
class Component extends React.PureComponent {
    render() {
        const {$markdown = []} = this.props;
        if (0 < $markdown.length) {
            const key = $markdown[0].key;
            return (
                <Tabs className={"page-card-subtab"} tabPosition={"left"}
                      defaultActiveKey={key} size={"small"}>
                    {$markdown.map(markdown => {
                        const {content, ...rest} = markdown;
                        return (
                            <Tabs.TabPane {...rest}>
                                {Ux.auiTab(this)
                                    .to(
                                        <MarkdownViewer $source={content}/>
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