import U from "underscore";

const safeArray = (input) => {
    if (U.isArray(input)) {
        return input;
    } else {
        return [];
    }
};

const safeList = (data) => {
    if (U.isArray(data)) {
        return data;
    } else {
        if (data && U.isObject(data)) {
            const result = data.list;
            if (U.isArray(result)) {
                return result;
            }
        }
        return [];
    }
};

export default {
    safeArray,
    safeList,
};