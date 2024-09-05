import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const usersAdapter = createEntityAdapter({})

const intialState = usersAdapter.getInitialState()

export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getUsers: builder.query({
            query: () => '/users',
            validateStatus: (response, result) => {
                return response.status === 200 && !result.isError
            },
            keepUnusedDataFor: 5,
            transformResponse: responseDate => {
                const loadedUsers = responseData.map(user => {
                    user.id = user._id
                    return user
                });
                return usersAdapter.setAll(initialState, loadedUsers)
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'User', id: 'LIST'},
                        ...result.ids.map(id => ({ type: 'User', id}))
                    ]
                } else return [{ type: 'User', id: 'LIST'}]
            }
        }),
    }),
})

export const {
    useGetUsersQuery,
} = usersApiSlice

// returns the query result object
export const selectUsersResult = userssApiSlice.endpoints.getUsers.select()

//creates memoized selector
const selectUsersData = createSelector(
    selectUsersResult,
    usersResult => usersResult.data // normalized state object with ids and entities
)

//getSelectors creates selectors and renames them with aliases using destructuring
export const {
    selectAll: selectAllUsers,
    selectById: selectUserById,
    selectIds: selectUserIds
    // Pass in a selector that returns the users slice of state

} = usersAdapter.getSelectors(state => selectUsersData(state) ?? intialState)