import { connect } from 'react-redux';
import Main from '../components/main';

function mapStateToProps(state) {
    return {
        loggedIn: state.session.loggedIn,
        failureReason: state.session.loginFailureReason,
        secret: state.session.secret
    };
}

export default connect(mapStateToProps)(Main);
