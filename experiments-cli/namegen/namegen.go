package namegen

import (
	"fmt"
	"math/rand"
	"time"

	"github.com/spf13/viper"
)

func GetRandomName() string {
	adjs := viper.GetStringSlice("adjectives")
	nouns := viper.GetStringSlice("nouns")
	return fmt.Sprintf("%s-%s", sampleOne(adjs), sampleOne(nouns))
}

func sampleOne(words []string) string {
	rand.Seed(time.Now().UnixNano())
	rand.Shuffle(len(words), func(i, j int) {
		words[i], words[j] = words[j], words[i]
	})
	return words[0]
}
