import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import rootReducer from './Reducers/RootReducer';
import rootSaga from './Saga/RootSaga';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { encryptTransform } from 'redux-persist-transform-encrypt';

// Configure your encryption transform
const encryptor = encryptTransform({
  secretKey: 'bjhcvdygvhnwoicbvyuridbiushvyudhbciu',
  onError: function(error) {
    console.error('Encryption Error:', error);
  },
});

const sagaMiddleware = createSagaMiddleware();

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['internet', 'actors'],
  transforms: [encryptor], // encrypt k lie kia
};

// Wrap kie rootReducer with persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // serializableCheck: {
      //   ignoredActions: [
      //     'persist/PERSIST',
      //     'persist/REHYDRATE',
      //     'actors/setActor',
      //     'internet/loginSuccess',
      //     'internet/loginFailure',
      //   ],
      //   ignoredPaths: ['actors.actor', 'internet.identity', 'internet.defaultidentity'],
      //   ignoredActionPaths: ['payload.identity', 'payload.actor', 'payload.defaultidentity'],
      // },
      serializableCheck: false, 
    }).concat(sagaMiddleware),
});


sagaMiddleware.run(rootSaga); 

export const persistor = persistStore(store);
export default store;
