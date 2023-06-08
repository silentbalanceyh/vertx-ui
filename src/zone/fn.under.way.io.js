import __Is from './fn.under.is.decision';

const _wayO2S = (value, inError = true) => {
    try {
        return JSON.stringify(value);
    } catch (ex) {
        if (inError) {
            console.error(value);
            console.trace(ex);
        }
    }
}
export default {
    // JObject -> String
    wayJ2S: (value, inError = true) => __Is.isObject(value) ? _wayO2S(value, inError) : undefined,
    // JArray -> String
    wayA2S: (value, inError = true) => __Is.isArray(value) ? _wayO2S(value, inError) : undefined,
    // Object -> String
    wayO2S: (value, inError = true) => __Is.isObject(value, true) ? _wayO2S(value, inError) : undefined,
    // String -> Object ( JObject / JArray )
    wayS2O: (value, inError = true) => {
        if ("string" === typeof value) {
            try {
                return JSON.parse(value);
            } catch (ex) {
                if (inError) {
                    console.error(value);
                    console.trace(ex);
                }
            }
        }
    }
}