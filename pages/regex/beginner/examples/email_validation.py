"""
Simple Email Validation with RegEx
Demonstrates basic pattern matching: character classes, quantifiers, anchors
"""

import re

# Basic email pattern (simplified)
# Pattern explanation:
# - \w+ : one or more word characters (username)
# - @ : literal @ symbol
# - \w+ : one or more word characters (domain name)
# - \. : literal dot
# - [a-z]{2,} : 2 or more lowercase letters (TLD like .com, .org)
email_pattern = r'^\w+@\w+\.[a-z]{2,}$'

test_emails = [
    "john@example.com",      # ✓ Valid
    "user123@test.org",      # ✓ Valid
    "alice.bob@domain.co.uk", # ✗ Won't match (dot in username)
    "invalid@",              # ✗ Invalid (no domain)
    "@example.com",          # ✗ Invalid (no username)
    "user@domain",           # ✗ Invalid (no TLD)
]

print("Email Validation Results:")
print("-" * 50)
for email in test_emails:
    if re.match(email_pattern, email):
        print(f"✓ {email:25} - VALID")
    else:
        print(f"✗ {email:25} - INVALID")

print("\n" + "=" * 50)
print("Better pattern (handles dots in username):")
print("=" * 50)

# More realistic email pattern
# - [\w.]+ : one or more word chars or dots (username)
# - @ : literal @
# - [\w]+ : domain name
# - \. : literal dot
# - [a-z]{2,} : TLD
better_pattern = r'^\w[\w.]*@\w+\.[a-z]{2,}$'

print("\nBetter Pattern Results:")
print("-" * 50)
for email in test_emails:
    if re.match(better_pattern, email):
        print(f"✓ {email:25} - VALID")
    else:
        print(f"✗ {email:25} - INVALID")
