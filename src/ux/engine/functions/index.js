import event from './O.event';
import to from './O.to';
import child from './O.child';
import rx from './O.rx';
import ajax from './O.ajax';
import anchor from './O.anchor';
import element from './O.element';
import redux from './O.redux';
import tree from './O.tree';
import listener from './O.listener';

export default {
    ...redux,
    ...event,
    ...to,
    ...child,
    ...rx,
    ...ajax,
    ...anchor,
    ...element,
    ...tree,
    ...listener
}