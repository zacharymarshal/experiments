// Trigger custom events on keybindings
class Keymap {
  static ABORT = 'abort!';
  static UNSET = 'unset!';

  constructor(options = {}) {
    this.bindKey = options.bindKey || bindKey.bind(null);
    this.keymap = new Map();
  }

  initialize() {
  }

  add({key, selector, source, eventType}) {
    this.keymap.set({key, selector}, {key, selector, source, eventType});
    this.bindKey(key, handleKey(this.keymap, key));
  }

  getNumberOfKeybindings() {
    return this.keymap.size;
  }
}

function bindKey(key, callback) {
  console.warn('set a bindKey callback function to register a keybinding'
    + ' with something like Mousetrap');
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

export default Keymap;
