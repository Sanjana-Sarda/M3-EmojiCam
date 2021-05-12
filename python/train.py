import numpy as np
import scipy.io as sio
import sklearn
from sklearn.model_selection import train_test_split
import pickle
from keras.utils import np_utils
from keras.models import Sequential
from keras.layers import Dense, Dropout, Flatten, Conv2D, MaxPooling2D
from keras import optimizers
import tensorflowjs as tfjs

with open("features", "rb") as f:
  X_data = np.array(pickle.load(f))
with open("labels", "rb") as f:
  y_data = np.array(pickle.load(f))

y_data = np_utils.to_categorical(y_data)

X_train_val, X_test, y_train_val, y_test= train_test_split(X_data, y_data, test_size=0.15)

X_train, X_val, y_train, y_val= train_test_split(X_train_val, y_train_val, test_size=0.15)

X_train = X_train.reshape(X_train.shape[0], 28, 28, 1)
X_val = X_val.reshape(X_val.shape[0], 28, 28, 1)
X_test = X_test.reshape(X_test.shape[0], 28, 28, 1)


print ('Training/Valid data shape: {}'.format(X_train_val.shape))
print ('Test data shape: {}'.format(X_test.shape))
print ('Training/Valid target shape: {}'.format(y_train_val.shape))
print ('Test target shape: {}'.format(y_test.shape))



emoji = 5

model = Sequential()

model.add(Conv2D(32, (5, 5), input_shape=(28,28,1), activation='relu'))   
model.add(MaxPooling2D(pool_size=(2, 2), strides=(2, 2), padding='same'))
model.add(Conv2D(64, (5, 5), activation='relu'))
model.add(MaxPooling2D(pool_size=(2, 2), strides=(2, 2), padding='same'))

model.add(Flatten())
model.add(Dense(512, activation='relu'))
model.add(Dropout(0.5))
model.add(Dense(128, activation='relu'))
model.add(Dropout(0.5))
model.add(Dense(emoji, activation='softmax'))

model.compile(loss='categorical_crossentropy', optimizer='adam', metrics=['accuracy'])
print (model.summary());

history=model.fit(X_train, y_train, validation_data=(X_val, y_val), batch_size=64, epochs=3)

score_val = model.evaluate(X_val, y_val, batch_size=20)
score_test = model.evaluate(X_test, y_test, batch_size=20)

print('Validation [loss, accuracy] is ', score_val)
print('Test [loss, accuracy] is ', score_test)


tfjs.converters.save_keras_model(model, 'models')