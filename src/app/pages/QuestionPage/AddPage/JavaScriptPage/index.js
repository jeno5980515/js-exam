import React, { Component } from 'react';
import 'brace';
import 'brace/mode/javascript';
import 'brace/theme/textmate';
import 'brace/theme/monokai';

import { Spin } from 'antd';

import { transform } from '@babel/standalone';
import Grid from 'app/components/Grid';
import GridItem from 'app/components/Grid/GridItem';
import CodeWidget from 'app/components/Widgets/CodeWidget';
import TestWidget from 'app/components/Widgets/TestWidget';
import TapeWidget from 'app/components/Widgets/TapeWidget';

import { changeCategory } from 'app/actions/category';

import { getCategories } from 'app/questions/index';
import debouncedRunCode from 'app/utils/runCode';

import ControlWidget from 'app/components/Widgets/ControlWidget/Add';
import TagWidget from '../../TagWidget';
import styles from './JavaScriptPage.module.scss';


class JavaScriptPage extends Component {
  componentDidMount() {
    const { compiledCode, tape, onTapeUpdate } = this.props;
    debouncedRunCode({
      code: compiledCode,
      onTapeUpdate: data => onTapeUpdate([...tape, data])
    });
  }

  shouldComponentUpdate(nextProps) {
    const { compiledCode: previousCompiledCode, onTapeUpdate, tape } = this.props;
    const { compiledCode } = nextProps;
    if (previousCompiledCode !== compiledCode) {
      onTapeUpdate([]);
      debouncedRunCode({
        code: compiledCode,
        onTapeUpdate: data => onTapeUpdate([...tape, data])
      });
    }
    return true;
  }

  render() {
    const {
      index,
      test,
      code,
      tape,
      tags,
      name,
      isLoading,
      onTagUpdate,
      onChangeName,
      onChangeCode,
      onCreateQuestion,
      onChangeCategory,
    } = this.props;
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
        key: 'tape', x: 1, y: 1, width: window.innerWidth / 2, height: (window.innerHeight - this.controlHeight) / 2, minWidth: 100, minHeight: 100, maxWidth: 700, maxHeight: 500
      },
      {
        key: 'tag', x: 1, y: 2, width: window.innerWidth / 2, height: (window.innerHeight - this.controlHeight) / 2, minWidth: 100, minHeight: 100, maxWidth: 700, maxHeight: 500
      },
    ];
    return (
      <div className={styles.app}>
        <Spin spinning={isLoading} size="large">
          <Grid layout={layout} totalWidth="100%" totalHeight="100%" autoResize>
            <GridItem key="code">
              <CodeWidget
                handleCodeChange={newCode => onChangeCode({ code: newCode })}
                data={code}
                mode="javascript"
                theme="monokai"
              />
            </GridItem>
            <GridItem key="test">
              <TestWidget
                handleCodeChange={newCode => onChangeCode({ test: newCode })}
                data={test}
                readOnly={false}
              />
            </GridItem>
            <GridItem key="control">
              <ControlWidget
                type="javascript"
                onChangeName={newName => onChangeName({ name: newName })}
                onSubmit={() => onCreateQuestion({
                  tags,
                  name,
                  code,
                  test,
                  type: 'javascript'
                })}
                onChangeCategory={onChangeCategory}
                index={index}
              />
            </GridItem>
            <GridItem key="tape">
              <TapeWidget data={tape} />
            </GridItem>
            <GridItem key="tag">
              <TagWidget data={tags} onTagUpdate={onTagUpdate} />
            </GridItem>
          </Grid>
        </Spin>
      </div>
    );
  }
}

export default JavaScriptPage;
