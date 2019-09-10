import arg from './O.arguments';
import tree from './O.tree';

import date from './O.date';
import single from './O.single';
import object from './O.object';

import element from './O.element';

import event from './O.event';
import to from './O.to';

export default {
    ...arg,
    ...single,
    ...tree,
    ...date,
    ...object,

    ...element,

    ...event,
    ...to,
}