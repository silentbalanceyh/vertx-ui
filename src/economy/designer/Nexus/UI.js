import React from 'react';
import Editor, {ContextMenu} from "editor";
import './Cab.less';

import renderItem from './Web.Item';
import renderGraphic from './Web.Graphic';
import renderCommand from './Web.Command';

class Component extends React.PureComponent {

    render() {
        const {
            context = {},
            config = {},
        } = this.props;
        return (
            <Editor className={"ex-nexus"} command={config.command}>
                <div className={"ex-nexus-hd"}>
                    {renderItem(this)}
                </div>
                <div className={"ex-nexus-bd"}>
                    <div className={"toolbar"}>
                        {renderCommand(this)}
                    </div>
                    {renderGraphic(this)}
                </div>
                {context.node ? (<ContextMenu renderContent={context.node} type={"node"}/>) : false}
                {context.edge ? (<ContextMenu renderContent={context.edge} type={"edge"}/>) : false}
            </Editor>
        );
    }
}

export default Component;