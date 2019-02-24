import React from 'react';
import {Card} from 'antd';
import {Minimap} from 'gg-editor';

class EditorMinimap extends React.Component {
    render() {
        const {$config = {}} = this.props;
        return (
            <Card type="inner" title={$config.title} bordered={false}>
                <Minimap height={200}/>
            </Card>
        );
    }
}

export default EditorMinimap;
