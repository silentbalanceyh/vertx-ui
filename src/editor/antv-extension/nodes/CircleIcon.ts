import * as G6 from '@antv/g6';
import {ItemState} from '../../common/constants';
import {CustomNode} from '../../common/interfaces';

const exCiNode: CustomNode = {

    beforeSetState(name: ItemState, value: boolean, item: G6.Node) {
    },
};

G6.registerNode('exCiNode', exCiNode, 'exBaseNode');
