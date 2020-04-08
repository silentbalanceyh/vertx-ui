import clone from './O.immutable';
import it from './O.it';
import is from './O.is';
import object from './O.object';
import promise from './O.promise';

export default {

    ...clone,
    ...object,
    ...it,
    ...is,
    ...promise,
}