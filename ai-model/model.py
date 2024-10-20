
import tensorflow as tf
from PIL import Image
import numpy as np

# Load trained model (train a model or use a pre-trained one)
model = tf.keras.models.load_model('path_to_your_model.h5')

def predict_bug(image_path):
    image = Image.open(image_path)
    image = image.resize((224, 224))  # Resize for the model input
    img_array = np.array(image) / 255.0  # Normalize image data
    img_array = np.expand_dims(img_array, axis=0)  # Add batch dimension

    # Predict
    predictions = model.predict(img_array)
    return np.argmax(predictions[0]), max(predictions[0])  # Return class and confidence
