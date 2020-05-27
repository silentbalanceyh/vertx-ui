import React from 'react';
import Ux from 'ux';

import Editor from "editor";
import renderGraphic from './Web.Graphic';

class Component extends React.PureComponent {

    render() {
        const {
            $event = {},
        } = this.props;
        /* 编辑器配置 */
        const editor = $event.configEditor();
        return (
            <Editor {...editor} event={$event}>
                <div className={"page-left"}>
                    {Ux.g6UiItem(this)}
                </div>
                <div className={"page-right"}>
                    <div className={"toolbar"}>
                        {Ux.g6UiCommand(this)}
                    </div>
                    {renderGraphic(this)}
                </div>
                {Ux.g6UiContext(this)}
            </Editor>
        );
    }
}

export default Component;