import Ele from '../../element';
import On from './O.on';

export default {
    elementFindDatum: (reference, key, filters) =>
        Ele.elementFind(On.onDatum(reference, key), filters),
}