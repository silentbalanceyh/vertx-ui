import React from 'react';
import Editor from "editor";
import renderGraphic from './Web.Graphic';

class Component extends React.PureComponent {
    render() {
        const {
            $event = {},
        } = this.props;
        /* Css 处理（计算布局） */
        const editor = $event.configEditor();
        return (
            <Editor {...editor} event={$event}>
                <div className={"page-right"}>
                    {renderGraphic(this)}
                </div>
            </Editor>
        );
    }
}

export default Component;