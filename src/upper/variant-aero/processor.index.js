import TREE_SELECT_PARENT_ALL_INCLUDE from './processor.@fn.TREE_SELECT.PARENT_ALL_INCLUDE';
import TREE_SELECT_PARENT_ALL from './processor.@fn.TREE_SELECT.PARENT_ALL';
import TREE_SELECT_PARENT from './processor.@fn.TREE_SELECT.PARENT';
import TREE_SELECT_CURRENT from './processor.@fn.TREE_SELECT.CURRENT';
import TREE_SELECT_CHILDREN from './processor.@fn.TREE_SELECT.CHILDREN';
import TREE_SELECT_CHILDREN_ALL from './processor.@fn.TREE_SELECT.CHILDREN_ALL';
import TREE_SELECT_CHILDREN_ALL_INCLUDE from './processor.@fn.TREE_SELECT.CHILDREN_ALL_INCLUDE';

import UNIQUE_LITERAL from './processor.@fn.UNIQUE.LITERAL';
import UNIQUE___DEFAULT__ from './processor.@fn.UNIQUE.__DEFAULT__';

import FILTER_EQ from './processor.@fn.FILTER.EQ';
import FILTER_IN from './processor.@fn.FILTER.IN';

import CRITERIA_IN from './processor.@fn.CRITERIA.IN';

import DIALOG_VISIBLE from './processor.@fn.DIALOG.VISIBLE';

import ZIP_INDEX_TO from './processor.@fn.ZIP.INDEX_TO';

import DATUM___DEFAULT__ from './processor.@fn.DATUM.__DEFAULT__';

import FIELD___DEFAULT__ from './processor.@fn.FIELD.__DEFAULT__';

import INPUT_PROP from './processor.@fn.INPUT.PROP';

import MAP___DEFAULT__ from './processor.@fn.MAP.__DEFAULT__';

export default {
    TREE_SELECT: {
        PARENT_ALL_INCLUDE: TREE_SELECT_PARENT_ALL_INCLUDE,
        PARENT_ALL: TREE_SELECT_PARENT_ALL,
        PARENT: TREE_SELECT_PARENT,
        CURRENT: TREE_SELECT_CURRENT,
        CHILDREN: TREE_SELECT_CHILDREN,
        CHILDREN_ALL: TREE_SELECT_CHILDREN_ALL,
        CHILDREN_ALL_INCLUDE: TREE_SELECT_CHILDREN_ALL_INCLUDE,
    },
    UNIQUE: {
        LITERAL: UNIQUE_LITERAL,
        __DEFAULT__: UNIQUE___DEFAULT__,
    },
    FILTER: {
        EQ: FILTER_EQ,
        IN: FILTER_IN,
    },
    CRITERIA: {
        IN: CRITERIA_IN,
    },
    MAP: {
        __DEFAULT__: MAP___DEFAULT__,
    },
    ZIP: {
        INDEX_TO: ZIP_INDEX_TO,
    },
    INPUT: {
        PROP: INPUT_PROP,
    },
    FIELD: {
        __DEFAULT__: FIELD___DEFAULT__,
    },
    DATUM: {
        __DEFAULT__: DATUM___DEFAULT__,
    },
    DIALOG: {
        VISIBLE: DIALOG_VISIBLE,
    }
}