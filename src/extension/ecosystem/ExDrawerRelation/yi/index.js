import yoExecutor from './O.fn.executor';
import yiPage from './O.fn.page';
import yuPage from './O.fn.page.update';
import yoDesigner from './O.fn.designer';

import Ux from "ux";

const yoItems = (reference) => {
    const {$items = []} = reference.state;

    const {$dropped = []} = reference.state;
    const droppedSet = Ux.immutable($dropped);
    /* 过滤 */
    return $items.filter(item => !droppedSet.contains(item.identifier));
};
export default {
    yoItems,
    yoExecutor,
    yoDesigner,
    yiPage,
    yuPage,
}