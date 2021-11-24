import random from './O.random';
import html from './O.html';
import expression from './O.format';
import store from './O.store';
import ambient from './O.ambient';
import encrypt from './O.encrypt';
import sorter from './O.sorter';
import redux from './O.redux';
import math from './O.math';
import dsl from './O.dsl';

import tree from './O.tree';
import treeTo from './O.tree.to';
import treeSelect from './O.tree.select';

import table from './O.table';

import antForm from './O.ant.form';

import pluginElement from './O.plugin.element';
import plugin from './O.plugin';

import connect from './O.connect';
import depend from './O.depend';
import acl from './O.secure';

import dragDrop from './O.drag.and.drop';

export default {

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

    ...table,   // 表格处理
    tree,       // 特殊对象，树的数据结构（支持各种变幻）
    ...treeTo,
    ...treeSelect,

    ...antForm,

    ...pluginElement,
    ...plugin,

    ...connect,
    ...depend,
    ...acl,

    ...dragDrop
}