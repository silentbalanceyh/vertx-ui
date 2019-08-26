import Fn from "../global/async";

export default (result, async = true) => {
    if (async) {
        return Fn.promise(result);
    } else {
        return result;
    }
};