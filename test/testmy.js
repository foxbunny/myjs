(function (my, test) {
  'use strict';

  var assert = test.assert;

  test('select element by id', function () {
    var node = my.id('h1');
    assert.element(node);
  });

  test('select elements by class', function () {
    var nodes = my.cls('li');
    assert.elements(nodes);
  });

  test('selecting .li returns 12 elements', function () {
    var nodes = my.cls('li');
    assert.count(nodes, 12);
  });

  test('select elemetns by query', function () {
    var node = my.get('#ul1 #liA6');
    assert.element(node);
  });

  test('select multiple elements by query', function () {
    var nodes = my.find('#ul1 .li');
    assert.elements(nodes);
  });

  test('selecting all .li inside #ul1 returns 6 elements', function () {
    var nodes = my.find('#ul1 .li');
    assert.count(nodes, 6);
  });

  test('attach event listener', function(done) {
    var anchor = my.id('anc');
    var listener = function(e) {
      e.preventDefault();
      done(test.noop);
      this.removeEventListener('click', listener);
    };
    my.on(anchor, 'click', listener);
    test.note('click the \'anchor\' link');
  });

  test('attaching event listener returns origina object', function() {
    var anchor = my.id('anc');
    var ret = my.on(anchor, 'click', test.noop);
    assert.element(ret);
    assert.equal(ret, anchor);
  });

  test('firing native event', function(done) {
    var anchor = my.id('anc');
    var listener = function(e) {
      e.preventDefault();
      done(test.noop);
      this.removeEventListener('focus', listener);
    };
    my.on(anchor, 'focus', listener);
    my.fire(anchor, 'focus');
  });

  test('firing native event returns event object', function() {
    var anchor = my.id('anc');
    var ret = my.fire(anchor, 'focus');
    assert.ctor(ret, window.FocusEvent);
  });

  test('unbind event', function(done) {
    var el = my.id('liA1');
    var called = false;
    var listener = function(e) {
      e.preventDefault();
      called = true;
      this.removeEventListener('mousein', listener, true);
    };
    my.on(el, 'mousein', listener, true);
    my.off(el, 'mousein', listener, true);
    my.fire(el, 'mousein');
    test.later(function() {
      done(function() {
        assert.false(called);
      });
    });
  });

  test('unbind all events of same type', function(done) {
    var el = my.id('liA1');
    var called1 = false;
    var called2 = false;
    var called3 = false;
    var listener1 = function(e) {
      e.preventDefault();
      called1 = true;
      this.removeEventListener('mousein', listener1);
    };
    var listener2 = function(e) {
      e.preventDefault();
      called2 = true;
      this.removeEventListener('mousein', listener2);
    };
    var listener3 = function(e) {
      e.preventDefault();
      called3 = true;
      this.removeEventListener('mouseout', listener3);
    };
    my.on(el, 'mousein', listener1);
    my.on(el, 'mousein', listener2);
    my.on(el, 'mouseout', listener3);
    my.off(el, 'mousein');
    my.fire(el, 'mousein');
    my.fire(el, 'mouseout');
    test.later(function() {
      done(function() {
        assert.false(called1);
        assert.false(called2);
        assert.true(called3);
      });
    });
  });

  test('unbind only handlers using some func', function(done) {
    var el = my.id('liA1');
    var called1 = false;
    var called2 = false;
    var called3 = false;
    var listener1 = function(e) {
      e.preventDefault();
      called1 = true;
      this.removeEventListener('mousein', listener1);
    };
    var listener2 = function(e) {
      e.preventDefault();
      called2 = true;
      this.removeEventListener('mousein', listener2);
    };
    var listener3 = function(e) {
      e.preventDefault();
      called3 = true;
      this.removeEventListener('mouseout', listener3);
    };
    my.on(el, 'mousein', listener1, false);
    my.on(el, 'mousein', listener2, true);
    my.on(el, 'mouseout', listener3, false);
    my.off(el, listener2);
    my.fire(el, 'mousein');
    my.fire(el, 'mouseout');
    test.later(function() {
      done(function() {
        assert.true(called1);
        assert.false(called2);
        assert.true(called3);
      });
    });
  });

  test('unbind only handlers that used capture', function(done) {
    var el = my.id('liA1');
    var called1 = false;
    var called2 = false;
    var called3 = false;
    var listener1 = function(e) {
      e.preventDefault();
      called1 = true;
      this.removeEventListener('mousein', listener1);
    };
    var listener2 = function(e) {
      e.preventDefault();
      called2 = true;
      this.removeEventListener('mousein', listener2);
    };
    var listener3 = function(e) {
      e.preventDefault();
      called3 = true;
      this.removeEventListener('mouseout', listener3);
    };
    my.on(el, 'mousein', listener1, false);
    my.on(el, 'mousein', listener2, true);
    my.on(el, 'mouseout', listener3, false);
    my.off(el, true);
    my.fire(el, 'mousein');
    my.fire(el, 'mouseout');
    test.later(function() {
      done(function() {
        assert.true(called1);
        assert.false(called2);
        assert.true(called3);
      });
    });
  });

  test('unbind handlers of type that did not use capture', function(done) {
    var el = my.id('liA1');
    var called1 = false;
    var called2 = false;
    var called3 = false;
    var listener1 = function(e) {
      e.preventDefault();
      called1 = true;
      this.removeEventListener('mousein', listener1);
    };
    var listener2 = function(e) {
      e.preventDefault();
      called2 = true;
      this.removeEventListener('mousein', listener2);
    };
    var listener3 = function(e) {
      e.preventDefault();
      called3 = true;
      this.removeEventListener('mouseout', listener3);
    };
    my.on(el, 'mousein', listener1, false);
    my.on(el, 'mousein', listener2, true);
    my.on(el, 'mouseout', listener3, false);
    my.off(el, 'mousein', false);
    my.fire(el, 'mousein');
    my.fire(el, 'mouseout');
    test.later(function() {
      done(function() {
        assert.false(called1);
        assert.true(called2);
        assert.true(called3);
      });
    });
  });

  test('get class names', function() {
    var el = my.id('test2');
    var classes = my.class(el);
    assert.array(classes, ['test', 'anchor']);
  });

  test('set class name', function() {
    var el = my.id('test2');
    my.class(el, 'foo');
    var classes = my.class(el);
    assert.array(classes, ['test', 'anchor', 'foo']);
  });

  test('does not add existing classes', function() {
    var el = my.id('test2');
    my.class(el, 'test');
    var classes = my.class(el);
    assert.array(classes, ['test', 'anchor', 'foo']);
  });

  test('set multiple classes', function() {
    var el = my.id('test2');
    my.class(el, 'bar', 'baz');
    var classes = my.class(el);
    assert.array(classes, ['test', 'anchor', 'foo', 'bar', 'baz']);
  });

  test('remove class', function() {
    var el = my.id('test2');
    my.removeClass(el, 'baz');
    var classes = my.class(el);
    assert.array(classes, ['test', 'anchor', 'foo', 'bar']);
  });

  test('remove multiple classes', function() {
    var el = my.id('test2');
    my.removeClass(el, 'bar', 'foo');
    var classes = my.class(el);
    assert.array(classes, ['test', 'anchor']);
  });

  test('remove all classes', function() {
    var el = my.id('test2');
    my.removeClass(el);
    var classes = my.class(el);
    assert.count(classes, 0);
    my.class(el, 'test', 'anchor'); // restore original classes
  });

}(this.my, this.test));
