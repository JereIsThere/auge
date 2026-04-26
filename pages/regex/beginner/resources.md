# RegEx for Beginners 🟢

Start here if you're new to regular expressions. These resources focus on fundamentals and provide interactive practice.

## Essential Concepts

| Concept | What It Does | Example |
|---------|-------------|---------|
| `.` | Matches any character (except newline) | `a.c` matches "abc", "aXc" |
| `*` | 0 or more repetitions | `ab*c` matches "ac", "abc", "abbc" |
| `+` | 1 or more repetitions | `ab+c` matches "abc", "abbc" (not "ac") |
| `?` | 0 or 1 repetition | `ab?c` matches "ac", "abc" |
| `[]` | Character class | `[abc]` matches "a" or "b" or "c" |
| `^` | Start of string | `^hello` matches "hello world" but not "say hello" |
| `$` | End of string | `world$` matches "hello world" but not "world peace" |
| `\d` | Any digit | `\d{3}` matches "123", "456" |
| `\w` | Word character (letter, digit, _) | `\w+` matches "hello_123" |
| `\s` | Whitespace | `hello\sworld` matches "hello world" |

## 📚 Curated Resources (in order)

### Interactive Learning (Start Here!)
1. **[regex101.com](https://regex101.com/)** ⭐ TOP CHOICE
   - Interactive pattern tester with live explanation
   - Choose your programming language (Python, JavaScript, PHP, etc.)
   - Great for experimenting immediately
   - **How to use**: Paste a regex pattern, test against sample text, see what matches

2. **[regexr.com](https://regexr.com/)**
   - Visual regex pattern builder
   - Shows matches highlighted on sample text
   - Good for visual learners
   - **How to use**: Type patterns and see results in real-time

### Video Tutorials
3. **[freeCodeCamp RegEx Course (YouTube)](https://www.youtube.com/watch?v=ZfQFUJhPqMM)**
   - Comprehensive 1-hour beginner course
   - Covers fundamentals clearly
   - Watch sections on: metacharacters, quantifiers, character classes

### Written Documentation
4. **[MDN Web Docs - RegExp](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions)**
   - Excellent reference with examples
   - Clear explanations of each component
   - **Focus on**: "Writing a regular expression pattern" section

5. **[Python re module docs](https://docs.python.org/3/library/re.html)**
   - Python-specific regex reference
   - Useful if you use Python primarily
   - Bookmark this for quick lookups

### Cheat Sheets
6. **[Regex Cheat Sheet (GitHub)](https://github.com/ziishaned/learn-regex)**
   - Excellent comprehensive cheat sheet
   - Easy to reference while coding
   - **Save this link!**

## 💡 Practice Exercises

Work through these from easiest to hardest:

### Easy
- Match email addresses: Pattern should match `name@example.com`
- Match phone numbers: Pattern for `123-456-7890`
- Match URLs: Pattern for `https://example.com`

### Medium
- Match HTML tags: Pattern for `<div>`, `<span class="test">`, etc.
- Extract digits from text: Get all numbers from a string
- Match date formats: Pattern for `DD-MM-YYYY` format

**👉 Test your patterns on [regex101.com](https://regex101.com/) as you practice!**

## Code Examples

See [examples/](./examples/) folder for:
- `email_validation.py` - Email pattern in Python
- `phone_number.py` - Phone number patterns
- `url_extractor.py` - Extract URLs from text

## 🎯 Beginner Checklist

- [ ] I understand `.`, `*`, `+`, `?` quantifiers
- [ ] I can use character classes `[]` and ranges `[a-z]`
- [ ] I know `^` and `$` anchors
- [ ] I've used `\d`, `\w`, `\s` escape sequences
- [ ] I can write a basic email validation pattern
- [ ] I've tested patterns on regex101.com

## Next Steps

Once you're comfortable with these basics, move to **[Intermediate RegEx](../intermediate/resources.md)** to learn:
- Groups `()` and capturing
- Backreferences `\1`, `\2`
- Lookahead and lookbehind assertions
