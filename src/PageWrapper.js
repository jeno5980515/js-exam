import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { logout } from 'app/actions/login';

const PageWrapper = (props) => {
	setTimeout(() => {
		props.actions.logout();
	}, 1000 * 60 * 60)
	return (<div>{props.children}</div>)
}

export default withRouter(connect(
  (state) => {
    return {
      isLogin: state.login.isLogin
    };
  },
  (dispatch) => {
    return {
      actions: {
        logout: () => dispatch(logout())
      }
    };
  }
)(PageWrapper));
