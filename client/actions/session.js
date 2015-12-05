import Cookies from 'js-cookie';

export const COMPLETE_LOGIN_SUCCESS = 'COMPLETE_LOGIN_SUCCESS';
export const COMPLETE_LOGIN_FAILURE = 'COMPLETE_LOGIN_FAILURE';
export const LOGOUT = 'LOGOUT';

export function startLogin(password) {
    return dispatch => {
        return fetch(`/api/login?password=${password}`)
            .then(response => handleResponse(response))
            .then(json => {
                if (json.status === 'ok') {
                    Cookies.set('secret', json.secret, { expires: 30 }); // days
                    dispatch(completeLoginSuccess(json.secret));
                } else {
                    return Promise.reject(new Error(json.reason));
                }
            })
            .catch(error => {
                dispatch(completeLoginFailure(error.message));
            });
    };
}

export function completeLoginSuccess(secret) {
    return { type: COMPLETE_LOGIN_SUCCESS, secret: secret };
}

export function completeLoginFailure(reason) {
    return { type: COMPLETE_LOGIN_FAILURE, reason: reason };
}

export function verifySession(secret) {
    return dispatch => {
        return fetch(`/api/session?secret=${secret}`)
            .then(response => handleResponse(response))
            .then(json => {
                if (json.status === 'ok') {
                    dispatch(completeLoginSuccess(secret));
                } else {
                    dispatch(completeLoginFailure(error.message));
                }
            });
    };
}

export function logout() {
    Cookies.remove('secret');

    return { type: LOGOUT };
}

function handleResponse(response) {
    if (response.status === 200) {
        return response.json();
    } else {
        return Promise.reject(new Error('Network error'));
    }
}
