import __Zn from './zero.module.dependency';
import __On from './source.datum.fn.on.consumer';

export default {
    elementFindDatum: (reference, source, filters) =>
        __Zn.elementFind(__On.onDatum(reference, source), filters),
    elementUniqueDatum: (reference, source, field, value) =>
        __Zn.elementUnique(__On.onDatum(reference, source), field, value),
    elementGroupDatum: (reference, source, field) =>
        __Zn.elementGroup(__On.onDatum(reference, source), field),
    elementMapDatum: (reference, source, from, to) =>
        __Zn.elementMap(__On.onDatum(reference, source), from, to)
}