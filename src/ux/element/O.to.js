const toJson = (input) => {
    if ("string" === typeof input) {
        try {
            return JSON.parse(input);
        } catch (e) {
            return null;
        }
    } else return input;
};

export default {
    toJson,
}