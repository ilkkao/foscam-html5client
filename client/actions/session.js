export const START_LOGIN = 'START_LOGIN';
export const COMPLETE_LOGIN_SUCCESS = 'COMPLETE_LOGIN_SUCCESS';
export const COMPLETE_LOGIN_FAILURE = 'COMPLETE_LOGIN_FAILURE';
export const UPDATE_HITS = 'UPDATE_HITS';
export const LOGOUT = 'LOGOUT';
export const START_IMAGE_LOADING = 'START_IMAGE_LOADING';
export const SHOW_IMAGE = 'SHOW_IMAGE';
export const GET_IMAGE = 'GET_IMAGE';

export function startLogin(password) {
    return { type: START_LOGIN, meta: { remote: true }, password: password };
}

export function completeLoginSuccess(secret) {
    return { type: COMPLETE_LOGIN_SUCCESS, secret: secret };
}

export function completeLoginFailure(reason) {
    return { type: COMPLETE_LOGIN_FAILURE, reason: reason };
}

export function getImage() {
    return { type: GET_IMAGE, meta: { remote: true } };
}

export function logout() {
    return { type: LOGOUT, meta: { remote: true } };
}
