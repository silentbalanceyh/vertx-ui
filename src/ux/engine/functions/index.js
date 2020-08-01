import event from './O.event';
import to from './O.to';
import child from './O.child';
import rx from './O.rx';
import ajax from './O.ajax';
import anchor from './O.anchor';
import form from './O.ant.form';
import element from './O.element';
import redux from './O.redux';
import tree from './O.tree';

export default {
    ...redux,
    ...event,
    ...to,
    ...child,
    ...rx,
    ...ajax,
    ...anchor,
    ...form,
    ...element,
    ...tree,
}