import {Graph} from "@antv/x6";

class GRequest {
    private readonly _graph: Graph = null;

    constructor(graph: Graph) {
        this._graph = graph;
    }

    /*
     * Ui 部分
     */
    graphic = () => this._graph;
    nodes = () => this._graph.getNodes();
    edges = () => this._graph.getEdges();

    graphicJ = () => this._graph.toJSON();
    nodesJ = () => this._graph.getNodes().map(node => node.toJSON());
    edgesJ = () => this._graph.getEdges().map(edge => edge.toJSON());
    /*
     * 数据部分
     */
    nodesData = () => this._graph.getNodes()
        .map(node => node.getData())
        .filter(data => !!data);
    edgesData = () => this._graph.getEdges()
        .map(edge => edge.getData())
        .filter(data => !!data);
}

export default GRequest