import __V from './fn.assort.value.typed';
import __WT from './v.web.theme';
import __RAND from './fn.unity.random';
import filesize from 'file-size';

const toMessage = (content, error = false) => {
    if (content) {
        const config = {};
        config.modal = {};
        if (error) {
            config.modal.error = {content};
        } else {
            config.modal.success = {content};
        }
        return config;
    }
};
const toPagination = (data = {}, query = {}, config = {}) => {
    const pagination = {};
    const {pager = {}} = query;
    pagination.current = pager.page ? pager.page : 1;
    pagination.pageSize = pager.size ? pager.size : 10;
    pagination.total = data.count ? data.count : 0;
    Object.assign(pagination, config);
    return pagination;
}
const toKey = (key, assist = true) => {
    if (assist) {
        return `$a_${key.replace(/\./g, '_')}`;
    } else {
        return `$t_${key.replace(/\./g, '_')}`;
    }
};

const toFileSize = (value, unit) => {
    const normalize = __V.valueFloat(value, 0.0);
    const size = filesize(normalize);
    if (unit) {
        return `${size.to(unit)}${unit}`;
    } else {
        const units = ['B', 'KB', 'MB', 'GB', 'TB']
        let result = normalize;
        units.forEach((unit, index) => {
            if (Math.pow(1024, index) < normalize
                && normalize < Math.pow(1024, index + 1)) {
                result = toFileSize(normalize, unit);
            }
        })
        return result;
    }
}
const toColor = (current, mode = "KFC_8") => {
    const colorArray = __WT.THEME[mode];
    if (undefined === current) {
        const index = __RAND.randomInteger(0, colorArray.length);
        return colorArray[index];
    } else {
        const index = current % colorArray.length;
        return colorArray[index];
    }
};
export default {
    toPagination,
    toMessage,
    toKey,
    toFileSize,
    toColor,
}