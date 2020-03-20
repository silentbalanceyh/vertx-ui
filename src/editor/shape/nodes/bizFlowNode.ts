import * as G6 from '@antv/g6';
import {ItemState} from '../../common/constants';
import {CustomNode} from '../../common/interfaces';
import Ex from '../../antv-extension/toolkit';

const bizFlowNode: CustomNode = {
    handleAnchor: Ex.handleAnchor,

    beforeSetState(name: ItemState, value: boolean, item: G6.Node) {
        this.handleAnchor.call(this, name, value, item);
    },
};

G6.registerNode('bizFlowNode', bizFlowNode, 'bizNode');
