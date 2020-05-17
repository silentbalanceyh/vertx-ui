import Foundation from './O.common';
import Event from './O.event';
import Rx from './O.render';
import Init from './O.init';
import xtForm from './O.fn.form';
import Lazy from './O.lazy';

export default {
    ...Foundation,
    ...Event,
    ...Rx,
    ...Init,
    // 新版本重置
    xtForm,
    ...Lazy,
};