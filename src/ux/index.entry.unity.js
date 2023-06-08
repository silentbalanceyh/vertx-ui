import random from './unity.interface.random';
import html from './unity.interface.html';
import expression from './unity.interface.format';
import store from './unity.interface.store';
import ambient from './unity.interface.ambient';
import encrypt from './unity.interface.encrypt';
import sorter from './unity.interface.sorter';
import redux from './unity.interface.redux.write';
import math from './unity.interface.math';
import dsl from './unity.interface.dsl';

import tree from './unity.interface.tree';
import treeTo from './unity.interface.tree.to';
import treeSelect from './unity.interface.tree.selection';


import antForm from './unity.interface.ant.form';
import antFormIo from './unity.interface.data.io';

import pluginElement from './unity.interface.plugin.element';
import plugin from './unity.interface.plugin';

import connect from './unity.interface.connect';
import depend from './unity.interface.depend';
import acl from './unity.interface.secure';

import dragDrop from './unity.interface.drag.drop';
import v4 from './unity.interface.ant.v4';

export default {
    ...v4,

    ...random,
    ...html,
    ...expression,
    ...store,
    ...ambient,
    ...encrypt,
    ...sorter,
    ...redux,
    ...math,
    ...dsl,

    tree,       // 特殊对象，树的数据结构（支持各种变幻）
    ...treeTo,
    ...treeSelect,

    ...antForm,
    ...antFormIo,

    ...pluginElement,
    ...plugin,

    ...connect,
    ...depend,
    ...acl,

    ...dragDrop
}