// Trigger custom events on keybindings
class Keymap {
  static ABORT = 'abort!';
  static UNSET = 'unset!';

  constructor({bindKey}) {
    this.bindKey = bindKey;
    this.keymap = new Map();
  }

  initialize() {
  }

  add({key, selector, source, eventType}) {
    this.keymap.set({key, selector}, {key, selector, source, eventType});
    this.bindKey(key, handleKey(this.keymap, key));
  }
}

function handleKey(keymap, key) {
  return function(e, combo) {
    let currentTarget = e.target;
    let eventType;
    while (currentTarget && currentTarget !== document) {

      for (let [idx, keybinding] of keymap) {
        if (idx.key !== key) {
          continue;
        }

        if (currentTarget.matches(keybinding.selector)) {
          eventType = keybinding.eventType;
        }
      }

      if (eventType === Keymap.UNSET) {
        eventType = null;
      } else if (eventType === Keymap.ABORT) {
        e.preventDefault();
        eventType = null;
        break;
      } else if (eventType) {
        break;
      }

      currentTarget = currentTarget.parentNode;
    }

    if (!eventType) {
      return;
    }

    const customEvent = new CustomEvent(eventType, {
      bubbles: true,
      detail: {
        combo,
        keyEvent: e,
      }
    });

    e.target.dispatchEvent(customEvent);
  };
}

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
