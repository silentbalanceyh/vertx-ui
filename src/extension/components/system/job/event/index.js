import UiOp from './O.ui';

import edit from './O.fn.edit';
import starting from './O.fn.start';
import stopping from './O.fn.stop';
import resuming from './O.fn.resuming';

export default {
    op: {
        edit,
        starting,
        stopping,
        resuming
    },
    ...UiOp,
}