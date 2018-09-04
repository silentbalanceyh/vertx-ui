import React from 'react'
import {Collapse} from "antd";
import {MarkdownViewer} from 'web';

class Component extends React.PureComponent {
    render() {
        const {$markdown = []} = this.props;
        if (0 < $markdown.length) {
            const key = $markdown[0].key;
            return (
                <Collapse className={"page-card-collapse"}
                          defaultActiveKey={key}>
                    {$markdown.map(markdown => {
                        const {content, ...rest} = markdown;
                        return (
                            <Collapse.Panel {...rest}>
                                <MarkdownViewer $source={content}/>
                            </Collapse.Panel>
                        )
                    })}
                </Collapse>
            )
        } else {
            return false;
        }

    }
}

export default Component