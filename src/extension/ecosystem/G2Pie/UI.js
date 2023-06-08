import React from 'react';
import Ux from 'ux';

const UCA_NAME = "G2Pie";
const componentInit = (reference) => {
    const {id, config = {}, data = []} = reference.props;

    const $g = Ux.g2Chart(id, config);
    // 图设置
    Ux.g2Pie($g, config);
    // 图绘制
    Ux.g2Draw($g, data, config);

    Ux.of(reference).in({$g}).done();
    // reference.?etState({$g});
}

const componentUp = (reference, virtual) => {
    const dataN = reference.props.data;
    const dataP = virtual.props.data;
    if (Ux.isDiff(dataN, dataP)) {
        const {$g} = reference.state;
        const {config = {}} = reference.props;
        Ux.g2Draw($g, dataN, config);
    }
}

class Component extends React.PureComponent {
    displayName = UCA_NAME;
    componentDidMount() {
        componentInit(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        componentUp(this, {props: prevProps, state: prevState});
    }

    render() {
        const {id, style = {}} = this.props;
        return (
            <div id={id} style={style}/>
        )
    }
}

export default Component