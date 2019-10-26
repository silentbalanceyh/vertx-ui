import Ux from 'ux';

export default {
    __DEFAULT__: (params = []) => async (dataEvent) => {
        const ref = dataEvent.getRef();
        const value = dataEvent.getPrev();
        const source = params[0];
        const condField = params[1];
        const data = Ux.elementUniqueDatum(ref, source, condField, value);
        return data ? data : {};
    }
}