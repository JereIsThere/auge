"""
Array Basics - Fundamental operations and complexities
Demonstrates: access, search, insertion, deletion
"""

# Basic Array Operations
arr = [1, 2, 3, 4, 5]

print("=" * 50)
print("ARRAY BASICS")
print("=" * 50)

# Access - O(1)
print(f"\nAccess element at index 2: {arr[2]}")

# Search - O(n)
def linear_search(arr, target):
    """Find target in array - O(n)"""
    for i in range(len(arr)):
        if arr[i] == target:
            return i
    return -1

print(f"Linear search for 4: index {linear_search(arr, 4)}")

# Insert at end - O(1)
arr.append(6)
print(f"After append(6): {arr}")

# Insert in middle - O(n) (elements shift)
arr.insert(2, 10)
print(f"After insert at index 2: {arr}")

# Delete - O(n) (elements shift)
arr.pop(2)
print(f"After removing index 2: {arr}")

print("\n" + "=" * 50)
print("ARRAY TRAVERSAL")
print("=" * 50)

# For loop - O(n)
print("\nTraverse with for loop:")
for i in range(len(arr)):
    print(f"  arr[{i}] = {arr[i]}")

# Enumerate - O(n)
print("\nTraverse with enumerate:")
for i, val in enumerate(arr):
    print(f"  Index {i}: value {val}")

print("\n" + "=" * 50)
print("TIME COMPLEXITY SUMMARY")
print("=" * 50)

print("""
Operation       | Time Complexity | Why?
---|---|---
Access          | O(1)           | Direct index lookup
Search          | O(n)           | May need to check all elements
Insert at end   | O(1)           | Just append
Insert at start | O(n)           | All elements shift right
Delete at end   | O(1)           | Just remove last
Delete at start | O(n)           | All elements shift left
""")
