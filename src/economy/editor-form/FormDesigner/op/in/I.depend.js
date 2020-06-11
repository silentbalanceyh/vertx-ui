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
    },
    dataImpact: (normalized = {}, data = {}) => {
        const impact = Ux.valuePath(data, "optionJsx.depend.impact");
        if (impact) {
            const {reset = []} = impact;
            normalized.impactReset = reset;
        }
        /*
         * linker触发器
         */
        const linker = Ux.valuePath(data, "optionJsx.config.linker");
        if (!Ux.isEmpty(linker)) {
            const linkerData = [];
            Object.keys(linker).forEach(key => {
                const itemData = {};
                itemData.key = Ux.randomUUID();
                itemData.dataFrom = key;
                itemData.dataTo = linker[key];
                linkerData.push(itemData);
            });
            normalized.linker = linkerData;
        }
    }
}