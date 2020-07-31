package syllables

import "strings"

func CountSyllables(word string) int {
	word = strings.ToLower(word)
	syllables := 0
	prevLetterIsVowel := false
	for _, letter := range word {
		letterIsVowel := isVowel(letter)
		if letterIsVowel && !prevLetterIsVowel {
			syllables += 1
		}
		prevLetterIsVowel = letterIsVowel
	}

	wordLength := len(word)
	if word[wordLength-1] == 'e' {
		syllables -= 1
	}
	if wordLength > 2 && word[wordLength-2:] == "le" && !isVowel(rune(word[wordLength-3])) {
		syllables += 1
	}
	if syllables == 0 {
		syllables = 1
	}
	return syllables
}

func isVowel(letter rune) bool {
	switch letter {
	case 'a', 'e', 'i', 'o', 'u':
		return true
	}
	return false
}
