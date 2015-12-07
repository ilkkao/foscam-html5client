import Cookies from 'js-cookie';
import { Map } from 'immutable';
import {
    COMPLETE_LOGIN_SUCCESS,
    COMPLETE_LOGIN_FAILURE,
    UPDATE_HITS,
    SHOW_IMAGE,
    LOGOUT
} from '../actions/session';

const initialState = Map({
    loggedIn: false,
    loginFailureReason: '',
    secret: '',
    hits: '',
    imageUrl: '',
});

function parseImageDataUrl(image) {
    const blob = new Blob([ new Uint8Array(image) ]);
    return window.URL.createObjectURL(blob);
}

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
        case SHOW_IMAGE:
            return state.merge({
                imageUrl: parseImageDataUrl(action.image)
            });
        default:
            return state;
    }
}
