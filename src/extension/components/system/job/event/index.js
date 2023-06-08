import UiTabs from './O.tabs';
import UiCond from './O.condition';

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
    ...UiTabs,
    ...UiCond
}