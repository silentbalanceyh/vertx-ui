export default (reference) => {
    const {$columns = [], $data = []} = reference.state;
    const tables = {};
    tables.className = "web-table";
    tables.dataSource = $data;
    tables.columns = $columns;
    tables.pagination = false;
    return tables;
}