# RegEx for Intermediate 🟡

Ready to level up? Learn groups, backreferences, and lookahead/lookbehind assertions.

## Key Concepts

| Concept | Syntax | Purpose |
|---------|--------|---------|
| Capturing Group | `(pattern)` | Group patterns and extract matches |
| Non-capturing Group | `(?:pattern)` | Group without capturing |
| Backreference | `\1`, `\2` | Refer to captured groups |
| Lookahead (positive) | `(?=pattern)` | Assert pattern follows (doesn't consume) |
| Lookahead (negative) | `(?!pattern)` | Assert pattern doesn't follow |
| Lookbehind (positive) | `(?<=pattern)` | Assert pattern precedes |
| Lookbehind (negative) | `(?<!pattern)` | Assert pattern doesn't precede |

## 📚 Curated Resources

1. **[regex101.com - Groups & Backreferences](https://regex101.com/)** ⭐
   - Set language to "Python" or your preferred language
   - Paste examples from below and experiment
   - Notice the "Group" section showing captured groups

2. **[MDN - Groups and Ranges](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions/Groups_and_Ranges)**
   - Detailed explanation of capturing vs non-capturing groups
   - Good JavaScript focus but concepts apply everywhere

3. **[Lookahead & Lookbehind Guide (Medium Article)](https://medium.com/javascript-in-plain-english/lookahead-and-lookbehind-in-regular-expressions-32e3ca13b2a3)**
   - Clear explanation with practical examples
   - JavaScript-focused but universal concepts

4. **[RegexOne - Interactive Lessons](https://regexone.com/)** ⭐
   - Progressive lessons with immediate feedback
   - Covers groups and backreferences
   - Excellent for practicing incrementally

## 💡 Common Patterns (Intermediate)

### HTML/XML Tag Matching
```
<(\w+)>.*?</\1>
```
Matches paired tags. `\1` refers to captured tag name.

### Duplicate Word Detection
```
\b(\w+)\s+\1\b
```
Finds repeated words like "the the"

### Remove Whitespace Around Text
```
Pattern: \s+
Replacement: (single space)
```
Use in split/replace operations

## Code Examples

See [examples/](./examples/) for:
- `capture_groups.py` - Using groups to extract data
- `backreferences.py` - Using `\1`, `\2` to match repeated patterns
- `lookahead_lookbehind.py` - Advanced assertions

## 🎯 Intermediate Checklist

- [ ] I understand capturing groups `()`
- [ ] I can use backreferences `\1`, `\2`
- [ ] I've written a pattern with lookahead `(?=...)`
- [ ] I understand the difference between lookahead and lookbehind
- [ ] I can extract multiple values from a string using groups
- [ ] I know when to use non-capturing groups `(?:...)`

## Next Steps

Ready for **[Advanced RegEx](../advanced/resources.md)**?
