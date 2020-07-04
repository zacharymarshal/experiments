module.exports = class WindowStack {
  constructor(windows = []) {
    this.windows = windows;
  }

  addWindow(window) {
    this.removeWindow(window);
    return this.windows.unshift(window);
  }

  removeWindow(window) {
    const currentIndex = this.windows.indexOf(window);
    if (currentIndex > -1) {
      return this.windows.splice(currentIndex, 1);
    }
  }
}
