(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(factory);
  } else {
    global.test = factory();
  }
}(this, function () {

  var test = function (desc, fn) {
    if (fn.length === 1) {
      fn(test.wrap(desc));
    } else {
      test.wrap(desc, fn);
    }
  };

  test.printSuccess = true;
  test.timeout = 10000; // 10s

  test.later = function(fn) {
    setTimeout(fn, 10);
  };

  test.wrap = function (desc, fn) {
    var start;
    var end;
    var timer;
    if (typeof fn !== 'undefined') {
      timer = setTimeout(function() {
        test.fail(desc, 'timed out');
      }, test.timeout);
      try {
        start = Date.now();
        fn();
        if (timer) { clearTimeout(timer); }
        end = Date.now();
        test.pass(desc, end - start);
      } catch(err) {
        if (timer) { clearTimeout(timer); }
        test.fail(desc, err);
      }
    } else {
      timer = setTimeout(function() {
        test.fail(desc, 'timed out');
      }, test.timeout);
      return function (fn) {
        if (timer) { clearTimeout(timer); }
        test.wrap(desc, fn);
      };
    }
  };

  test.fail = function (msg, exception) {
    console.error('FAILED: ' + msg);
    (console.debug || console.log).call(console, '' + exception);
  };

  test.pass = function (msg, timing) {
    if (!test.printSuccess) { return; }
    console.info('PASS: ' + msg + ' (' + timing + 'ms)');
  };

  test.note = function (msg) {
    console.warn('NOTE: ' + msg);
  };

  test.log = function() {
    console.log.apply(console, ['LOG:  '].concat(arguments));
  };

  test.noop = function() {};

  var assert = test.assert = function (bool, message) {
    if (!bool) { throw message; }
  };

  assert.true = function (expr, message) {
    assert(!!expr === true, message || '' + expr + ' should be true');
  };

  assert.false = function (expr, message) {
    assert(!expr, message || '' + expr + ' should be false');
  };

  assert.ctor = function(obj, ctor, message) {
    assert(
      obj instanceof ctor,
      message || '' + obj + ' should be instance of ' + ctor
    );
  };

  assert.equal = function(obj1, obj2, message) {
    assert(
      obj1 === obj2,
      message || '' + obj1 + ' should equal ' + obj2
    );
  };

  assert.array = function(arr1, arr2, message) {
    var lengthMatch = arr1.length === arr2.length;
    var elemMatch = arr1.every(function(i, idx) { return arr2[idx] === i; });
    assert(
      lengthMatch && elemMatch,
      message || '' + arr1 + ' should be the same as ' + arr2
    );
  };

  assert.defined = function (expr, message) {
    assert(
      typeof expr !== 'unefined', message,
      message || '' + expr + ' should be defined'
    );
  };

  assert.undef = function (expr, message) {
    assert(
      typeof expr === 'undefined', 
      message || '' + expr + ' should be defined'
    );
  };

  assert.element = function (obj, message) {
    assert(
      obj instanceof window.Element,
      message || '' + obj + ' should be an element'
    );
  };

  assert.elements = function (arr, message) {
    assert(
      arr instanceof window.NodeList,
      message || '' + arr + ' should be a NodeList'
    );
  };

  assert.elemType = function (obj, type, message) {
    assert(
      obj instanceof window['HTML' + type + 'Element'],
      message || '' + obj + ' should be a HTML' + type + 'Element type'
    );
  };

  assert.count = function (arr, count, message) {
    assert(
      arr.length === count,
      message || '' + arr + ' should be ' + count + ' long but was ' + arr.length
    );
  };

  return test;

}));
