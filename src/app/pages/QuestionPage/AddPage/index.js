import React, { Component } from 'react';

import { createQuestion } from 'app/utils/question';
import { transform } from '@babel/standalone';

import ReactPage from './ReactPage';
import JavaScriptPage from './JavaScriptPage';

const getPageComponent = (args) => {
  switch (args.category) {
    case 'react': {
      return <ReactPage {...args} />;
    }
    default: {
      return <JavaScriptPage {...args} />;
    }
  }
};

const reducer = (state, payload) => {
  return Object.keys(payload).reduce((cal, key) => {
    const newCal = { ...cal };
    newCal[key] = payload[key];
    return newCal;
  }, { ...state });
};

class Page extends Component {
  state = {
    category: 'javascript',
    isLoading: false,
    javascript: {
      code: '',
      compiledCode: '',
      test: '',
      tape: [],
      name: '',
      tags: []
    },
    react: {
      code: '',
      compiledCode: '',
      test: '',
      tape: [],
      name: '',
      tags: []
    }
  }

  onChangeCode = (newState) => {
    const { state } = this;
    const { category } = state;
    const { code: newCode, test: newTest } = newState;
    const { code: oldCode, test: oldTest } = state[category];
    const fullCode = `${newCode || oldCode} ${newTest || oldTest}`;
    try {
      const { code: compiledCode } = transform(fullCode, {
        presets: ['es2015', ['stage-2', { decoratorsBeforeExport: true }], 'react'],
        plugins: ['proposal-object-rest-spread']
      });
      this.setState({ compiledCode });
    } catch (e) {
      console.log(e);
    }
  }

  onChangeCategory = (index) => {
    this.setState({ category: index });
  }

  onChangeName = ({ type, name }) => {
    const { state } = this;
    const newState = reducer(state[type], { name });
    this.setState({
      [type]: newState
    });
  }

  onCreateQuestion = async (data) => {
    this.setState({ isLoading: true });
    try {
      await createQuestion(data);
    } catch (e) {
      alert(e.message);
    }
    this.setState({ isLoading: false });
  }

  onEditQuestion = async (data) => {
    this.setState({ isLoading: true });
    try {
      await createQuestion(data);
    } catch (e) {
      alert(e.message);
    }
    this.setState({ isLoading: false });
  }

  onTagUpdate = ({ type, tags }) => {
    const { state } = this;
    const newState = reducer(state[type], { tags });
    this.setState({
      [type]: newState
    });
  }

  onTapeUpdate = ({ type, tape }) => {
    const { state } = this;
    const newState = reducer(state[type], { tape });
    this.setState({
      [type]: newState
    });
  }

  render() {
    const { state } = this;
    const { category, isLoading } = state;
    return (
      <React.Fragment>
        {
          getPageComponent({
            category,
            onSubmit: this.onSubmit,
            onChangeCategory: this.onChangeCategory,
            onTapeUpdate: this.onTapeUpdate,
            onTagUpdate: this.onTagUpdate,
            controlHeight: 70,
            isLoading,
            ...state[category]
          })
        }
      </React.Fragment>
    );
  }
}

export default Page;
