"""
Phone Number & URL Extraction Examples
Demonstrates: character classes, quantifiers, escape sequences, groups
"""

import re

print("=" * 60)
print("PHONE NUMBER MATCHING")
print("=" * 60)

# Phone pattern: matches formats like 123-456-7890 or (123) 456-7890
phone_pattern = r'\d{3}-\d{3}-\d{4}'

text_with_phones = """
Contact us at:
- 555-123-4567
- 555-987-6543
- Call 123456789 (this won't match - no dashes)
- (555) 123-4567 (this won't match - parentheses format)
"""

print("Pattern:", phone_pattern)
print("\nMatches found:")
matches = re.findall(phone_pattern, text_with_phones)
for match in matches:
    print(f"  ✓ {match}")

print("\n" + "=" * 60)
print("URL EXTRACTION")
print("=" * 60)

# URL pattern: matches http:// or https:// followed by domain
# \w+ : domain name
# \.  : literal dot
# \w+ : TLD (com, org, etc)
url_pattern = r'https?://\w+\.\w+'

text_with_urls = """
Check out these websites:
- https://example.com
- http://google.com
- https://github.io
- visit example.com (won't match - no http://)
"""

print("Pattern:", url_pattern)
print("\nMatches found:")
url_matches = re.findall(url_pattern, text_with_urls)
for match in url_matches:
    print(f"  ✓ {match}")

print("\n" + "=" * 60)
print("DIGIT EXTRACTION")
print("=" * 60)

# Extract all numbers from text using \d+
digit_pattern = r'\d+'

text_with_numbers = "I have 2 cats, 3 dogs, and 10 birds. Total: 15 pets!"

print("Pattern:", digit_pattern)
print("Text:", text_with_numbers)
print("\nNumbers found:")
numbers = re.findall(digit_pattern, text_with_numbers)
for num in numbers:
    print(f"  ✓ {num}")
