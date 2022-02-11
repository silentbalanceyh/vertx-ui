import React from 'react';
import {Col, Row} from "antd";
import Ux from "ux";
import Ex from 'ex';
import './Cab.less';

const doQuery = (reference, state = {}) => {
    const {rxQuery} = reference.props;
    const $condition = [];
    if (Ux.isFunction(rxQuery)) {
        const {$view = [], $connector = "OR", $keys = []} = state;
        const criteria = {};
        const user = Ux.isLogged();


        /*
         * $keys = [
         *      "toDept",
         *      "toTeam",
         *      "toRole",
         *      "toGroup"
         * ]
         */
        if ($keys.includes("toDept")) {
            const deptId = user["deptId"];
            criteria.toDept = deptId;
            // 查询条件
            const dept = Ux.elementUniqueDatum(reference, "resource.departments", "key", deptId);
            if (dept) {
                const cond = {};
                cond.key = "toDept";
                cond.name = dept.name;
                $condition.push(cond);
            }
        }
        if ($keys.includes("toTeam")) {
            const teamId = user['teamId'];
            criteria.toTeam = teamId;

            // 查询条件
            const team = Ux.elementUniqueDatum(reference, "resource.teams", "key", teamId);
            if (team) {
                const cond = {};
                cond.key = "toTeam";
                cond.name = team.name;
                $condition.push(cond);
            }
        }
        if ($keys.includes("toRole") && user.role) {
            const roles = Ux.decryptBase64(user.role);
            try {
                const roleData = JSON.parse(roles);
                const roleIds = roleData.map(each => each.roleId);
                if (0 < roleIds.length) {
                    criteria[`toRole,i`] = roleIds;

                    // 查询条件
                    const role = roleIds
                        .map(each => Ux.elementUniqueDatum(reference, "user.roles", "key", each))
                        .filter(item => !!item)
                        .map(each => each.name)
                        .filter(item => !!item);
                    if (0 < role.length) {
                        const cond = {};
                        cond.key = "toRole";
                        cond.name = role.join(",");
                        $condition.push(cond);
                    }
                }
            } catch (error) {
            }
        }
        if ($keys.includes("toGroup") && user.group) {
            const groups = Ux.decryptBase64(user.group);
            try {
                const groupData = JSON.parse(groups);
                const groupIds = groupData.map(each => each.groupId);
                if (0 < groupData.length) {
                    criteria[`toGroup,i`] = groupIds;


                    // 查询条件
                    const group = groupIds
                        .map(each => Ux.elementUniqueDatum(reference, "user.groups", "key", each))
                        .filter(item => !!item)
                        .map(each => each.name)
                        .filter(item => !!item);
                    if (0 < group.length) {
                        const cond = {};
                        cond.key = "toGroup";
                        cond.name = group.join(",");
                        $condition.push(cond);
                    }
                }
            } catch (error) {
            }
        }


        /*
         * $connector 连接符
         */
        criteria[""] = ("AND" === $connector);


        /*
         * $view
         */
        $view.forEach(field => criteria[field] = user.key);
        rxQuery(criteria);
        return $condition;
    }
}

@Ux.zero(Ux.rxEtat(require("./Cab"))
    .cab("TxQRunFilter")
    .to()
)
class Component extends React.PureComponent {
    state = {
        $view: [],
        $connector: "AND",
        $keys: [],
    };

    componentDidMount() {
        Ex.yiAssist(this).then(Ux.ready).then(Ux.pipe(this))
    }

    render() {
        return Ex.yoRender(this, () => {
            const config = Ux.fromHoc(this, "toolbar");
            const exchange = Ux.Env.GRID.LIST_TT;
            const wf = Ex.wf(this);
            return (
                <div className={"ex-flow-filter"}>
                    <Row>
                        <Col span={3}>
                            {wf.Jsx.qrLabel(config)}
                        </Col>
                        <Col span={21}>
                            {wf.Jsx.qrSelected(config)}
                        </Col>
                    </Row>
                    <Row>
                        <Col {...exchange.open}>
                            {wf.Jsx.qrOpen(config)}
                        </Col>
                        <Col {...exchange.batch}>
                            {wf.Jsx.qrInCheck(config, doQuery)}
                        </Col>
                        <Col {...exchange.search}>
                            {wf.Jsx.qrInView(config, doQuery)}
                        </Col>
                        <Col {...exchange.extra}>
                            {wf.Jsx.qrInOpr(config, doQuery)}
                        </Col>
                    </Row>
                </div>
            )
        }, Ex.parserOfColor("TxQRunFilter").view())
    }
}

export default Component