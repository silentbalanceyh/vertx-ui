import Foundation from './O.foundation';
import Event from './O.event';
import Table from './O.table';
import Rx from './O.rx';
import Init from './O.init';
import xtReset from './O.fn.reset';
import xtForm from './O.fn.form';
import Lazy from './O.lazy';

export default {
    ...Foundation,
    ...Event,
    ...Table,
    ...Rx,
    ...Init,
    // 新版本重置
    xtReset,
    xtForm,
    ...Lazy,
};