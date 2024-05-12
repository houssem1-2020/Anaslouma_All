// reducers.js
const initialState = {
    isLogged: false
};

const rootReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_USER_IS_LOGGED':
            return {
                ...state,
                isLogged: action.payload
            };
        default:
            return state;
    }
};

export default rootReducer;
