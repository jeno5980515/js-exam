import React from 'react';
import ReactDOM from 'react-dom';
import { renderToString } from 'react-dom/server';
import sinon from 'sinon';
import vm from 'vm';
import spy from './spy';
import getPatchedTape from './tape';

const wrapCode = (code = '') => {
  return code.replace(/for *\(.*\{|while *\(.*\{|do *\{/g, (loopHead, i) => {
    return `let infcount${i} = 0;
      const detector${i} = (c) => {
        if (c > 100000) {
          throw new Error('infinite');
        }
      }
      ${loopHead}
      detector${i}(infcount${i}++);
    `;
  });
};

const runCode = ({ code, wrappedConsole, onTapeUpdate }) => {
  let script = null;
  let context = null;
  const clock = sinon.useFakeTimers();
  let test = null;
  if (onTapeUpdate) {
    test = getPatchedTape(onTapeUpdate);
  }
  // should hijack setTimeout before pass to sandbox
  const sandbox = {
    setTimeout: window.setTimeout, // need to be passed also...
    console: wrappedConsole,
    sinon,
    describe: test,
    test,
    clock,
    spy,
    React,
    ReactDOM,
    root: document.getElementById('result'),
    answer: document.getElementById('answer'),
    renderToString
  };
  try {
    script = new vm.Script(wrapCode(code));
    // eslint-disable-next-line
    context = new vm.createContext(sandbox);
    script.runInContext(context);
  } catch (e) {
    script = new vm.Script(wrapCode(''));
    // eslint-disable-next-line
    context = new vm.createContext(sandbox);
    script.runInContext(context);
    wrappedConsole.log(e);
  }
  clock.restore();
};

// const debouncedRunCode = _.debounce(runCode, 200);

export default runCode;
