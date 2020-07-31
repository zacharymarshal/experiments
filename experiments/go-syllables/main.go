package main

import (
	"bufio"
	"fmt"
	"log"
	"os"
	"strings"
	"unicode"
)

func main() {
	file, err := os.Open("cmudict.txt")
	if err != nil {
		log.Fatal(err)
	}
	defer file.Close()

	words := make(map[string]int)

	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		line := strings.Split(scanner.Text(), "  ")
		word := line[0]

		if !unicode.IsLetter(rune(word[0])) {
			continue
		}

		pronunciation := line[1]
		words[word] = CountSyllables(pronunciation)
	}

	if err := scanner.Err(); err != nil {
		log.Fatal(err)
	}

	fmt.Printf("%d", len(words))
}

func CountSyllables(pronunciation string) int {
	syllables := 0
	for _, char := range pronunciation {
		if unicode.IsDigit(char) {
			syllables += 1
		}
	}

	return syllables
}
