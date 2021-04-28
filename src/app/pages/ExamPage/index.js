import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { transform } from '@babel/standalone';

import { changeCode } from 'app/actions/code';
import { resetConsole } from 'app/actions/console';

import createWrappedConsole from 'app/utils/consoleFactory';
import { getStateInformation } from 'app/utils/stateHelper';

import ReactPage from './ReactPage';
import JavaScriptPage from './JavaScriptPage';

const getPageComponent = (args) => {
  switch (args.index) {
    case 1: {
      return <ReactPage {...args} />;
    }
    default: {
      return <JavaScriptPage {...args} />;
    }
  }
};

class Page extends Component {
  constructor(props) {
    super(props);
    const { actions } = this.props;
    const { _dispatch: dispatch } = actions;
    this.wrappedConsole = createWrappedConsole(console, dispatch);
  }

  componentDidMount() {
    const { state, history } = this.props;
    if (!state.login.isLogin) {
      history.push('/login');
      return;
    }
    const { code } = getStateInformation(state);
    this.handleCodeChange(code);
  }

  componentDidUpdate(prevProps) {
    const { state: previousState } = prevProps;
    const { state, history } = this.props;
    const { categoryIndex: previousCategoryIndex } = getStateInformation(previousState);
    const { categoryIndex, code } = getStateInformation(state);
    if (previousCategoryIndex !== categoryIndex) {
      this.handleCodeChange(code);
    }
    if (!state.login.isLogin) {
      history.push('/login');
      return;
    }
  }

  handleCodeChange = (newCode) => {
    const { actions, state } = this.props;
    const { question, type } = getStateInformation(state);
    const fullCode = `${newCode} ${question.test}`;
    try {
      const { code } = transform(fullCode, {
        presets: ['es2015', ['stage-2', { decoratorsBeforeExport: true }], 'react'],
        plugins: ['proposal-object-rest-spread']
      });
      actions.changeCode({ compiledCode: code, rawCode: newCode, type });
    } catch (e) {
      actions.changeCode({ rawCode: newCode, type });
      actions.resetConsole();
      this.wrappedConsole.log(e);
    }
  }

  render() {
    const { state } = this.props;
    const { handleCodeChange, wrappedConsole } = this;
    return (
      <React.Fragment>
        { getPageComponent({ index: state.category.index, handleCodeChange, wrappedConsole }) }
      </React.Fragment>
    );
  }
}

export default withRouter(connect(
  (state) => {
    return {
      state
    };
  },
  (dispatch) => {
    return {
      actions: {
        resetConsole: () => dispatch(resetConsole()),
        changeCode: args => dispatch(changeCode({ ...args, type: (args.type || 'javascript').toUpperCase() })),
        _dispatch: dispatch
      }
    };
  }
)(Page));
