import Ux from 'ux';
import {Space} from "antd";

const __buildRoot = (group = {}) => {
    const {children = []} = group;
    const rootData = [];
    children.forEach(item => {
        const childItem = {};
        if ("string" === typeof item) {
            const split = item.split(',');
            childItem.key = split[0];
            childItem.title = split[1];
            if (split[2]) {
                childItem.value = [split[2]];
            } else {
                childItem.value = [split[0]];
            }
            rootData.push(childItem);
        } else {
            rootData.push(Ux.clone(item));
        }
    });
    return rootData;
}
const __buildCard = (cardData = [], rootData) => {
    const cardGroup = [];
    const app = Ux.isInit();
    const {bags = []} = app;
    const bagMap = Ux.elementMap(bags, 'entryId');
    cardData.forEach(item => {
        const bag = bagMap[item.name];
        if (bag) {
            const cardItem = {};
            cardItem.key = item.key;
            const icon = Ux.Env.ICON_BLOCK[bag['uiIcon']];
            cardItem.title = (
                <Space className={"hx-title"}>
                    <img src={icon} alt={item.text}/>
                    <span>{item.text}</span>
                </Space>
            )
            cardItem.data = item;
            cardItem.root = rootData;
            cardGroup.push(cardItem);
        }
    })
    return cardGroup;
}

const yoCol = (cindex, columns) => {
    const attrs = {};
    if (0 === cindex) {
        attrs.className = "hx-col-f";
    } else if ((columns - 1) === cindex) {
        attrs.className = "hx-col-l";
    } else {
        attrs.className = "hx-col-c";
    }
    attrs.span = 24 / columns;
    return attrs;
}
export default {
    yoCol,
    yiCard: (reference) => {
        const {config = {}, data = {}} = reference.props;
        const {group = {}} = config;
        const cards = data[group.root];
        // 排除
        const {exclude} = group;
        const rootData = __buildRoot(group);
        const cardData = cards
            .filter(item => !exclude.includes(item.name))
            .sort(Ux.sorterAscTFn('order'));
        // 构造Card配置（每个Card一个App）
        return __buildCard(cardData, rootData);
    }
}