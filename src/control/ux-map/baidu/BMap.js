import React from 'react'
import { Map, Marker } from 'react-bmap';

class Component extends React.PureComponent {
    componentDidMount() {
    }

    render() {
        console.info(this.props);
        return (
            <Map center={ {lng : 106.530901, lat : 29.53467} } zoom="20">
                <Marker position={ {lng : 106.530901, lat : 29.53467} }/>
            </Map>
        )
    }
}

export default Component
