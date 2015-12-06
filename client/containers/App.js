import { connect } from 'react-redux';
import Main from '../components/main';

function mapStateToProps(state) {
    console.log(state.session.get('loggedIn'))

    return {
        loggedIn: state.session.get('loggedIn'),
        failureReason: state.session.get('loginFailureReason'),
        secret: state.session.get('secret'),
        hits: state.session.get('hits')
    };
}

export default connect(mapStateToProps)(Main);
