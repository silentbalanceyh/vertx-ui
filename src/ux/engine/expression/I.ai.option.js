import mapIterator from "./I.ai.fn.iterator";
import Parser from "./I.parser.up";
import Apply from "./O.apply";

const aiExprOption = (options = []) =>
    mapIterator(options,
        (values = []) => Parser.parseItem(values, "option"),
        aiMetaOption)
        .map(Apply.applyValue);

const aiMetaOption = (item = {}) => {
    if (item.metadata) {
        let each = Parser.parseItem(item.metadata, "option");
        if (item.items) each.items = aiExprOption(item.items);
        if (item.children) each.children = aiExprOption(item.children);
        item = each;
    }
    return item;
};

export default {
    aiExprOption,
}