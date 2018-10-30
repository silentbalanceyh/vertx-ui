import React from 'react';
import Ux from "ux";
import {PageCard} from 'web';
import {Tabs} from 'antd';
import {MarkdownPreview} from 'react-marked-markdown';

const guide = (reference, ...files) => {
    // 构造Markdown的面板
    const {md = []} = reference.state;
    if (0 < md.length) {
        const $markdown = [];
        // 如果files长度为0
        let tabArray = [];
        if (0 === files.length) {
            tabArray = Ux.fromHoc(reference, "chapter");
        } else {
            tabArray = files;
        }
        md.forEach((each, index) => {
            const item = {};
            item.key = Ux.randomUUID();
            item.tab = `${tabArray[index]}`;
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
                                <MarkdownPreview value={content}/>
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