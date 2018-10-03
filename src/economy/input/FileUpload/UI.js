import React from 'react';
import {Button, Icon, Upload} from 'antd';

class Component extends React.PureComponent {

    render() {
        const {listType, text, reference, ...meta} = this.props;
        return (
            <Upload {...meta} listType={listType}>
                {"picture-card" === listType ? (
                    <span>
                        <Icon type={"upload"}/>
                        {text ? <br/> : false}
                        {text ? <span className={"ant-upload-text"}>{text}</span> : false}
                    </span>
                ) : (
                    <Button>
                        <Icon type={"upload"}/>
                        {text ? <span className={"ant-upload-text"}>{text}</span> : false}
                    </Button>
                )}
            </Upload>
        );
    }
}

export default Component;