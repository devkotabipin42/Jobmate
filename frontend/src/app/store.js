import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import { combineReducers } from '@reduxjs/toolkit'
import authReducer from '../features/auth/auth.slice.js'
import themeReducer from '../features/themes/theme.slice.js'
import jobReducer from '../features/jobs/job.slice.js'
import employerReducer from '../features/employer/employer.slice.js'
// Custom storage — Vite ke saath kaam karta hai
const storage = {
    getItem: (key) => {
        return Promise.resolve(localStorage.getItem(key))
    },
    setItem: (key, value) => {
        localStorage.setItem(key, value)
        return Promise.resolve()
    },
    removeItem: (key) => {
        localStorage.removeItem(key)
        return Promise.resolve()
    }
}

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['auth', 'theme']
}

const rootReducer = combineReducers({
    auth: authReducer,
    theme: themeReducer,
    jobs: jobReducer,
    employer: employerReducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false
        })
})

export const persistor = persistStore(store)
export default store