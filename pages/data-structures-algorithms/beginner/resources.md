# Data Structures & Algorithms for Beginners 🟢

Start with visualization and fundamentals. No prerequisites needed!

## Essential Concepts

| Concept | What It Does | Time Complexity |
|---------|-------------|-----------------|
| Array | Ordered collection, fast access | O(1) lookup |
| Linked List | Dynamic list, efficient insertion | O(n) lookup, O(1) insert |
| Stack | Last-In-First-Out (LIFO) | O(1) push/pop |
| Queue | First-In-First-Out (FIFO) | O(1) enqueue/dequeue |
| Tree | Hierarchical structure | O(log n) if balanced |
| Graph | Nodes and edges | Depends on algorithm |

## Big-O Complexity (The Basics)

| Notation | Time Taken | Example |
|----------|-----------|---------|
| O(1) | Constant | Access array element by index |
| O(n) | Linear | Simple loop through array |
| O(n²) | Quadratic | Nested loops (bubble sort) |
| O(log n) | Logarithmic | Binary search |
| O(n log n) | Linear-logarithmic | Merge sort, quicksort |

## 📚 Curated Resources

### Visualization First!

1. **[VisuAlgo.net](https://visualgo.net/)** ⭐ TOP CHOICE
   - Animate data structures and algorithms
   - Watch them execute step-by-step
   - **Start here**: Arrays, Linked Lists, Stacks, Queues
   - Perfect for visual learners

2. **[Data Structure Visualizations (Berkeley)](https://www.cs.usfca.edu/~galles/visualization/)**
   - Another excellent visualization tool
   - More detailed, more options

### Interactive Learning

3. **[LeetCode Easy Problems](https://leetcode.com/problemset/?difficulty=EASY)**
   - Start with Easy level
   - Build confidence
   - Come back after intermediate level

4. **[HackerRank Data Structures](https://www.hackerrank.com/domains/data-structures)**
   - Beginner-friendly
   - Free tier has many problems

### Video Tutorials

5. **[freeCodeCamp - Data Structures (YouTube)](https://www.youtube.com/watch?v=BBpAmxU_NQo)**
   - 8-hour comprehensive course
   - Watch first 2-3 hours for basics

6. **[Abdul Bari - Data Structures (YouTube)](https://www.youtube.com/playlist?list=PLDN4rrl48XKpZmldwWX_YW6GnzVlRvbPu)**
   - Clear, well-paced
   - Focus on first few videos (Arrays, Linked Lists)

### Written Resources

7. **[GeeksforGeeks - Data Structures](https://www.geeksforgeeks.org/data-structures/)**
   - Quick reference guides
   - Code examples in multiple languages
   - Use for quick lookups

## 💡 Your First Algorithms

### Array Traversal
```python
def print_array(arr):
    for element in arr:
        print(element)
# Time: O(n), Space: O(1)
```

### Linear Search
```python
def linear_search(arr, target):
    for i in range(len(arr)):
        if arr[i] == target:
            return i
    return -1
# Time: O(n), Space: O(1)
```

### Simple Bubble Sort (Beginner)
```python
def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n-i-1):
            if arr[j] > arr[j+1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]
# Time: O(n²), Space: O(1)
```

## Code Examples

See [examples/](./examples/) for:
- `array_basics.py` - Array operations
- `linked_list.py` - Linked List implementation
- `stack_queue.py` - Stack and Queue examples

## 🎯 Beginner Checklist

- [ ] I can explain what Big-O notation means
- [ ] I understand the difference between Array and Linked List
- [ ] I can implement a Stack and Queue
- [ ] I've visualized algorithms on VisuAlgo.net
- [ ] I can trace through Bubble Sort by hand
- [ ] I've coded at least one simple sorting algorithm

## Common Mistakes

❌ **Don't**: Skip visualization and jump to code
✓ **Do**: Visualize first, then code

❌ **Don't**: Memorize complexity
✓ **Do**: Understand why O(n²) is worse than O(n log n)

❌ **Don't**: Try advanced algorithms first
✓ **Do**: Master fundamentals (arrays, lists, stacks)

## Next Steps

Once comfortable, move to **[Intermediate](../intermediate/resources.md)** to learn:
- Trees and Tree Traversal
- Graph Algorithms (BFS, DFS)
- More Sorting Algorithms (Merge Sort, Quick Sort)
- Binary Search
