import Common from './O.common';
import Rx from './O.render';
import Lazy from './O.lazy';
import Table from './O.table';

export default {
    ...Table,
    ...Common,
    ...Rx,
    // 新版本重置
    ...Lazy,
};