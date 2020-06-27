/* 左边树形结构（直接使用Tree）*/
import {Tree} from 'antd';
import React from 'react';
import Ux from "ux";
import Op from './Op';

export default (reference, $tree = []) => {
    return (
        <div className={"tree-left"}>
            <Tree treeData={$tree}
                  className={"tree-resource"}
                  checkable selectable={false}
                  style={{
                      height: Ux.toHeight(112)
                  }}
                  onCheck={Op.yoResCriteria(reference)}/>
        </div>
    )
}