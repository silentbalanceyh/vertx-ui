import {guid} from '../../../utils';
import {ItemType} from '../../../common/constants';
import {EdgeModel, NodeModel} from '../../../common/interfaces';
import commandManager from '../../../common/commandManager';
import {BaseCommand, baseCommand} from './base';

interface SaveCommandParams {
    type: ItemType;
    model: NodeModel | EdgeModel;
}

const saveCommand: BaseCommand<SaveCommandParams> = {
    ...baseCommand,

    params: {
        type: ItemType.Node,
        model: {
            id: '',
        },
    },

    init() {
        const {model} = this.params;

        if (model.id) {
            return;
        }

        model.id = guid();
    },

    canUndo() {
        /* 不可以 undo 处理 */
        return false;
    },

    execute(graph) {
        const {executor} = this.params;
        if (executor) {
            executor(graph);
        }
    }
};

commandManager.register('save', saveCommand);
