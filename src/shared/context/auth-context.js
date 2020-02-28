import React from 'react';

export const AuthContext = React.createContext();
export const initialState = {
    isAuthenticated: false,
    userId: null,
    token: null,
    refresh: false
};
export const reducer = (state, action) => {
    switch (action.type) {
        case "LOGIN":
            localStorage.setItem("userls", action.payload.userId);
            localStorage.setItem("tokenls", action.payload.token);
            return {
                ...state,
                isAuthenticated: true,
                userId: action.payload.userId,
                token: action.payload.token
            };
        case "LOGOUT":
            localStorage.removeItem("userls");
            localStorage.removeItem("tokenls");
            return {
                ...state,
                isAuthenticated: false,
                userId: null,
                token: null
            };

        case "REFRESH":
            return {
                ...state,
                refresh: action.payload.refreshVal
            };
        default:
            return state;
    }
};