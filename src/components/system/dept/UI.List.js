import React from 'react'
import Ux from 'ux'
import Types from './Act.Types'
import {PageList} from 'web';

import Form from './UI.Form';
import Mock from './mock';

const {zero} = Ux;

@zero({
    connect: {
        s2p: state => Ux
            .dataIn(state)
            .rework({query: ["filters"]})
            .rinit(["filters"])
            .to(),
        d2p: {
            fnDepartmentList: Types.fnDepartmentList,
        }
    },
    "i18n.cab": require('./Cab.json'),
    "i18n.name": "UI.List",
    state: {
        $query: {
            sorter: ["code,ASC"],
            criteria: {
            },
            projection: [],
            pager: {
                page: 1,
                size: 10
            }
        },
        $_show: false
    },
    op: {
        show: Ux.onShow(null, "$_show"),
        hide: Ux.onHide(null, "$_show")
    }
})
class Component extends React.PureComponent {

    render() {
        const {$data} = this.props;
        const table = Ux.fromHoc(this, "table");
        return (
            <PageList
                {...Ux.toProp(this.props, "app")}
                {...Ux.toDatum(this.props)}
                {...Ux.toPageList(this, Form)}
                $table={table['plist']}
                $list={$data.to()}
                $mockRemove={Mock.fnRemove}
                fnData={this.props.fnDepartmentList}/>
        )
    }
}

export default Component;
