import Foundation from './O.foundation';
import Event from './O.event';
import Table from './O.table';
import Rx from './O.rx';
import Init from './O.init';
import Dynamic from './O.plugin.dynamic';
import Change from './O.change.event';
import Submit from './O.submit';
import xtReset from './O.fn.reset';

export default {
    ...Foundation,
    ...Event,
    ...Table,
    ...Rx,
    ...Init,
    // 触发专用
    ...Change,
    ...Submit,
    // 新版本重置
    xtReset,
    // 特殊类处理
    Dynamic,
};