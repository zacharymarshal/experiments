import QueryStatement from './query_statement.mjs';

const e = React.createElement;
const useState = React.useState;
const useEffect = React.useEffect;

export default function(props) {
  const [activeStmtIdx, setActiveStmtIdx] = useState(0);
  const [mode, setMode] = useState('normal');
  const [stmts, setStmts] = useState(props.stmts || []);

  const isNormalMode = mode === 'normal';
  const setIsNormalMode = () => setMode('normal');

  const isInsertMode = mode === 'insert';
  const setIsInsertMode = () => setMode('insert');

  function selectNextStmt() {
    let nextStmtIdx = activeStmtIdx + 1;
    if (nextStmtIdx === stmts.length) {
      return;
    }
    setActiveStmtIdx(nextStmtIdx);
  }

  function selectPrevStmt() {
    let prevStmtIdx = activeStmtIdx - 1;
    if (prevStmtIdx === -1) {
      return;
    }
    setActiveStmtIdx(prevStmtIdx);
  }

  function deleteStmt() {
    const newStmts = [...stmts];
    if (newStmts.length === 1) {
      return;
    }

    newStmts.splice(activeStmtIdx, 1);
    setStmts(newStmts);
    if (activeStmtIdx >= newStmts.length) {
      setActiveStmtIdx(activeStmtIdx - 1);
    }
  }

  function addStmt(where) {
    const newStmts = [...stmts];
    let whereAt = activeStmtIdx;
    if (where === 'after') {
      whereAt += 1;
    }
    newStmts.splice(whereAt, 0, {});
    setStmts(newStmts);
    setActiveStmtIdx(whereAt);
    setIsInsertMode();
  }

  function updateStmtSql(stmtIdx, sql) {
    const newStmts = [...stmts];
    newStmts[stmtIdx].sql = sql;
    setStmts(newStmts);
  }

  function updateStmtCursor(stmtIdx, cursor) {
    const newStmts = [...stmts];
    newStmts[stmtIdx].cursor = cursor;
    setStmts(newStmts);
  }

  function editStmt(stmtIdx) {
    setActiveStmtIdx(stmtIdx);
    setIsInsertMode();
  }

  useEffect(() => {
    Mousetrap.bind(['down', 'j'], () => selectNextStmt());
    Mousetrap.bind(['up', 'k'], () => selectPrevStmt());
    Mousetrap.bind(['d'], () => deleteStmt());
    Mousetrap.bind(['o'], e => {
      e.preventDefault();
      addStmt('after');
    });
    Mousetrap.bind(['O'], e => {
      e.preventDefault();
      addStmt('before');
    });
    Mousetrap.bind(['i', 'enter'], () => {
      setIsInsertMode();
      return false;
    });

    return () => {
      Mousetrap.unbind(['down', 'j']);
      Mousetrap.unbind(['up', 'k']);
      Mousetrap.unbind(['d']);
      Mousetrap.unbind(['o']);
      Mousetrap.unbind(['O']);
      Mousetrap.unbind(['i', 'enter']);
    };
  });

  const stmtsEl = stmts.map((stmt, idx) => {
    const isActive = idx === activeStmtIdx;
    return e(QueryStatement, {
      stmtIdx: idx,
      isActive: isActive,
      isEditing: isInsertMode && isActive,
      editStmt,
      updateStmtSql,
      updateStmtCursor,
      setIsNormalMode,
      sql: stmt.sql || '',
      cursor: stmt.cursor || 0,
      editPrevStmt: () => {
        selectPrevStmt();
        setIsInsertMode();
      },
      editNextStmt: () => {
        selectNextStmt();
        setIsInsertMode();
      },
    });
  });

  return e(
    'div',
    {className: 'stmts'},
    ...stmtsEl
  );
}
