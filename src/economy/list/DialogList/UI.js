import React from 'react'
import Ux from 'ux';
import {_zero} from '../../_internal/index';
import {DataLabor} from 'entity';
import {DynamicDialog} from 'web'

@_zero({
    connect: {
        s2p: state => DataLabor.createOut(state)
            .rework({
                "list": ["items"]
            })
            .to(),
    },
    op: {
        show: (reference) => (event) => {
            reference.set({"show": true})
        },
        hide: (reference) => (event) => {
            reference.set({"show": false})
        }
    },
    state: {
        show: undefined,
    }
})
class Component extends React.PureComponent {
    componentDidMount() {
        const {reference, $key = "_sublist"} = this.props;
        const verified = Ux.verifyKey(reference, $key);
        if (verified) {
            this.setState({error: verified});
        }
    }

    render() {
        const {error} = this.state;
        if (error) {
            return Ux.fxError(error);
        } else {
            console.info(this.props);
            
            return (
                <div>
                    <DynamicDialog/>
                </div>
            )
        }
    }
}

export default Component