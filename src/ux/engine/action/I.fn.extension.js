import U from 'underscore';
import Cmn from './I.common';

export default (reference, jsx) => {
    const extension = jsx.extension;
    const normalized = [];
    if (U.isArray(extension)) {
        extension.map(each => Cmn.exprUniform(reference, each))
            .filter(each => undefined !== each)
            .forEach(each => normalized.push(each));
    }
    return normalized;
}