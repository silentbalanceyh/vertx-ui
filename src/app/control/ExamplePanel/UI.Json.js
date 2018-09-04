import React from 'react'
import {Collapse} from "antd";
import ReactJson from 'react-json-view';

class Component extends React.PureComponent {
    render() {
        const {$source = []} = this.props;
        if (0 < $source.length) {
            const key = $source[0].key;
            return (
                <Collapse className={"page-card-collapse"}
                          defaultActiveKey={key}>
                    {$source.map(source => {
                        const {content, ...rest} = source;
                        return (
                            <Collapse.Panel {...rest}>
                                <ReactJson src={content} name={null} enableClipboard={false}/>
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