import renderButtons from './O.fn.buttons';
import renderGrid from './O.fn.grid';

import renderGroup from './O.fn.group';
import renderSelected from './O.fn.selected';
/*
 * 统一提交函数
 */
import doRequest from './O.fn.request';
import event from './O.event';

export default {
    renderButtons,
    renderGrid,
    renderGroup,
    renderSelected,
    doRequest,
    ...event,
}