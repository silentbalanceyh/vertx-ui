import Dust from './Xt.Dust';
import Filter from './Xt.Filter';
import Event from './Xt.Event';
import Dialog from './Xt.Dialog';
import Table from './Xt.Table';
import Rx from './Xt.Rx';
import Init from './Xt.Init';
import Dynamic from './Xt.Dynamic';

export default {
    ...Dust,
    ...Filter,
    ...Event,
    ...Dialog,
    ...Table,
    ...Rx,
    ...Init,
    // 特殊类处理
    Dynamic,
};