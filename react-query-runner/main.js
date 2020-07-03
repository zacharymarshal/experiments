const e = React.createElement;
const useState = React.useState;
const useEffect = React.useEffect;
const useLayoutEffect = React.useLayoutEffect;

function Stmts(props) {
  const [activeStmtIdx, setActiveStmtIdx] = useState(0);
  const [mode, setMode] = useState('normal');
  const [stmts, setStmts] = useState(props.stmts || []);

  const isNormalMode = mode === 'normal';
  const setIsNormalMode = () => setMode('normal');

  const isInsertMode = mode === 'insert';
  const setIsInsertMode = () => setMode('insert');

  function selectNextStmt() {
    if (!isNormalMode) {
      return;
    }

    let nextStmtIdx = activeStmtIdx + 1;
    if (nextStmtIdx === stmts.length) {
      return;
    }
    setActiveStmtIdx(nextStmtIdx);
  }

  function selectPrevStmt() {
    if (!isNormalMode) {
      return;
    }

    let prevStmtIdx = activeStmtIdx - 1;
    if (prevStmtIdx === -1) {
      return;
    }
    setActiveStmtIdx(prevStmtIdx);
  }

  function deleteStmt() {
    if (!isNormalMode) {
      return;
    }

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

  useEffect(() => {
    Mousetrap.bind(['down', 'j'], () => selectNextStmt());
    Mousetrap.bind(['up', 'k'], () => selectPrevStmt());
    Mousetrap.bind(['d'], () => deleteStmt());
    Mousetrap.bind(['o'], () => addStmt('after'));
    Mousetrap.bind(['O'], () => addStmt('before'));
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
    return e(Stmt, {
      stmtIdx: idx,
      isActive: isActive,
      isEditing: isInsertMode && isActive,
      updateStmtSql,
      updateStmtCursor,
      setIsNormalMode,
      sql: stmt.sql || '',
      cursor: stmt.cursor || 0,
    });
  });

  return e(
    'div',
    {className: 'stmts'},
    ...stmtsEl
  );
}

function Stmt(props) {
  const {
    cursor,
    isActive,
    isEditing,
    sql,
    stmtIdx,
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
    sqlEl = e(Editor, {
      sql,
      cursor,
      onSqlChange: sql => updateStmtSql(stmtIdx, sql),
      onCursorChange: cursor => updateStmtCursor(stmtIdx, cursor),
      onExit: () => setIsNormalMode(),
    });
  } else if (sql) {
    const hlSql = hljs.highlight('pgsql', sql, true);
    sqlEl = e('pre', {
      dangerouslySetInnerHTML: {__html: hlSql.value},
    });
  } else {
    sqlEl = e('pre', null, ' ');
  }

  return e('div', {className: cssClass}, sqlEl);
}

function Editor(props) {
  const {
    cursor,
    sql,
    onCursorChange,
    onExit,
    onSqlChange,
  } = props;

  let textarea;
  useLayoutEffect(() => {
    textarea.focus();
    textarea.setSelectionRange(cursor, cursor);

    const editor = new SQLEditor(textarea);
    editor.initialize();

    const m = new Mousetrap(textarea);
    m.bind('esc', e => e.target.blur() && false);

    return () => {
      editor.dispose();
      m.unbind('esc');
    };
  }, [true]);

  function handleCursorChange(e) {
    onCursorChange(e.target.selectionEnd);
  }

  return e('textarea', {
    rows: 1,
    value: sql,
    ref: (input) => textarea = input,
    onChange: e => onSqlChange(e.target.value),
    onKeyUp: handleCursorChange,
    onClick: handleCursorChange,
    onBlur: onExit,
  });
}

ReactDOM.render(
  e(Stmts, {
    stmts: [
      {sql: 'BEGIN;'},
      {sql: 'SELECT *\nFROM users\nWHERE organization_id = 32\n\tAND first_name ILIKE \'%zuuu%\''},
    ]
  }),
  document.getElementById('root')
);
