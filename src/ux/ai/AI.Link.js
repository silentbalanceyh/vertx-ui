import React from 'react'
import Prop from '../prop/Ux.Prop';
import Random from '../util/Ux.Random';
import Cv from '../Ux.Constant';
import E from '../Ux.Error';

/**
 * 根据key值检索读取资源配置节点，生成Label和链接地址
 * @method aiHLink
 * @param reference
 * @param key
 */
const aiHLink = (reference, key) => {
    const info = Prop.fromPath(reference, "info");
    E.fxTerminal(!info, 10038, info);
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
    }
};
const aiUri = (item = {}, $router) => {
    if ("$MAIN$" === item.uri) {
        return Cv.ENTRY_ADMIN;
    } else if ("$SELF$" === item.uri) {
        return $router ? $router.uri() : "";
    } else {
        return $router ? $router.uri(item.uri) : item.uri;
    }
};
export default {
    aiHLink,
    aiUri,
}