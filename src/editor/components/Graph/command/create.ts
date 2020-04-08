import {guid} from '../../../utils';
import {ItemType} from '../../../common/constants';
import {EdgeModel, NodeModel} from '../../../common/interfaces';
import commandManager from '../../../common/commandManager';
import {BaseCommand, baseCommand} from './base';

interface AddCommandParams {
    type: ItemType;
    model: NodeModel | EdgeModel;
}

const createCommand: BaseCommand<AddCommandParams> = {
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

    execute(graph) {
        const {type, model} = this.params;

        graph.add(type, model);

        this.setSelectedItems(graph, [model.id]);
    },

    undo(graph) {
        const {model} = this.params;

        graph.remove(model.id);
    },
};

commandManager.register('create', createCommand);
