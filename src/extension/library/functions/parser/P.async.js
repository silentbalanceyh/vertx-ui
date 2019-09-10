import Ux from 'ux';

export default (result, async = true) => {
    if (async) {
        return Ux.promise(result);
    } else {
        return result;
    }
};