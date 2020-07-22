import Keymap from './keymap.mjs';

let mousetrap;
const keymap = window.keymap = new Keymap({
  bindKey: function(keys, callback, action) {
    if (!mousetrap) {
      mousetrap = window.Mousetrap;
      mousetrap.prototype.stopCallback = function(e, el, combo) {
        return false;
      };
    }
    mousetrap.bind(keys, callback, action);
  }
});
keymap.initialize();
keymap.add({
  key: 'esc',
  selector: 'body',
  eventType: 'app:cancel',
});
keymap.add({
  key: 'esc',
  selector: 'textarea',
  eventType: 'txt:exit',
});
keymap.add({
  key: 'esc',
  selector: '.unset textarea',
  eventType: Keymap.UNSET,
});
keymap.add({
  key: 'esc',
  selector: '.abort textarea',
  eventType: Keymap.ABORT,
});
keymap.add({
  key: 'q',
  selector: '.abort textarea',
  eventType: 'q',
});
keymap.add({
  key: 'o',
  selector: '.abort textarea',
  eventType: 'o',
});

window.addEventListener('app:cancel', e => {
  console.log('Cancelling something big!');
  console.log(e.detail);
});
window.addEventListener('txt:exit', e => e.target.blur());
window.addEventListener('q', e => e.preventDefault());
window.addEventListener('o', e => e.detail.keyEvent.preventDefault());
