import { connect } from 'react-redux';
import Main from '../components/main';

function mapStateToProps(state) {
    return {
        loggedIn: state.session.get('loggedIn'),
        failureReason: state.session.get('loginFailureReason'),
        secret: state.session.get('secret'),
        hits: state.session.get('hits'),
        imageUrl: state.session.get('imageUrl')
    };
}

export default connect(mapStateToProps)(Main);
