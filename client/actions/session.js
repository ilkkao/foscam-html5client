export const START_LOGIN = 'START_LOGIN';
export const COMPLETE_LOGIN_SUCCESS = 'COMPLETE_LOGIN_SUCCESS';
export const COMPLETE_LOGIN_FAILURE = 'COMPLETE_LOGIN_FAILURE';

export const LOGOUT = 'LOGOUT';

export function startLogin(password) {
    return dispatch => {
        return fetch(`/login?password=${password}`)
            .then(response => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    return Promise.reject(new Error('Network error'));
                }
            })
            .then(json => {
                if (json.status === 'ok') {
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

export function logout() {
    return { type: LOGOUT };
}
