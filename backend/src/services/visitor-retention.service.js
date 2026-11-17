
const RETENTION_DAYS = 90;

function deleteExpiredVisitors(db) {
    if (!db || typeof db.prepare !== 'function') {
        throw new TypeError('Se requiere una conexión SQLite válida.');
    }

    const result = db.prepare(`
        DELETE FROM visitors
        WHERE created_at < datetime('now', '-90 days')
    `).run();

    return Number(result.changes);
}

module.exports = {
    RETENTION_DAYS,
    deleteExpiredVisitors
};
