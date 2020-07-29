package syllables

import "testing"

type syllableTest struct {
	input    string
	expected int
}

var syllableCountTests = []syllableTest{
	{"and", 1},         // starts with vowel
	{"compute", 2},     // ends with e
	{"tee", 1},         // should not be zero
	{"apple", 2},       // ends in le, consonant before
	{"dale", 1},        // ends in le, vowel before
	{"ale", 1},         // 3 letters ends in le
	{"awe", 1},         // awe
	{"awearied", 2},    // awe
	{"awee", 2},        // awe
	{"aweek", 2},       // awe
	{"aweel", 2},       // awe
	{"aweigh", 2},      // awe
	{"awesome", 2},     // awe
	{"awest", 2},       // awe
	{"aweary", 3},      // awe
	{"aweather", 3},    // awe
	{"aweband", 3},     // awe
	{"awedness", 3},    // awe
	{"awesomely", 3},   // awe
	{"awesomeness", 3}, // awe
	{"aweto", 3},       // awe
}

func TestCountSyllables(t *testing.T) {
	for _, test := range syllableCountTests {
		actual := CountSyllables(test.input)
		if actual != test.expected {
			t.Errorf(
				"CountSyllables(%q) expected %d, actual %d",
				test.input,
				test.expected,
				actual,
			)
		}
	}
}

func BenchmarkCountSyllables(b *testing.B) {
	for i := 0; i < b.N; i++ {
		for _, test := range syllableCountTests {
			CountSyllables(test.input)
		}
	}
}
