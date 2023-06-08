import __Zn from './zero.uca.dependency';
import {ModeGroup, ModeSort, OptionKey} from "./g6.__.v.enum.constant";
import {GGroup} from './g6.__.c.unit.g.group';

const onNodeAttr = (item, config: any = {}, targetField) => {
    const {field, ...rest} = config;
    if (field && targetField) {
        const value = item[field] ? item[field] : null;
        if (value) {
            const text = {};
            text[targetField] = value;
            Object.assign(text, rest);
            return text;
        }
    }
}

const onNode = (item: any = {}, options = {}, gEvent: any) => {
    // AOP: 节点初始化前置
    item = gEvent.onNodeInitBefore(item);

    const fieldSet = new Set();
    const dataField = options[OptionKey.DATA_FIELDS] ? options[OptionKey.DATA_FIELDS] : [];

    fieldSet.add('key');
    fieldSet.add('name');
    fieldSet.add('code');
    dataField.forEach(field => fieldSet.add(field));

    const element: any = {};
    Array.from(fieldSet).forEach((field) => {
        const hitField = field as string;
        element[hitField] = item[hitField];
    });
    // 数据节点，原来的 model 改变了
    element.data = __Zn.clone(item);
    const attrs: any = item.attrs ? __Zn.clone(item.attrs) : {};
    const dataText = options[OptionKey.DATA_TEXT] ? options[OptionKey.DATA_TEXT] : {};
    const attrText = onNodeAttr(item, dataText, 'text');
    if (attrText) attrs.text = attrText;

    // 注入特殊属性 image
    const dataImage = options[OptionKey.DATA_IMAGE] ? options[OptionKey.DATA_IMAGE] : {};
    const attrImage = onNodeAttr(item, dataImage, 'xlinkHref');
    if (attrImage) {
        attrs.image = attrImage;
    }

    // 注入特殊属性 title
    const dataTitle = options[OptionKey.DATA_TITLE] ? options[OptionKey.DATA_TITLE] : {};
    const attrTitle = onNodeAttr(item, dataTitle, 'text');
    if (attrTitle) attrs.title = attrTitle;
    if (__Zn.isNotEmpty(attrs)) {
        element.attrs = attrs;
    }

    // 拷贝 data.id
    const id = options[OptionKey.DATA_ID] ? options[OptionKey.DATA_ID] : "key";
    element.id = element[id];

    // AOP: 节点初始化后置
    return gEvent.onNodeInitAfter(element);
};
const onNodeSort = (data: any = [], options: any = {}) => {
    const sortField = options[OptionKey.SORT_FIELD];
    if (sortField) {
        const sortMode = options[OptionKey.SORT_MODE] ? options[OptionKey.SORT_MODE] : ModeSort.Asc;
        const sortFn = (ModeSort.Asc === sortMode) ? __Zn.sorterAscFn(sortField) : __Zn.sorterDescFn(sortField);
        return data.sort(sortFn);
    } else return data;
};
const onDataFlat = (data: any = [], options: any, gEvent: any) => {
    const dataArray = data.map(item => onNode(item, options, gEvent))
        .filter(item => undefined !== item);
    return onNodeSort(dataArray, options);
};

const onNodeSearch = (fields = []) => (node, keyword) => {
    const data = node.getData();
    if (keyword && data) {
        if (0 === fields.length) {
            fields.push('name');
        }
        const matched = fields.map(field => {
            const fieldValue = data[field];
            if (fieldValue) {
                return (0 <= fieldValue.indexOf(keyword));
            } else return false;
        }).filter(value => true === value);
        return (0 < matched.length);
    } else {
        /**
         * 直接返回 true
         * 1）数据 data 为 null
         * 2）关键字为空
         */
        return true;
    }
}

const onEdge = (item: any = {}, options = {}, gEvent: any) => {
    // AOP: 边初始化前置
    item = gEvent.onEdgeInitBefore(item);

    const mapping = options[OptionKey.RELATION_MAPPING] ? options[OptionKey.RELATION_MAPPING] : {};
    if (!mapping.source) mapping.source = "source";
    if (!mapping.target) mapping.target = "target";
    if (!mapping.label) mapping.label = "label";
    const element: any = {};
    Object.keys(mapping).forEach(to => {
        const from = mapping[to];
        if (from && to) {
            element[to] = item[from];
        }
    });
    element.data = __Zn.clone(item);
    // AOP: 边初始化后置
    return gEvent.onEdgeInitAfter(element);
};
export default {
    onNodeSearch,
    onNode,
    onEdge,
    onDataFlat,
    onDataGroup: (data: any = [], options: any = {}, gEvent: any) => {
        // 根据分组的信息不同返回不同组
        const groupData: any = {};
        const groupField = options[OptionKey.GROUP_FIELD];
        const css = options.css ? options.css : {};

        const mapGroup = (name) => (item: any) => {
            item.__group = name;
            return onNode(item, options, gEvent);
        }

        const groupMode: ModeGroup = options[OptionKey.MODE_GROUP];
        if (ModeGroup.Field === groupMode) {
            // 平行分组，必须包含 groupField
            if (groupField) {
                const grouped = __Zn.elementGroup(data, groupField);
                Object.keys(grouped).forEach(name => {
                    // 每一组的数据处理
                    const children = grouped[name].map(mapGroup(name));

                    // 构造 GGroup
                    const group = new GGroup(name);
                    group.css(css).dataItems(onNodeSort(children, options));

                    groupData[group.name()] = group;
                })
            } else {
                throw new Error(`丢失了配置：${OptionKey.GROUP_FIELD}，请检查！`);
            }
        } else {
            // 树形分组
            const treeField = options[OptionKey.GROUP_FIELD_ROOT] ? options[OptionKey.GROUP_FIELD_ROOT] : 'parent';
            const groupKey = groupField ? groupField : 'name';           // 分组名称专用
            const rootNodes = data.filter(item => !item[treeField]);    // 读取根节点
            rootNodes.forEach(root => {
                const name = root[groupKey];
                const dataItem = __Zn.clone(root);

                // 搜索当前树下的所有子节点
                const children = __Zn.elementChildren(data, root, treeField)
                    .map(mapGroup(name));

                dataItem.__size = children.length;
                dataItem.__name = name;

                // 构造 GGroup
                const group = new GGroup(name);
                group.css(css).data(dataItem).dataItems(onNodeSort(children, options));
                groupData[name] = group;
            })
        }
        return groupData;
    }
}