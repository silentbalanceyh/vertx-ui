import React from 'react';
import Ux from "ux";
import {MarkdownViewer, PageCard} from 'web';
import {Tabs} from 'antd';

const guide = (reference, ...files) => {
    // 构造Markdown的面板
    const {md = []} = reference.state;
    if (0 < md.length) {
        const $markdown = [];
        md.forEach((each, index) => {
            const item = {};
            item.key = Ux.randomUUID();
            item.tab = `${files[index]}`;
            item.content = each;
            $markdown.push(item);
        });
        // 读取Tabs属性
        const tabs = {};
        tabs.defaultActiveKey = $markdown[0].key;
        tabs.tabPosition = "left";
        return (
            <PageCard reference={reference}>
                <Tabs {...tabs}>
                    {$markdown.map(markdown => {
                        const {content, ...rest} = markdown;
                        return (
                            <Tabs.TabPane {...rest}>
                                <MarkdownViewer $source={content}/>
                            </Tabs.TabPane>
                        )
                    })}
                </Tabs>
            </PageCard>
        )
    } else return false;
};
export default {
    guide
}