import * as React from 'react';
import * as pick from 'lodash/pick';
import {ItemType} from '../../common/constants';
import {NodeModel} from '../../common/interfaces';
import {EditorContextProps, withEditorContext} from '../EditorContext';
import N from './common/O.dragging';

export interface ItemProps extends EditorContextProps {
    style?: React.CSSProperties;
    className?: string;
    type?: ItemType;
    model: NodeModel;
}

export interface ItemState {
    dragging: boolean
}

class Item extends React.Component<ItemProps, ItemState> {
    static defaultProps = {
        type: ItemType.Node,
    };

    constructor(props) {
        super(props);
        this.state = {dragging: false}
    }

    handleDragStart = () => {
        const {type} = this.props;
        if (type === ItemType.Node) {
            N.onStart(this);
        }
    };

    handleDrag = (event) => {
        const {type} = this.props;
        if (type === ItemType.Node) {
            N.onMove(this, event);
        }
    };

    handleDragEnd = () => {
        const {type} = this.props;
        if (type === ItemType.Node) {
            N.onEnd(this);
        }
    };

    render() {
        const {children} = this.props;

        return (
            <div {...pick(this.props, ['style', 'className'])}
                 onDragStart={this.handleDragStart}
                 onDrag={this.handleDrag}
                 onDragEnd={this.handleDragEnd}>
                {children}
            </div>
        );
    }
}

export default withEditorContext<ItemProps>(Item);
