# TensorFlow & Keras for Beginners 🟢

Start your ML journey! No experience with neural networks needed.

## Essential Concepts

| Concept | What It Is | Why It Matters |
|---------|-----------|----------------|
| Neural Network | Interconnected nodes (neurons) | Foundation of deep learning |
| Layer | Collection of neurons | Builds up the network |
| Activation Function | Non-linearity in neurons | Enables learning complex patterns |
| Loss Function | Measures prediction error | Guides training |
| Optimizer | Updates weights | Makes network learn |
| Epoch | Full pass through data | Training iteration |
| Batch | Subset of training data | Efficient training |

## Prerequisites

Make sure you have these Python fundamentals down:

1. **Python Syntax**: Variables, loops, functions, lists, dictionaries
2. **NumPy**: Arrays, matrix operations (5-10 hours to learn basics)
3. **Pandas**: DataFrames, data loading (5-10 hours to learn basics)

### Quick Refresher

- **NumPy**: [NumPy for Beginners (Real Python)](https://realpython.com/numpy-array-programming/)
- **Pandas**: [Pandas Tutorial (Mode Analytics)](https://mode.com/sql-tutorial/introduction-to-sql/)

## 📚 Curated Resources

### Setup & Environment

1. **[Google Colab](https://colab.research.google.com/)** ⭐ TOP CHOICE
   - Free cloud notebook environment
   - Built-in GPU support (perfect for ML)
   - No installation needed
   - **Use this for learning!**

2. **[TensorFlow Installation](https://www.tensorflow.org/install)**
   - If you want to install locally
   - Colab is easier for beginners

### Video Courses

3. **[TensorFlow for Beginners (YouTube - TF Official)](https://www.youtube.com/watch?v=Z9gV5FMnWQ8&list=PLQY2H8rRoyvwLbzbnKJ59NlateRsVGAwcPt)**
   - Official TensorFlow beginner course
   - ~2 hours, clear explanations
   - **Start here!**

4. **[freeCodeCamp - TensorFlow Course (YouTube)](https://www.youtube.com/watch?v=tPYj3fFJGjk)**
   - Comprehensive 4-hour course
   - Covers basics through intermediate

5. **[Andrew Ng - Machine Learning Specialization (Coursera)](https://www.coursera.org/specializations/machine-learning-introduction)**
   - Foundational ML theory
   - More theoretical, less practical
   - Free to audit

### Interactive Learning

6. **[Kaggle Learn - TensorFlow](https://www.kaggle.com/learn/intro-to-deep-learning)**
   - Hands-on micro-courses
   - ~2-3 hours per topic
   - Excellent for learning by doing

7. **[Google Colab Notebooks - Examples](https://colab.research.google.com/#create=true&folderId=1)**
   - Create a new notebook
   - Try TensorFlow tutorials

### Documentation

8. **[TensorFlow Official Guide](https://www.tensorflow.org/guide)** 
   - Reference for Keras API
   - Examples for common tasks

9. **[Keras Documentation](https://keras.io/)**
   - Simpler, more focused
   - Great for quick lookups

## 💡 Your First Neural Network

```python
import tensorflow as tf
from tensorflow import keras

# Load MNIST dataset
(X_train, y_train), (X_test, y_test) = keras.datasets.mnist.load_data()

# Normalize
X_train = X_train / 255.0
X_test = X_test / 255.0

# Build model
model = keras.Sequential([
    keras.layers.Dense(128, activation='relu', input_shape=(784,)),
    keras.layers.Dense(64, activation='relu'),
    keras.layers.Dense(10, activation='softmax')
])

# Compile
model.compile(
    loss='sparse_categorical_crossentropy',
    optimizer='adam',
    metrics=['accuracy']
)

# Train
model.fit(X_train, y_train, epochs=10, batch_size=32)

# Evaluate
model.evaluate(X_test, y_test)
```

This trains a simple neural network on MNIST in ~20 lines of code!

## Code Examples

See [examples/](./examples/) for:
- `first_neural_network.py` - Your first model
- `mnist_classifier.py` - MNIST digit classification
- `simple_regression.py` - Predicting continuous values

## 🎯 Beginner Checklist

- [ ] I'm comfortable with Python basics
- [ ] I understand NumPy arrays and operations
- [ ] I can load and explore data with Pandas
- [ ] I can set up TensorFlow/Keras in Google Colab
- [ ] I've trained a neural network on MNIST
- [ ] I understand the concept of epochs and batches
- [ ] I can evaluate a model's performance

## Common Mistakes to Avoid

❌ **Don't**: Jump to advanced architectures before mastering basics
✓ **Do**: Master dense networks first, then move to CNN/RNN

❌ **Don't**: Use raw data without normalization
✓ **Do**: Always normalize features to [0,1] or [-1,1] range

❌ **Don't**: Train for too many epochs
✓ **Do**: Watch for overfitting, use validation sets

❌ **Don't**: Use large batch sizes without a reason
✓ **Do**: Start with batch_size=32 or 64

## Next Steps

Once you've trained your first model, move to **[Intermediate](../intermediate/resources.md)** to learn:
- Convolutional Neural Networks (CNNs) for image classification
- Recurrent Neural Networks (RNNs/LSTMs) for sequences
- Model evaluation techniques
- Hyperparameter tuning
