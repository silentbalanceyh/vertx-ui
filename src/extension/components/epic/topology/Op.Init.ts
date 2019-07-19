import * as U from 'underscore';
import {Fn} from 'app';
import Ux from "ux";
import Event from './Op.Event';

/**
 * 利用数据处理items
 * @param reference
 */
const initGraphicItems = (reference: any) => {
    const itemData = [];
    const {$nodes} = reference.props;
    if ($nodes.is()) {
        const rawData = $nodes.to();
        if (U.isArray(rawData)) {
            rawData.forEach(rawItem => {
                // 前端数据规范
                const item: any = {};
                item.key = rawItem.key;
                item.type = "node";
                item.size = "64";
                item.shape = "getItem";
                // item.value = Ux.clone(rawItem);
                // 主要处理svg部分
                item.src = Fn.obtainIcon(rawItem.icon);
                {
                    item.model = {
                        label: rawItem.name,
                        labelOffsetY: 48,
                        icon: item.src
                    }
                }
                itemData.push(item);
            });
        }
    }
    return itemData;
};
const initDesigner = (reference) => {
    // 工具栏初始化（静态）
    const $toolbars = Event.initToolbar(reference);
    // 迷你图
    let $minimap = Ux.fromHoc(reference, "minimap");
    $minimap = Ux.clone($minimap);
    // 事件菜单
    const $event: any = {};
    $event.node = Event.initEvent(reference, "node");
    $event.edge = Event.initEvent(reference, "edge");
    $event.group = Event.initEvent(reference, "group");
    $event.multi = Event.initEvent(reference, "multi");
    $event.canvas = Event.initEvent(reference, "canvas");
    const $detail = Event.initDetail(reference);
    return {$toolbars, $minimap, $event, $detail};
};
export default {
    initGraphicItems,
    initDesigner,
}