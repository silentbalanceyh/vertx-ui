import * as React from 'react';
import * as pick from 'lodash/pick';
import {EditorContextProps, withEditorContext} from '../EditorContext';

import Item from './O.ui.item';

interface ItemPanelProps extends EditorContextProps {
    style?: React.CSSProperties;
    className?: string;
}

interface ItemPanelState {
}

class ItemPanel extends React.Component<ItemPanelProps, ItemPanelState> {
    static Item = Item;

    /*
        componentDidMount() {
            document.addEventListener('mouseup', this.handleMouseUp, false);
        }

        componentWillUnmount() {
            document.removeEventListener('mouseup', this.handleMouseUp, false);
        }

        handleMouseUp = () => {
            const {graph} = this.props;

            if (graph.getCurrentMode() === GraphMode.Default) {
                return;
            }

            const group: G.Group = graph.get('group');
            const shape: G.Shape = group.findByClassName(global.component.itemPanel.delegateShapeClassName) as G.Shape;

            if (shape) {
                shape.remove(true);
                graph.paint();
            }

            global.component.itemPanel.model = null;
            graph.setMode(GraphMode.Default);
        };
    */
    render() {
        const {children} = this.props;

        return <div {...pick(this.props, ['style', 'className'])}>{children}</div>;
    }
}

export {Item};

export default withEditorContext<ItemPanelProps>(ItemPanel);
