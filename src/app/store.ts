import { configureStore } from '@reduxjs/toolkit'
import projectReducer from '../features/project/projectSlice'
import zonesSlice from '../features/zones/zonesSlice'

export const store = configureStore({
  reducer: {
    project: projectReducer,
    zones: zonesSlice,
  }
})

export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
