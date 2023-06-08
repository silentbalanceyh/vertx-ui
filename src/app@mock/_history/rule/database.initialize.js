const initDatabase = (databaseName) => {
    // 初始化数据库（数据库名，版本）
    const request = indexedDB.open("DB_ZERO_UI", 1);
    // 数据库初始化核心脚本
}
export default {
    initDatabase,
}