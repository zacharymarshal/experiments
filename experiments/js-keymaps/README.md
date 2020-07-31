# experiments/js-keymaps

Experiment with registering keybindings to dom elements and dispatch a custom event.

I want to register a keybinding (`esc`) to both a textarea and the body and
have it dispatch a custom event that I can listen to, for example:

```
// Add the keybindings (ideally this would come from an object or file or
// something prettier
keymap.add('esc', 'document', 'app:cancel');
keymap.add('esc', 'textarea', 'textarea:exit');

// Listen for the events to be triggered
window.addEventListener('app:cancel', () => console.log('Cancel it ALL!'));
window.addEventListener('textarea:exit', e => e.target.blur());
```

This is similar to Atom, and would give me a central location to manage
keybindings. Eventually it would be cool to make a UI where you could search
all registered keybindings, modify them, add new ones, etc.

## Running

Attaches to the [buoy](https://github.com/lightster/buoy) network as
`exp-js-keymaps`.

```
# Serve the public/ via http-server
docker-compose up
```
