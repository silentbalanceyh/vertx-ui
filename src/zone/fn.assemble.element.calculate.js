import __QR from './fn.assemble.element.qr';
import __V from './fn.assort.value.typed';
import __A from './fn.atomic.foundation';
import __Is from './fn.under.is.decision';

const elementJoin = (target = [], source = [], field = "key") => {
    const $target = __A.clone(target);
    // 更新
    $target.forEach(merged => {
        const found = __QR.elementUnique(source, field, merged[field]);
        if (found) {
            Object.assign(merged, found);
        }
    });
    // 增加
    source.forEach(added => {
        const found = __QR.elementUnique(target, field, added[field]);
        if (!found) {
            $target.push(__A.clone(added));
        }
    })
    return $target;
}
const elementGrid = (source = [], columns) => {
    columns = __V.valueInt(columns, 0);
    if (columns) {
        const grid = [];
        let index;
        let row = [];
        for (index = 1; index <= source.length; index++) {
            row.push(source[index - 1]);
            if (0 === index % columns) {
                grid.push(__A.clone(row));
                row = [];
            }
        }
        if (0 < row.length) {
            grid.push(__A.clone(row));
        }
        return grid;
    } else return __A.clone(source);
}
const elementConcat = (original = [], current = [], field) => {
    if (field) {
        const exist = original.map(item => item[field]).filter(item => !!item)
        const start = __A.clone(original);
        current.filter(item => !exist.includes(item[field]))
            .forEach(item => start.push(item));
        return start;
    } else {
        return original.concat(current);
    }
}
const elementFlip = (input) => {
    if (__Is.isArray(input)) {
        return [].concat(input);
    } else if (__Is.isObject(input)) {
        return Object.keys(input)
            .filter(key => __Is.isArray(input[key]))
            .map(key => input[key])
            .flatMap(item => item);
    } else return [];
}
const elementFlat = (array = []) => {
    const result = [];
    array.forEach(item => {
        const {children, ...rest} = item;
        result.push(__A.clone(rest));
        if (children && __Is.isArray(children)) {
            const flatted = elementFlat(children);
            flatted.forEach(pending => result.push(pending));
        }
    });
    return result;
};
const elementWrap = (array = [], fromIndex, toIndex) => {
    let from = array[fromIndex];
    if (from) {
        from = __A.clone(from);
    }
    let to = array[toIndex];
    if (to) {
        to = __A.clone(to);
    }
    if (from && to) {
        array[fromIndex] = to;
        array[toIndex] = from;
    }
    return array;
}
export default {
    elementJoin,
    elementGrid,
    elementConcat,
    elementFlip,
    elementFlat,
    elementWrap,
}