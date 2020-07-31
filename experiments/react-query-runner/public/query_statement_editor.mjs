const e = React.createElement;
const useLayoutEffect = React.useLayoutEffect;

export default function(props) {
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
    m.bind('up', e => {
      if (e.target.selectionStart !== 0) {
        return;
      }
      e.preventDefault();
      onExit('up');
    });
    m.bind('down', e => {
      if (e.target.selectionStart !== e.target.value.length) {
        return;
      }
      e.preventDefault();
      onExit('down');
    });

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
    onClick: e => {
      e.stopPropagation();
      handleCursorChange(e);
    },
    onBlur: () => onExit(),
  });
}
