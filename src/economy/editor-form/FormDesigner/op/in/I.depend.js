import Ux from "ux";

export default {
    dataNorm: (normalized = {}, data = {}) => {
        const normalizeValue = Ux.valuePath(data, "optionConfig.normalize");
        if (normalizeValue) {
            const splitted = normalizeValue.split(',');
            const [normalize, normalizeLength, normalizePrecision] = splitted;
            normalized.normalize = normalize;
            normalized.normalizeLength = normalizeLength;
            normalized.normalizePrecision = normalizePrecision;
        }
    }
}