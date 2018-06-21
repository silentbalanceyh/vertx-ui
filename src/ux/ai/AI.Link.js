import React from 'react'
import Prop from '../Ux.Prop';
import Random from '../Ux.Random';

/**
 * 根据key值检索读取资源配置节点，生成Label和链接地址
 * @method aiHLink
 * @param reference
 * @param key
 */
const aiHLink = (reference, key) => {
    const info = Prop.fromPath(reference, "info");
    if (info) {
        const keyLabel = `${key}Label`;
        // 仅包含key
        if (!info.hasOwnProperty(keyLabel)) {
            return (<a key={Random.randomString(7)} href={info[key]} target={"_blank"}>{info[key]}</a>)
        } else {
            return (<div key={Random.randomString(7)}>
                {info[keyLabel]}：
                <a href={info[key]} target={"_blank"}>{info[key]}</a>
            </div>)
        }
    } else {
        console.error(" -> [ZI] This method require '_info' configuration in cab file.");
    }
};

export default {
    aiHLink
}