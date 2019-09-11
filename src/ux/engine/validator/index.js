import Sync from './O.verifiers';
import Async from './O.async';
import Datum from './O.datum';

export default {
    ...Sync,
    ...Async,
    ...Datum,
}