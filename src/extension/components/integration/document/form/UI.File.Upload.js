import React from 'react';
import Ux from "ux";
import Ex from "ex";
import {ExForm} from "ei";
import Op from "./Op";

@Ux.zero(Ux.rxEtat(require('../Cab'))
    .cab("UI.File.Upload")
    .to()
)
class Component extends React.PureComponent {
    render() {
        /*
         * 配置处理
         */
        const {$inited = {}, $directory, $files = []} = this.props;
        const form = Ex.yoForm(this, null, $inited);
        form.$directory = $directory;
        const info = Ux.fromHoc(this, "info");
        form.rxReduce = (file) => {
            const counter = $files.filter(each => each.name === file.name).length;
            if (0 < counter) {
                // 目录下重名文件检测
                return info['duplicated'];
            }
        }
        return (
            <ExForm {...form} $height={"300px"}
                    $op={Op.rxAction(this)}
            />
        );
    }
}

export default Component