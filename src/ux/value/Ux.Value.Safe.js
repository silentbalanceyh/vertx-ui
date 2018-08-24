import U from "underscore";

const safeArray = (input) => {
    if (U.isArray(input)) {
        return input;
    } else {
        return [];
    }
};

export default {
    safeArray
}