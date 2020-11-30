import React from 'react';
import renderGraphic from './Web.Graphic';

class Component extends React.PureComponent {
    render() {
        const {
            $event = {},
        } = this.props;
        /* Css 处理（计算布局） */
        const editor = $event.configEditor();
        return (
            <div className={"page-right"}>
                {renderGraphic(this)}
            </div>
        );
    }
}

export default Component;