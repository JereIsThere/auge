"""
MNIST Digit Classification - Simple Neural Network
This is the "Hello World" of deep learning!

Note: To run this, you'll need:
  pip install tensorflow numpy

Or use Google Colab (recommended for beginners)
"""

import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
import numpy as np

print("Loading MNIST dataset...")
# Load the MNIST dataset (28x28 grayscale images of handwritten digits)
(x_train, y_train), (x_test, y_test) = keras.datasets.mnist.load_data()

print(f"Training data shape: {x_train.shape}")
print(f"Training labels shape: {y_train.shape}")

# Normalize pixel values from [0, 255] to [0, 1]
x_train = x_train.astype("float32") / 255.0
x_test = x_test.astype("float32") / 255.0

# Flatten images from 28x28 to 784-dimensional vectors
x_train_flat = x_train.reshape(-1, 28*28)
x_test_flat = x_test.reshape(-1, 28*28)

print(f"Flattened training shape: {x_train_flat.shape}")

# Build a simple neural network
print("\nBuilding model...")
model = keras.Sequential([
    layers.Dense(128, activation='relu', input_shape=(784,)),
    layers.Dense(64, activation='relu'),
    layers.Dense(10, activation='softmax')  # 10 output classes (0-9)
])

# Compile the model
model.compile(
    loss='sparse_categorical_crossentropy',  # For integer labels
    optimizer='adam',  # Adam optimizer
    metrics=['accuracy']
)

# Print model summary
model.summary()

# Train the model
print("\nTraining model...")
history = model.fit(
    x_train_flat, y_train,
    batch_size=32,
    epochs=10,
    validation_split=0.1  # Use 10% of training data for validation
)

# Evaluate on test set
print("\nEvaluating on test set...")
test_loss, test_accuracy = model.evaluate(x_test_flat, y_test)
print(f"Test accuracy: {test_accuracy:.4f}")

# Make predictions
print("\nMaking predictions on first 5 test images...")
predictions = model.predict(x_test_flat[:5])
for i in range(5):
    pred_digit = np.argmax(predictions[i])
    true_digit = y_test[i]
    confidence = predictions[i][pred_digit]
    print(f"Image {i}: Predicted {pred_digit}, Actual {true_digit}, Confidence {confidence:.2%}")
