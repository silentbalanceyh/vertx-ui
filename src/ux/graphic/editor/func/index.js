import elements from './O.data.item';
import config from './O.config';
import is from './O.common.is';
import model from './O.data.model'
import node from './O.node.js';

import page from './O.page.edit';
import view from './O.page.view';
import graphic from './O.graphic';

export default {
    ...elements,
    ...config,
    ...is,
    ...model,
    ...node,

    ...view,
    ...page,
    ...graphic,
}