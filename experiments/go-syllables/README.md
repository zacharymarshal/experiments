# experiments/go-syllables

I want to make an API that gives you the count of syllables for a word you
pass.

```
GET /api/apple
{"syllables": 4}
```

- Lookup word in CMU database and get syllables based on the pronounciation
- Cache requests via Cloudeflare
  - Remove query strings to increase cache hits (redirect)
