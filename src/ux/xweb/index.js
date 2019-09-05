import Dust from './O.dust';
import Filter from './O.filter';
import Event from './O.event';
import Dialog from './O.dialog';
import Table from './O.table';
import Rx from './O.rx';
import Init from './O.init';
import Dynamic from './O.dynamic';
import Change from './O.change.event';
import Submit from './O.submit';

export default {
    ...Dust,
    ...Filter,
    ...Event,
    ...Dialog,
    ...Table,
    ...Rx,
    ...Init,
    // 触发专用
    ...Change,
    ...Submit,
    // 特殊类处理
    Dynamic,
};