import * as React from 'react';
import * as G6 from '@antv/g6';
import {Behavior, Command} from '../../common/interfaces';
import commandManager from '../../common/commandManager';
import behaviorManager from '../../common/behaviorManager';

interface RegisterProps {
    name: string;
    config: object;
    extend?: string;
}

interface RegisterState {
}

class Register extends React.Component<RegisterProps, RegisterState> {
    constructor(props: RegisterProps, type: string) {
        super(props);

        const {name, config, extend} = props;

        switch (type) {
            case 'node':
                G6.registerNode(name, config, extend);
                break;

            case 'edge':
                G6.registerEdge(name, config, extend);
                break;

            case 'command':
                commandManager.register(name, config as Command);
                break;

            case 'behavior':
                behaviorManager.register(name, config as Behavior);
                break;

            default:
                break;
        }
    }

    static create = function (type: string) {
        return class extends Register {
            constructor(props: RegisterProps) {
                super(props, type);
            }
        };
    };

    render() {
        return null;
    }
}

export const RegisterNode = Register.create('node');
export const RegisterEdge = Register.create('edge');
export const RegisterCommand = Register.create('command');
export const RegisterBehavior = Register.create('behavior');
