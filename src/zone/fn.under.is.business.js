import moment from 'moment';
import U from 'underscore';

const isCn = (literal) => /.*[\u4e00-\u9fa5]+.*$/.test(literal);
const isValid = (input) => undefined !== input && "" !== input && null !== input
// eslint-disable-next-line
const __filenameUnix = () => /[%#$<>:"/\\|?*\u0000-\u001F]/g;
const __filenameWindows = () => /^(con|prn|aux|nul|com\d|lpt\d)$/i;
// Fix: https://github.com/silentbalanceyh/vertx-zero/issues/393
const isFileName = (input) => {
    if (!input || input.length > 255) {
        return false;
    }
    if (__filenameUnix().test(input) || __filenameWindows().test(input)) {
        return false;
    }
    return !(input === '.' || input === '..');
}
const isCurrency = (literal) => /^(([1-9]\d*)(\.\d{1,2})?)$|^(0\.0?([1-9]\d?))$/g.test(literal);
const isNumber = (literal) => {
    if ("string" === typeof literal) {
        return /^-?[1-9]\d*$/g.test(literal);
    } else {
        return U.isNumber(literal);
    }
};
const isDecimal = (literal) => /^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/.test(literal);

const __timeDiff = (source, compared, config = {}, callback = {}) => {
    if (!source || !compared) {
        return false;
    }
    const {
        format = moment.ISO_8601,
        same = false,
        unit = "second"
    } = config;
    let sourceT = moment.isMoment(source) ? source : moment(source, format);
    let comparedT = moment.isMoment(compared) ? compared : moment(compared, format);
    const {
        fnSameTrue,
        fnSameFalse,
    } = callback;
    return same ? fnSameTrue(sourceT, comparedT, {
            ...config,
            unit,
        }) :
        fnSameFalse(sourceT, comparedT, {
            ...config,
            unit,
        });
}
const isBefore = (source, compared, config = {}) => __timeDiff(source, compared, config, {
    fnSameTrue: (sourceT, comparedT, config) =>
        sourceT.isSameOrBefore(comparedT, config.unit),
    fnSameFalse: (sourceT, comparedT, config) =>
        sourceT.isBefore(comparedT, config.unit),
});

const isAfter = (source, compared, config) => __timeDiff(source, compared, config, {
    fnSameTrue: (sourceT, comparedT, config) =>
        sourceT.isSameOrAfter(comparedT, config.unit),
    fnSameFalse: (sourceT, comparedT, config) =>
        sourceT.isAfter(comparedT, config.unit),
});
const isTimeSame = (leftMom, rightMom) => {
    if (undefined === leftMom || undefined === rightMom) {
        return false;
    }
    const leftValue = moment.isMoment(leftMom) ? leftMom : moment(leftMom, "HH:mm:ss");
    const rightValue = moment.isMoment(rightMom) ? rightMom : moment(rightMom, "HH:mm:ss");
    if (!leftValue.isValid() || !rightValue.isValid()) {
        return false;
    }
    return leftValue.hour() === rightValue.hour()
        && leftValue.minute() === rightValue.minute()
        && leftValue.second() === rightValue.second()
}
const isDateIso = (literal) =>
    // 2021-12-31T23:59:59.999Z / 2021-12-31T23:59:59+08:00
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/.test(literal) ||
    // 2023-02-26T09:10:02
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(literal)
;
export default {
    isCn,
    isDateIso,
    isValid,

    isFileName,
    isFunctionName: (name) => name && "string" === typeof name && (
        name.startsWith('rx') ||        // 高阶
        name.startsWith('on') ||        // 事件
        name.startsWith('do') ||        // 状态
        name.startsWith('fn')           // 普通
    ),

    isCurrency,
    isNumber,
    isDecimal,

    isBefore,
    isAfter,
    isTimeSame,
}