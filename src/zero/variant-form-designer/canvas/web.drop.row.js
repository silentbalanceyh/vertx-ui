import React from 'react';
import Op from "../op";
import __Zn from '../zero.uca.dependency';

class Component extends React.PureComponent {
    state = {}

    componentDidUpdate(prevProps, prevState, snapshot) {
        const targetItem = Op.item(this.props);
        const sourceItem = this.props['dragItem'];
        if (!Op.itemRowSame(sourceItem, targetItem)) {
            __Zn.dndDropColor(this, this.props['isOver']);
        }
    }

    render() {
        const {$dndDrop} = this.props;
        const {$hover = false} = this.state;
        return (
            <div ref={$dndDrop}
                 className={`canvas-row-drop ${$hover ? "canvas-row-drop-hover" : ""}`}/>
        )
    }
}

export default Component;