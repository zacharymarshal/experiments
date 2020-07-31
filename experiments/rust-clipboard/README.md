# experiments/rust-clipboard

A CLI clipboard to run on your machine. I wanted to learn rust by making a
simple CLI tool. I could think of nothing better than a clipboard ✂️

- [ ] Add some better usage information, check out StructOpt docs
- [ ] Update to also copy/paste using macOS commands so it can work as a remote
  clipboard too
- [ ] Play with breaking things out into modules

# Usage

Start the clipboard. This will listen on a unix socket.

```
clipboard start
```

Copy some text from stdin to the clipboard.

```
echo "woot" | clipboard copy
```

Paste from the clipboard to stdout.

```
clipboard paste
# woot
```
