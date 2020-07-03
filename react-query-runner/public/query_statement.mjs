import QueryStatementEditor from './query_statement_editor.mjs';

const e = React.createElement;

export default function(props) {
  const {
    cursor,
    isActive,
    isEditing,
    sql,
    stmtIdx,
    editStmt,
    editPrevStmt,
    editNextStmt,
    setIsNormalMode,
    updateStmtSql,
    updateStmtCursor,
  } = props;

  let cssClass = 'stmt';
  if (isActive) {
    cssClass += ' stmt--active';
  }
  if (isEditing) {
    cssClass += ' stmt--editing';
  }

  let sqlEl;
  if (isEditing) {
    sqlEl = e(QueryStatementEditor, {
      sql,
      cursor,
      onSqlChange: sql => updateStmtSql(stmtIdx, sql),
      onCursorChange: cursor => updateStmtCursor(stmtIdx, cursor),
      onExit: dir => {
        if (dir === 'up') {
          editPrevStmt();
          return;
        } else if (dir === 'down') {
          editNextStmt();
          return;
        }

        setIsNormalMode();
      },
    });
  } else if (sql) {
    const hlSql = hljs.highlight('pgsql', sql, true);
    sqlEl = e('pre', {
      dangerouslySetInnerHTML: {__html: hlSql.value},
    });
  } else {
    sqlEl = e('pre', null, ' ');
  }

  return e('div', {
    className: cssClass,
    onClick: () => editStmt(stmtIdx),
  }, sqlEl);
}
