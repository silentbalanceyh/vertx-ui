import React from 'react'

class Component extends React.PureComponent {
    render() {
        const {children, reference} = this.props;
        return (
            <PageCard reference={reference}>
                {children}
            </PageCard>
        )
    }
}

export default Component