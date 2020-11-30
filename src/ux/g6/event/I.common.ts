import {Abs, Ele, Eng, T} from '../internal';
import {ModeGroup, ModeLayout, ModeSort, OptionKey} from "./I.contract";
import GGroup from "./O.node.group";
import GPos from "./O.graph.pos";
import {GStore} from "./O.event";
import Et from './I.events';

export * from '../internal';

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
    // AOP: Before
    item = Et.gx(gEvent).onNodeInitBefore(item);

    const fieldSet = new Set();
    const dataField = options[OptionKey.DATA_FIELDS] ? options[OptionKey.DATA_FIELDS] : [];
    {
        fieldSet.add('key');
        fieldSet.add('name');
        fieldSet.add('code');
        dataField.forEach(field => fieldSet.add(field));
    }
    const element: any = {};
    Array.from(fieldSet).forEach((field) => {
        const hitField = field as string;
        element[hitField] = item[hitField];
        element.model = Abs.clone(item);
    });
    // 注入特殊属性 text
    const attrs: any = {};
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
    if (Abs.isNotEmpty) {
        element.attrs = attrs;
    }

    // AOP: After
    return Et.gx(gEvent).onNodeInitAfter(element);
};
const onNodeSort = (data: any = [], options: any = {}) => {
    const sortField = options[OptionKey.SORT_FIELD];
    if (sortField) {
        const sortMode = options[OptionKey.SORT_MODE] ? options[OptionKey.SORT_MODE] : ModeSort.Asc;
        const sortFn = (ModeSort.Asc === sortMode) ? T.sorterAscFn(sortField) : T.sorterDescFn(sortField);
        return data.sort(sortFn);
    } else return data;
};
const onDataFlat = (data: any = [], options: any, gEvent: any) => {
    const dataArray = data.map(item => onNode(item, options, gEvent))
        .filter(item => undefined !== item);
    return onNodeSort(dataArray, options);
};
const Kt = {
    ...Et,
    /*
     * 初始化配置信息的细节，配置信息来自于几个方向
     * 1. reference中的 props 属性的 config 节点（和 Zero Ui统一）
     * 2. 直接从 Cab.json 中提取 _graphic 节点中的配置信息，最终用于构造合法的图相关数据
     * 3. editor / viewer 两个组件统一使用该配置信息
     *
     * 注意：
     * 1. 不存在合并，一旦传入了 config 则 Cab 中的自动失效
     * 2. 两种配置方式只能二选一
     *
     * 提供了扩展配置：initialize 节点，不论哪种方式，这个配置都是生效的
     */
    inStore: (reference: any = {}) => {
        let graphic = {};
        const cab = Eng.fromHoc(reference, 'graphic');
        if (cab) {
            // 将 _graphic 拷贝到变量中
            Object.assign(graphic, cab);
        }
        // 是否传入了 config 变量
        const {config} = reference.props;
        if (config) {
            Object.assign(graphic, config);
        }
        Object.freeze(graphic);
        return graphic;
    },
    inOptions: (stored: GStore) => {
        // 构造 options 信息
        const nodeConfig = stored.inNode();
        const nodeOptions: any = {};
        const {options} = nodeConfig;
        if (options) {
            Object.assign(nodeOptions, options);
        }
        return options;
    },
    inRegistry: (stored: GStore) => {
        const nodeConfig = stored.inStencil();
        return nodeConfig.registry;
    },
    /*
     * 位置压缩
     */
    posCompressH: (pos: GPos, config: any = {}) => {
        if (pos) {
            const css = config.css ? config.css : {};
            const height = css.height ? css.height : 36;
            pos.compress(height, 0);
        }
    },
    posStencil: (pos: GPos) => {
        const layout: ModeLayout = pos.mode();
        let height = pos.height();
        if (ModeLayout.LeftRight === layout) {
            height += pos.adjust().y;
        }
        return height;
    },
    /*
     * 节点构造流程
     * 1）执行 onNodeInitBefore
     * 2）将数据转换成 Node
     * 3）执行 onNodeInitAfter
     */
    onNode,

    /*
     * 构造元素信息 / 组信息
     *
     * 1). buildElement
     * 2). buildGroup
     */
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
                const grouped = Ele.elementGroup(data, groupField);
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
                const dataItem = Abs.clone(root);

                // 搜索当前树下的所有子节点
                const children = Ele.elementChildren(data, root, treeField)
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
export default Kt;