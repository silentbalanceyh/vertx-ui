import fromFn from './O.from';
import yo from './O.on.uniform';
import on from './O.on';
import onPlugin from './O.on.redux';
import element from './O.element';

export default {
    ...fromFn,
    ...yo,
    ...on,
    ...onPlugin,
    ...element,
}