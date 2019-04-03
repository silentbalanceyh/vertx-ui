import React from "react";

const _renderDetail = (type, flag, config = {}, Component) => {
    if (type === flag) {
        const {title} = config;
        return (
            <div data-status={`${type}-selected`} className="panel">
                <div className="panel-title">{title}</div>
                {Component ? <Component/> : false}
            </div>
        );
    } else return false;
};

const renderNode = (type, title, Component) =>
    _renderDetail(type, "node", title, Component);

const renderEdge = (type, title, Component) =>
    _renderDetail(type, "edge", title, Component);

const renderGroup = (type, title, Component) =>
    _renderDetail(type, "group", title, Component);
export default {
    renderNode,
    renderEdge,
    renderGroup
};