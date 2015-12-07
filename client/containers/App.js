import { connect } from 'react-redux';
import Main from '../components/main';

function mapStateToProps(state) {
    const session = state.session;

    return {
        loggedIn: session.get('loggedIn'),
        failureReason: session.get('loginFailureReason'),
        secret: session.get('secret'),
        hits: session.get('hits'),
        imageUrl: session.get('imageUrl'),
        imageTs: session.get('imageTs')
    };
}

export default connect(mapStateToProps)(Main);
