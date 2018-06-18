import React from 'react'
import styles from './Cab.less';

class Component extends React.PureComponent {

    render() {
        const {component: Component} = this.props;
        console.info(styles);
        return (
            <div className={styles.login}>
                Login
                <Component {...this.props}/>
            </div>
        )
    }
}

export default Component;
