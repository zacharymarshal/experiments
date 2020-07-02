const e = React.createElement;
const useState = React.useState;
const useEffect = React.useEffect;

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

  useEffect(() => {
    Mousetrap.bind(['down', 'j'], () => selectNextStmt());
    Mousetrap.bind(['up', 'k'], () => selectPrevStmt());
    Mousetrap.bind(['d'], () => deleteStmt());
    Mousetrap.bind(['o'], () => addStmt('after'));
    Mousetrap.bind(['O'], () => addStmt('before'));
    Mousetrap.bind(['i', 'enter'], () => setIsInsertMode());
    Mousetrap.bind(['esc'], () => setIsNormalMode());

    return () => {
      Mousetrap.unbind(['down', 'j']);
      Mousetrap.unbind(['up', 'k']);
    };
  });


  const stmtsEl = stmts.map((stmt, idx) => {
    const isActive = idx === activeStmtIdx;
    return e(Stmt, {
      stmtIdx: idx,
      isActive: isActive,
      isEditing: isInsertMode && isActive,
      ...stmt
    });
  });

  return e(
    'div',
    {className: 'stmts'},
    ...stmtsEl
  );
}

function Stmt(props) {
    let cssClass = 'stmt';
    if (props.isActive) {
      cssClass += ' stmt--active';
    }
    if (props.isEditing) {
      cssClass += ' stmt--editing';
    }

    return e(
      'div',
      { className: cssClass },
      'idx: ', props.stmtIdx, ' sql: ', props.sql
    );
}

ReactDOM.render(
  e(Stmts, {
    stmts: [
      {sql: 'BEGIN;'},
      {sql: 'SELECT 1'},
    ]
  }),
  document.getElementById('root')
);
