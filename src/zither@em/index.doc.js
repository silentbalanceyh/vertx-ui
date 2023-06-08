/**
 * @name zither.HocContainer
 * @interface HocContainer
 */
const HocContainer = {
    /** **/ to: () => ({}),
    /** **/ __type: () => "",
    /** **/ is: () => "",
    /** **/ bind: () => ({}),
}
/**
 * @name zither.HocI18n
 * @class HocI18n
 */
const HocI18n = {
    /** **/ to: () => ({}),
    /** **/ __type: () => "",
    /** **/ is: () => "",
    /** **/ bind: () => ({}),
    /** **/ name: () => "",
    /** **/ namespace: () => "",
    /** **/ mergeVector: () => ({}),
    /** **/ merge: () => ({}),
    /** **/ formSave: () => ({}),
}
/**
 * @name zither.HocI18r
 * @class HocI18r
 */
const HocI18r = {
    /** **/ to: () => ({}),
    /** **/ __type: () => "",
    /** **/ is: () => "",
    /** **/ bind: () => ({}),
    /** **/ name: () => "",
    /** **/ merge: () => ({}),
    /** **/ formSave: () => ({}),
}
/**
 * @name zither.QQuery
 * @class QQuery
 */
const QQuery = {
    /** **/ init: () => ({}),
    /** **/ and: () => ({}),
    /** **/ size: () => ({}),
    /** **/ page: () => ({}),
    /** **/ sort: () => ({}),
    /** **/ to: () => ({}),
    /** **/ trace: () => ({})
}
// eslint-disable-next-line import/no-anonymous-default-export
export default {
    HocContainer,
    HocI18n,
    HocI18r,
    QQuery,
}