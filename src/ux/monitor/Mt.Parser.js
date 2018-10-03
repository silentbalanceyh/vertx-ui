import System from './Mt.Parser.System';
import Query from './Mt.Parser.Query';
import Tree from './Mt.Parser.Tree';
import Dynamic from './Mt.Parser.Dynamic';

export default {
    ...System,
    ...Query,
    ...Tree,
    ...Dynamic
};