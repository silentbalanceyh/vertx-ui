import QElement from "./Mt.Parser.Element";

const parsePager = (queryPager) => {
    if (!queryPager) return {};
    const pager = {};
    pager.name = "pager";
    pager.color = "#c03";
    pager.children = [];
    // size
    pager.children.push({
        name: "size",
        color: "#333",
        children: [{
            name: queryPager.size
        }]
    });
    pager.children.push({
        name: "page",
        color: "#333",
        children: [{
            name: queryPager.page
        }]
    });
    return pager;
};
const parseSorter = (querySorter) => {
    if (!querySorter) return {};
    const sorter = {};
    sorter.name = "sorter";
    sorter.color = "#960";
    sorter.children = [];
    querySorter.filter(item => item && "string" === typeof item).forEach(item => {
        const arr = item.split(',');
        const each = {};
        each.name = arr[0];
        each.color = "#333";
        each.children = [];
        // 排序以及对应的值
        const sortItem = {};
        sortItem.name = arr[1];
        if ("DESC" === arr[1]) {
            sortItem.color = "#393";
        } else {
            sortItem.color = "#906";
        }
        each.children.push(sortItem);
        sorter.children.push(each);
    });

    return sorter;
};
const parseProjection = (queryProjection) => {
    if (!queryProjection) return {};
    const projection = {};
    projection.name = "projection";
    projection.color = "#36c";
    projection.children = [];

    return projection;
};
const parseCriteria = (queryCriteria, counter = []) => {
    if (!queryCriteria) return {};
    const criteria = {};
    criteria.name = "criteria";
    criteria.color = "#333";
    criteria.children = QElement.toChildren(queryCriteria, counter);
    // 判断是AND还是OR
    return criteria;
};
export default {
    parsePager,
    parseSorter,
    parseCriteria,
    parseProjection
}