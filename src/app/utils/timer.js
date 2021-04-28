const nowMillisTimeout = [];
const timeout = [];
const nowMillisInterval = [];
const interval = [];

function getCurrentMillis() {
  const d = new Date();
  const now = `${d.getHours()}${d.getMinutes()}${d.getSeconds()}${d.getMilliseconds()}`;
  return now;
}

function setAccurateTimeout(callbackfunction, millis) {
  const id = Math.random().toString(36).substr(2, 9);
  nowMillisTimeout[id] = getCurrentMillis();
  timeout[id] = setInterval(() => { const now = getCurrentMillis(); if (now >= (+nowMillisTimeout[id] + +millis)) { callbackfunction.call(); clearInterval(timeout[id]); } }, 10);
}

function setAccurateInterval(callbackfunction, millis) {
  const id = Math.random().toString(36).substr(2, 9);
  nowMillisInterval[id] = getCurrentMillis();
  interval[id] = setInterval(() => { const now = getCurrentMillis(); if (now >= (+nowMillisInterval[id] + +millis)) { callbackfunction.call(); nowMillisInterval[id] = getCurrentMillis(); } }, 10);
}

export { setAccurateTimeout, setAccurateInterval };
