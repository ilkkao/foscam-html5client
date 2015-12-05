import {
    COMPLETE_LOGIN_SUCCESS,
    COMPLETE_LOGIN_FAILURE,
    LOGOUT
} from '../actions/session';

export default function session(state = { loggedIn: false, loginFailureReason: '' }, action) {
    switch (action.type) {
        case COMPLETE_LOGIN_SUCCESS:
            return {
                loggedIn: true,
                loginFailureReason: '',
                secret: action.secret
            };
        case COMPLETE_LOGIN_FAILURE:
            return {
                loggedIn: false,
                loginFailureReason: action.reason
            };
        case LOGOUT:
            return {
                loggedIn: false,
                loginFailureReason: ''
            };
        default:
            return state;
    }
}
