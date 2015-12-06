import Cookies from 'js-cookie';
import { Map } from 'immutable';
import {
    COMPLETE_LOGIN_SUCCESS,
    COMPLETE_LOGIN_FAILURE,
    UPDATE_HITS,
    LOGOUT
} from '../actions/session';

const initialState = Map({
    loggedIn: false,
    loginFailureReason: '',
    secret: '',
    hits: ''
});

export default function session(state = initialState, action) {
    switch (action.type) {
        case COMPLETE_LOGIN_SUCCESS:
            Cookies.set('secret', action.secret, { expires: 30 }); // days
            return state.merge({
                loggedIn: true,
                secret: action.secret
            });
        case COMPLETE_LOGIN_FAILURE:
            Cookies.remove('secret');
            return state.merge({
                loggedIn: false,
                loginFailureReason: action.reason
            });
        case UPDATE_HITS:
            return state.merge({
                hits: action.hits
            });
        case LOGOUT:
            Cookies.remove('secret');
            return state.merge({
                loggedIn: false,
                loginFailureReason: ''
            });
        default:
            return state;
    }
}
