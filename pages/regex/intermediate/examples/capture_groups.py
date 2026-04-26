"""
Capturing Groups - Extract Data from Patterns
Demonstrates: groups () and accessing captured data
"""

import re

print("=" * 60)
print("EXTRACTING NAME AND EMAIL")
print("=" * 60)

# Pattern with 2 capturing groups: name and email
# ([\w\s]+) : captures full name
# <(.+?)> : captures email inside angle brackets
pattern = r'([\w\s]+)<(.+?)>'

text = """
Contact information:
John Doe <john@example.com>
Alice Smith <alice@test.org>
Bob Johnson <bob@domain.co>
"""

matches = re.findall(pattern, text)
print("Extracted name and email pairs:")
for name, email in matches:
    print(f"  Name: {name.strip():20} | Email: {email}")

print("\n" + "=" * 60)
print("PHONE NUMBER WITH GROUPS")
print("=" * 60)

# Extract phone parts: area code, exchange, line
phone_pattern = r'(\d{3})-(\d{3})-(\d{4})'
phone = "Call me at 555-123-4567"

match = re.search(phone_pattern, phone)
if match:
    area_code = match.group(1)
    exchange = match.group(2)
    line = match.group(3)
    full_number = match.group(0)  # group(0) is always the full match

    print(f"Full match:  {full_number}")
    print(f"Area code:   {area_code}")
    print(f"Exchange:    {exchange}")
    print(f"Line number: {line}")

print("\n" + "=" * 60)
print("SUBSTITUTE WITH GROUPS")
print("=" * 60)

# Reorder captured groups in replacement
# Original format: FirstName LastName
# New format: LastName, FirstName

pattern = r'(\w+)\s+(\w+)'
text = "John Doe"
result = re.sub(pattern, r'\2, \1', text)

print(f"Original: {text}")
print(f"After re.sub with groups: {result}")

print("\n" + "=" * 60)
print("NON-CAPTURING GROUPS")
print("=" * 60)

# (?:...) doesn't create a capturing group - useful for grouping logic
# This matches ".com" or ".org" or ".net" without capturing the dot

pattern_with_capture = r'(\w+)(\.\w+)'
pattern_non_capture = r'(\w+)(?:\.\w+)'

email = "john@example.com"

matches_with = re.findall(pattern_with_capture, email)
matches_without = re.findall(pattern_non_capture, email)

print(f"Email: {email}")
print(f"With capturing groups: {matches_with}")
print(f"With non-capturing groups: {matches_without}")
print("✓ Non-capturing groups are cleaner when you don't need that value!")
