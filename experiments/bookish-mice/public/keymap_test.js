import Keymap from './keymap.js';

QUnit.test('should call bindKey when adding a keybinding', assert => {
  assert.expect(2);

  const keymap = new Keymap({
    bindKey(key, callback) {
      assert.equal(key, 'ctrl+s');
      assert.equal(typeof callback, 'function');
    }
  });
  keymap.add({
    key: 'ctrl+s',
    selector: 'body',
    eventType: 'core:save',
  });
});

QUnit.test('should return correct number of keybindings added', assert => {
  const keymap = new Keymap({
    bindKey(key, callback) {}
  });
  keymap.add({
    key: 'ctrl+s',
    selector: 'body',
    eventType: 'core:save',
  });
  keymap.add({
    key: 'esc',
    selector: 'body',
    eventType: 'core:exit',
  });

  assert.equal(keymap.getNumberOfKeybindings(), 2);
});
