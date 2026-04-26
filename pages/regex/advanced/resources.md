# RegEx for Advanced 🔴

Master performance optimization, engine internals, and edge cases.

## Advanced Topics

| Topic | What You'll Learn |
|-------|------------------|
| Catastrophic Backtracking | Why some patterns are slow, how to fix them |
| Atomic Groups & Possessive Quantifiers | Advanced performance techniques |
| Recursion & Named Groups | Complex pattern matching |
| PCRE vs Standard Regex | Differences between implementations |
| Performance Analysis | Benchmarking and optimization |

## 📚 Curated Resources

1. **[Catastrophic Backtracking Explained](https://www.regular-expressions.info/catastrophic.html)** ⭐
   - Essential for understanding performance issues
   - Real-world examples of failing patterns
   - Solutions and how to write efficient regex

2. **[regular-expressions.info](https://www.regular-expressions.info/)**
   - Comprehensive reference for all things regex
   - Deep dives on engines, features, and optimization
   - Bookmark this site!

3. **[Regex Engine Internals (YouTube - NullByte)](https://www.youtube.com/watch?v=mHJ8dZp1UWk)**
   - Visual explanation of how regex engines work
   - Helps understand why certain patterns are slow

4. **[OWASP - ReDoS (Regular Expression Denial of Service)](https://owasp.org/www-community/attacks/Regular_expression_Denial_of_Service_-_ReDoS)**
   - Security implications of regex patterns
   - Why regex matters in security

5. **[Named Capture Groups (MDN)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions/Named_groups)**
   - More readable group references
   - Python/JavaScript specific

## 💡 Performance Anti-Patterns to Avoid

### Bad: Catastrophic Backtracking
```regex
(a+)+b
```
This will hang on strings like "aaaaaaaaaaaaaaaaaaaaac"

### Better: Atomic grouping / Possessive quantifiers
```regex
(?>a+)b
(a++)b
```
Different syntax by language, but same idea

## Code Examples

See [examples/](./examples/) for:
- `performance_comparison.py` - Benchmarking fast vs slow patterns
- `lookahead_optimization.py` - Efficient lookahead usage

## 🎯 Advanced Checklist

- [ ] I understand catastrophic backtracking
- [ ] I can identify performance issues in patterns
- [ ] I know how to use atomic groups or possessive quantifiers
- [ ] I understand the differences between regex engines
- [ ] I've optimized a slow regex pattern
- [ ] I'm aware of ReDoS security implications

## Resources by Language

- **Python**: `re` module uses NFA engine, supports lookahead but not lookbehind with variable length
- **JavaScript**: Modern engines support most features, be careful with performance
- **PCRE (Perl)**: Most complete, used in PHP and other languages
