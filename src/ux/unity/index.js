import random from './O.random';
import html from './O.html';
import expression from './O.format';
import store from './O.store';
import ambient from './O.ambient';
import encrypt from './O.encrypt';
import sign from './O.sign';
import sorter from './O.sorter';
import redux from './O.redux';
import math from './O.math';
import dsl from './O.dsl';

import tree from './O.tree';
import treeSelect from './O.tree.select';

import antForm from './O.ant.form';
import antSubmit from './O.ant.submit';

import pluginElement from './O.plugin.element';
import pluginTo from './O.plugin.to';
import plugins from './O.plugin.dynamic';

import connect from './O.connect';
import depend from './O.depend';

export default {
    ...random,
    ...html,
    ...expression,
    ...store,
    ...ambient,
    ...encrypt,
    ...sign,
    ...sorter,
    ...redux,
    ...math,
    ...dsl,

    ...tree,
    ...treeSelect,

    ...antSubmit,
    ...antForm,

    ...pluginElement,
    ...pluginTo,
    ...plugins,

    ...connect,
    ...depend
}