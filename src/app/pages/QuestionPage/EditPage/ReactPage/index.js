import React, { Component } from 'react';
import 'brace';
import 'brace/mode/jsx';
import 'brace/mode/javascript';
import 'brace/theme/textmate';
import 'brace/theme/monokai';

import { Spin } from 'antd';

import { transform } from '@babel/standalone';
import Grid from 'app/components/Grid';
import GridItem from 'app/components/Grid/GridItem';
import CodeWidget from 'app/components/Widgets/CodeWidget';
import ResultWidget from 'app/components/Widgets/ResultWidget';
import AnswerWidget from 'app/components/Widgets/AnswerWidget';

import { listQuestions, getQuestion } from 'app/utils/question';
import debouncedRunCode from 'app/utils/runCode';

import ControlWidget from 'app/components/Widgets/ControlWidget/Edit';
import TagWidget from '../../TagWidget';
import styles from './ReactPage.module.scss';


class ReactPage extends Component {
  constructor(props) {
    super(props);
    this.controlHeight = 70;
    this.state = {
      code: '',
      compiledCode: '',
      test: '',
      name: '',
      tags: [],
      index: 0,
      questionList: [],
      isLoading: false
    };
  }

  async componentDidMount() {
    const { compiledCode } = this.state;
    this.setState({ isLoading: true });
    const result = await listQuestions('react');
    this.setState({ questionList: result.data.listQuestions.items, isLoading: false });
    debouncedRunCode({ code: compiledCode, onTapeUpdate: this.addTape });
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { compiledCode: previousCompiledCode } = this.state;
    const { compiledCode } = nextState;
    if (previousCompiledCode !== compiledCode) {
      // this.setState({ tape: [] }, () => {
      debouncedRunCode({ code: compiledCode });
      // });
    }
    return true;
  }

  onCodeChange = () => {
    const { code, test } = this.state;
    const fullCode = `${code} ${test}`;
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

  onTagUpdate = (tags) => {
    this.setState({ tags });
  }

  onSubmit = async () => {
    const {
      tags,
      code,
      test,
      id
    } = this.state;
    const { onSubmit } = this.props;
    this.setState({ isLoading: true });
    await onSubmit({
      id,
      tags,
      code,
      test
    });
    this.setState({ isLoading: false });
  }

  onChangeQuestion = async (index) => {
    const { questionList } = this.state;
    const { id } = questionList[index];
    this.setState({ isLoading: true, index });
    const result = await getQuestion({ id });
    const { tags, content: code, test } = result.data.getQuestion;
    this.setState({
      tags,
      code,
      test,
      isLoading: false,
      id
    });
  }

  render() {
    const {
      test,
      code,
      tags,
      isLoading,
      questionList,
      index
    } = this.state;
    const { onChangeCategory, categoryIndex } = this.props;
    const layout = [
      {
        key: 'code', x: 0, y: 0, width: window.innerWidth / 2, height: window.innerHeight / 2, minWidth: 100, minHeight: 100, maxWidth: 700, maxHeight: 500
      },
      {
        key: 'test', x: 0, y: 1, width: window.innerWidth / 2, height: window.innerHeight / 2, minWidth: 100, maxWidth: 700
      },
      {
        key: 'control', x: 1, y: 0, width: window.innerWidth / 2, height: this.controlHeight, static: true
      },
      {
        key: 'result', x: 1, y: 1, width: window.innerWidth / 2, height: (window.innerHeight - this.controlHeight) / 2 - 100, minWidth: 100, minHeight: 100, maxWidth: 700, maxHeight: 500
      },
      {
        key: 'answer', x: 1, y: 2, width: window.innerWidth / 2, height: (window.innerHeight - this.controlHeight) / 2 - 100, minWidth: 100, minHeight: 100, maxWidth: 700, maxHeight: 500
      },
      {
        key: 'tag', x: 1, y: 3, width: window.innerWidth / 2, height: 200, minWidth: 100, minHeight: 100, maxWidth: 700, maxHeight: 500
      },
    ];
    return (
      <div className={styles.app}>    
        <Spin spinning={isLoading} size="large">
          <Grid layout={layout} totalWidth="100%" totalHeight="100%" autoResize>
            <GridItem key="code">
              <CodeWidget
                handleCodeChange={(newCode) => {
                  this.setState({ code: newCode }, this.onCodeChange);
                }}
                data={code}
                mode="jsx"
                theme="monokai"
              />
            </GridItem>
            <GridItem key="test">
              <CodeWidget
                handleCodeChange={(newCode) => {
                  this.setState({ test: newCode }, this.onCodeChange);
                }}
                data={test}
                mode="jsx"
                theme="textmate"
              />
            </GridItem>
            <GridItem key="answer">
              <AnswerWidget />
            </GridItem>
            <GridItem key="control">
              <ControlWidget
                type="react"
                onChangeName={name => this.setState({ name })}
                onSubmit={this.onSubmit}
                onChangeCategory={onChangeCategory}
                categoryIndex={categoryIndex}
                questionIndex={index}
                questionList={questionList}
                onChangeQuestion={this.onChangeQuestion}
              />
            </GridItem>
            <GridItem key="result">
              <ResultWidget />
            </GridItem>
            <GridItem key="tag">
              <TagWidget data={tags} onTagUpdate={this.onTagUpdate}/>
            </GridItem>
          </Grid>
        </Spin>
      </div>
    );
  }
}

export default ReactPage;
