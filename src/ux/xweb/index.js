import Foundation from './O.foundation';
import Event from './O.event';
import Table from './O.table';
import Rx from './O.rx';
import Init from './O.init';
import Change from './O.change.event';
import xtReset from './O.fn.reset';
import Lazy from './O.lazy';

export default {
    ...Foundation,
    ...Event,
    ...Table,
    ...Rx,
    ...Init,
    // 触发专用
    ...Change,
    // 新版本重置
    xtReset,
    ...Lazy,
};