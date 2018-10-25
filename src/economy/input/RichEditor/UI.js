import React from 'react';
import Editor from 'react-lz-editor';
import Op from './Op';

class Component extends React.PureComponent {
    constructor(props) {
        super(props);
        // 直接从value中提取
        this.state = Op.initValue(props);
    }

    componentDidUpdate(prevProps, prevState) {
        Op.updateValue(this, prevState);
    }

    render() {
        const attrs = Op.initConfig(this);
        attrs.active = true;
        attrs.importContent = this.state.markdown;
        return (
            <Editor {...attrs}/>
        );
    }
}

export default Component;