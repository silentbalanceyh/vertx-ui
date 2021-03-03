import {Tree} from 'antd';
import React from 'react';
import Ux from 'ux';
import Op from './Op';

export default (reference) => {
    const {$treeSource = [], $keySet} = reference.state;
    return (
        <Tree treeData={$treeSource}
              checkedKeys={$keySet ? Array.from($keySet) : []}
              onCheck={Ux.rxCheckedTree(reference, $treeSource,
                  Op.rxTreeChecked(reference))}
              defaultExpandAll
              checkStrictly
              checkable
              className={"range"}/>
    )
}
