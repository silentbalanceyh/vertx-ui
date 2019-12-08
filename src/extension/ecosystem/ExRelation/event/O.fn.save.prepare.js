import Ex from "ex";
import Ux from "ux";

const dataTo = (current = {}, selected = {}, reference, {
    category = {}, code = {}
}) => {
    const record = {};
    /*
     * Source
     */
    record.sourceCode = current.code;
    record.sourceName = current.name;
    record.sourceGlobalId = current.globalId;
    record.sourceIdentifier = current.identifier;
    record.sourceCategory = code[current.identifier];
    /*
     * Target
     */
    record.targetCode = selected.code;
    record.targetName = selected.name;
    record.targetGlobalId = selected.globalId;
    record.targetIdentifier = category[selected['categoryThird']];
    record.targetCategory = code[record.targetIdentifier];
    record.type = Ex.onRelationType(reference, record);
    return record;
};

const dataFrom = (current = {}, selected = {}, reference, {
    category = {}, code = {}
}) => {
    const record = {};
    /*
     * Target
     */
    record.targetCode = current.code;
    record.targetName = current.name;
    record.targetGlobalId = current.globalId;
    record.targetIdentifier = current.identifier;
    record.targetCategory = code[current.identifier];
    /*
     * Source
     */
    record.sourceCode = selected.code;
    record.sourceName = selected.name;
    record.sourceGlobalId = selected.globalId;
    record.sourceIdentifier = category[selected['categoryThird']];
    record.sourceCategory = code[record.sourceIdentifier];
    record.type = Ex.onRelationType(reference, record);
    return record;
};
export default (reference, key, selected = []) => {
    /*
     * current
     */
    const {current = {}, config = {}} = reference.props;
    /*
     * categoryMap = {}
     * codeMap = {}
     */
    let category = {};
    let code = {};
    const {relation = {}} = config;
    if (relation.source) {
        const categoryArray = Ux.onDatum(reference, relation.source);
        if (0 < categoryArray.length) {
            categoryArray.forEach(categoryItem => category[categoryItem.key] = categoryItem.identifier);
        }
    }
    if (relation.sourceCode) {
        const codeArray = Ux.onDatum(reference, relation.sourceCode);
        if (0 < codeArray.length) {
            codeArray.forEach(codeItem => {
                if (codeItem.code && Ux.isObject(codeItem.metadata)) {
                    const ucmdbCode = codeItem.metadata.code;
                    if (ucmdbCode) {
                        code[codeItem.code] = ucmdbCode;
                    }
                }
            })
        }
    }
    let processed = [];
    if ("up" === key) {
        /*
         * 添加上游，当前值是 target*
         */
        selected.forEach(each => {
            const result = dataFrom(current, each, reference, {
                category,
                code,
            });
            if (result) {
                processed.push(result);
            }
        });
    } else {
        /*
         * 添加下游，当前值是 source*
         */
        selected.forEach(each => {
            const result = dataTo(current, each, reference, {
                category,
                code,
            });
            if (result) {
                processed.push(result);
            }
        });
    }
    return processed;
};