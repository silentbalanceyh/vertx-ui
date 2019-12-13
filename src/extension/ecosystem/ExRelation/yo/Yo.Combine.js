import Cd from './I.cond';
import Ux from 'ux';

const combineTab = (tabs = {}, reference, data = {}) =>
    Cd.itCombine(reference, (config = {}) => {
        const {title, key} = config;
        if (title && key && Ux.isArray(tabs.items)) {
            const tab = {};
            tab.tab = title;
            tab.key = key;
            /*
             * 合并专用窗口
             */
            const {up = [], down = []} = data;
            tab.up = up;
            tab.down = down;
            tab.combine = true;
            tabs.items.push(tab);
        }
    });
const combineRender = (data = {}, reference) => {
    data.render = (text, record = {}) => {
        const field = data['$field'];
        const fieldValue = record[field];
        const {$path = {}} = reference.props;
        if ($path && $path[fieldValue]) {
            return $path[fieldValue];
        } else {
            return false;
        }
    };
    return data;
};
const combineTable = (table = {}, reference, key, combine) =>
    Cd.itCombine(reference, (config = {}) => {
        if (combine) {
            const {up = {}, down = {}} = config;
            /*
             * columns 替换
             */
            const added = "up" === key ?
                combineRender(up, reference) :
                combineRender(down, reference);
            if (added) {
                table.columns = Ux.clone(table.columns);
                table.columns.push(added)
            }
        }
    });

export default {
    combineTab,
    combineTable,
}