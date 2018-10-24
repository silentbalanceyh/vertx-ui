import React from 'react';
import Editor from 'react-lz-editor';
import Op from './Op';

class Component extends React.PureComponent {
    constructor(props) {
        super(props);
        // 直接从value中提取
        if (props.value) {
            this.state = {markdown: props.value};
        } else {
            this.state = {markdown: ""};
        }
    }

    render() {
        const attrs = Op.initConfig(this);
        return (
            <Editor active={false} {...attrs} importContent={this.state.markdown}/>
        );
    }
}

export default Component;