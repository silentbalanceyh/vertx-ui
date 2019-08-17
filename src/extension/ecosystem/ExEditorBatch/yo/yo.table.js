import Ex from 'ex';

export default (reference) => {
    const {$columns = [], $data = []} = Ex.state(reference);
    const tables = {};
    tables.className = "web-table";
    tables.dataSource = $data;
    tables.columns = $columns;
    tables.pagination = false;
    return tables;
}