(function(root, factory) {
	if (typeof exports === 'object') {
		module.exports = factory(() => {});
	} else {
		root.SQLEditor = factory(root.getComputedStyle);
	}
})(this, function(getComputedStyle) {

	return class {
		constructor(el) {
			this.el = el;
		}
		insertText(text) {
			document.execCommand('insertText', false, text);
		}
		initialize() {
			this.el.addEventListener('input', this.fit.bind(this));
			this.el.addEventListener('keydown', this.tabListener.bind(this));
			this.el.addEventListener('keydown', this.newLineListener.bind(this));
			this.el.addEventListener('keydown', this.commentListener.bind(this));
			this.fit();
		}
    dispose() {
			this.el.removeEventListener('input', this.fit.bind(this));
			this.el.removeEventListener('keydown', this.tabListener.bind(this));
			this.el.removeEventListener('keydown', this.newLineListener.bind(this));
			this.el.removeEventListener('keydown', this.commentListener.bind(this));
    }
		fit() {
			this.el.style.height = 'auto';

			const style = getComputedStyle(this.el);
			const height = ['borderTopWidth', 'borderBottomWidth'].reduce((height, v) => {
				return height + parseInt(style[v])
			}, this.el.scrollHeight);
			this.el.style.height = `${height}px`;
		}
		tabListener(e) {
			if (e.key !== 'Tab') {
				return;
			}
			e.preventDefault();
			if (e.shiftKey) {
				this.unindent();
			} else {
				this.tab();
			}
		}
		newLineListener(e) {
			if (e.key !== 'Enter' || e.metaKey || e.ctrlKey) {
				return;
			}

			if (this.insertIndentedNewLine()) {
				e.preventDefault();
			}
		}
		commentListener(e) {
			if ((e.key === '/' && e.metaKey) === false) {
				return;
			}

			if (this.toggleLineComment()) {
				e.preventDefault();
			}
		}
		tab() {
			const {selectionStart, selectionEnd, value} = this.el;
			const lines = value.slice(selectionStart, selectionEnd).match(/\n/g) || [];

			if (lines.length === 0) {
				// TODO: Add autocomplete here...
				this.insertText('\t');
				return;
			}

			const startsWithNewLine = value[selectionStart] === '\n';
			const lineStart = value.lastIndexOf('\n', selectionStart - startsWithNewLine) + 1;
			this.el.setSelectionRange(lineStart, selectionEnd);

			const newSelection = value.slice(lineStart, selectionEnd);
			const indentedText = newSelection.replace(/^|\n/g, '$&\t');

			this.insertText(indentedText);
			this.el.setSelectionRange(selectionStart + 1, selectionEnd + lines.length + 1);
		}
		unindent() {
			const {selectionStart, selectionEnd, value} = this.el;

			const newSelectionStart = this.constructor.startOfLine(value, selectionStart);
			const newSelectionEnd = this.constructor.endOfLine(value, selectionEnd);
			const newSelectedText = value.slice(newSelectionStart, newSelectionEnd);

			let finalSelectionStart = selectionStart;
			let finalSelectionEnd = selectionEnd;

			const unindentedText = newSelectedText.replace(
				/(^|\n)\t/g,
				(match, p1, offset) => {
					if (offset < selectionStart - newSelectionStart) {
						finalSelectionStart -= 1;
					}
					if (offset < selectionEnd - newSelectionStart) {
						finalSelectionEnd -= 1;
					}
					return p1;
				}
			);

			// Weird browser bug that doesn't show the new line even though it is
			// part of the textarea. If we select the previous new line and replace it
			// with a new line, it works as we would expect.
			if (newSelectedText === '\t' && value[newSelectionStart - 1] === '\n') {
				this.el.setSelectionRange(newSelectionStart - 1, newSelectionEnd);
				this.insertText('\n');
				this.el.setSelectionRange(finalSelectionStart, finalSelectionEnd);

				return;
			}

			this.el.setSelectionRange(newSelectionStart, newSelectionEnd);
			this.insertText(unindentedText);
			this.el.setSelectionRange(finalSelectionStart, finalSelectionEnd);
		}

		insertIndentedNewLine() {
			const {selectionStart, selectionEnd, value} = this.el;

			const leadingTabs = value.slice(
				this.constructor.startOfLine(value, selectionStart),
				selectionStart
			).match(/(\t+)/);

			if (!leadingTabs) {
				return false;
			}

			this.insertText(`\n${leadingTabs[1]}`);

			return true;
		}

		toggleLineComment() {
			const {selectionStart, selectionEnd, value} = this.el;

			const newSelectionStart = this.constructor.startOfLine(value, selectionStart);
			const newSelectionEnd = this.constructor.endOfLine(value, selectionEnd);
			const newSelectedText = value.slice(newSelectionStart, newSelectionEnd);

			let finalSelectionStart = selectionStart;
			let finalSelectionEnd = selectionEnd;

			let commentedText;
			if (newSelectedText.slice(0, 3) === '-- ') {
				commentedText = newSelectedText.replace(
					/(^|\n)-- /g,
					(match, p1, offset) => {
						if (offset < selectionStart - newSelectionStart) {
							finalSelectionStart -= 3;
						}
						if (offset < selectionEnd - newSelectionStart) {
							finalSelectionEnd -= 3;
						}
						return p1;
					}
					);
			} else {
				commentedText = newSelectedText.replace(
					/(^|\n)/g,
					(match, p1, offset) => {
						if (offset === 0 || offset < selectionStart - newSelectionStart) {
							finalSelectionStart += 3;
						}
						if (offset === 0 || offset < selectionEnd - newSelectionStart) {
							finalSelectionEnd += 3;
						}
						return `${p1}-- `;
					}
				);
			}

			this.el.setSelectionRange(newSelectionStart, newSelectionEnd);
			this.insertText(commentedText);
			this.el.setSelectionRange(finalSelectionStart, finalSelectionEnd);
		}

		static startOfLine(str, pos) {
			for (let i = pos - 1; i >= 0; i--) {
				if (str[i] === '\n') {
					return i + 1;
				}
			}
			return 0;
		}

		static endOfLine(str, pos) {
			for (let i = pos; i < str.length; i++) {
				if (str[i] === '\n') {
					return i;
				}
			}
			return str.length;
		}
	};
});
