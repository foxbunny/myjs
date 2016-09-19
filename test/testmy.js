(function (my, test) {
  'use strict';

  var assert = test.assert;

  test('select element by id', function () {
    var node = my().id('h1');
    assert.element(node);
  });

  test('select elements by class', function () {
    var nodes = my().cls('li');
    assert.elements(nodes);
  });

  test('selecting .li returns 12 elements', function () {
    var nodes = my().cls('li');
    assert.count(nodes, 12);
  });

  test('select elements by query', function () {
    var node = my().get('#ul1 #liA6');
    assert.element(node);
  });

  test('select multiple elements by query', function () {
    var nodes = my().find('#ul1 .li');
    assert.elements(nodes);
  });

  test('selecting all .li inside #ul1 returns 6 elements', function () {
    var nodes = my().find('#ul1 .li');
    assert.count(nodes, 6);
  });

  test('attach event listener', function(done) {
    var anchor = my().id('anc');
    var listener = function(e) {
      e.preventDefault();
      done(test.noop);
      this.removeEventListener('click', listener);
    };
    my(anchor).on('click', listener);
    test.note('click the \'anchor\' link');
  });

  test('attaching event listener returns origina object', function() {
    var anchor = my().id('anc');
    var m = my(anchor);
    var ret = m.on('click', test.noop);
    assert.equal(ret, m);
  });

  test('firing native event', function(done) {
    var anchor = my().id('anc');
    var listener = function(e) {
      e.preventDefault();
      done(test.noop);
      this.removeEventListener('focus', listener);
    };
    my(anchor).on('focus', listener).fire('focus');
  });

  test('unbind event', function(done) {
    var el = my().id('liA1');
    var m = my(el);
    var called = false;
    var listener = function(e) {
      e.preventDefault();
      called = true;
      this.removeEventListener('mousein', listener, true);
    };

    m.on('mousein', listener, true).
      off('mousein', listener, true).
      fire('mousein');

    test.later(function() {
      done(function() {
        assert.false(called);
      });
    });
  });

  test('unbind all events of same type', function(done) {
    var el = my().id('liA1');
    var m = my(el);
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

    m.on('mousein', listener1).
      on('mousein', listener2).
      on('mouseout', listener3).
      off('mousein').
      fire('mousein').
      fire('mouseout');

    test.later(function() {
      done(function() {
        assert.false(called1);
        assert.false(called2);
        assert.true(called3);
      });
    });
  });

  test('unbind only handlers using some func', function(done) {
    var el = my().id('liA1');
    var m = my(el);
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

    m.on('mousein', listener1, false).
      on('mousein', listener2, true).
      on('mouseout', listener3, false).
      off(listener2).
      fire('mousein').
      fire('mouseout');

    test.later(function() {
      done(function() {
        assert.true(called1);
        assert.false(called2);
        assert.true(called3);
      });
    });
  });

  test('unbind only handlers that used capture', function(done) {
    var el = my().id('liA1');
    var m = my(el);
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

    m.on('mousein', listener1, false).
      on('mousein', listener2, true).
      on('mouseout', listener3, false).
      off(true).
      fire('mousein').
      fire('mouseout');

    test.later(function() {
      done(function() {
        assert.true(called1);
        assert.false(called2);
        assert.true(called3);
      });
    });
  });

  test('unbind handlers of type that did not use capture', function(done) {
    var el = my().id('liA1');
    var m = my(el);
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

    m.on('mousein', listener1, false).
      on('mousein', listener2, true).
      on('mouseout', listener3, false).
      off('mousein', false).
      fire('mousein').
      fire('mouseout');

    test.later(function() {
      done(function() {
        assert.false(called1);
        assert.true(called2);
        assert.true(called3);
      });
    });
  });

  test('get class names', function() {
    var test2 = my().id('test2');
    assert.array(my(test2).class(), ['test', 'anchor']);
  });

  test('set class name', function() {
    var test2 = my().id('test2');
    var m = my(test2);
    m.class('foo')
    assert.array(m.class(), ['test', 'anchor', 'foo']);
  });

  test('returns empty array if there are no classes', function () {
    var h1 = my().id('h1');
    var m = my(h1);
    assert.array(m.class(), []);
  });

  test('does not add existing classes', function() {
    var m = my(my().id('test2'));
    m.class('test');
    assert.array(m.class(), ['test', 'anchor', 'foo']);
  });

  test('set multiple classes', function() {
    var m = my(my().id('test2'));
    m.class('bar', 'baz');
    assert.array(m.class(), ['test', 'anchor', 'foo', 'bar', 'baz']);
  });

  test('remove class', function() {
    var m = my(my().id('test2'));
    m.removeClass('baz');
    assert.array(m.class(), ['test', 'anchor', 'foo', 'bar']);
  });

  test('remove multiple classes', function() {
    var m = my(my().id('test2'));
    m.removeClass('bar', 'foo');
    assert.array(m.class(), ['test', 'anchor']);
  });

  test('remove all classes', function() {
    var m = my(my().id('test2'));
    m.removeClass();
    assert.count(m.class(), 0);
    m.class('test', 'anchor'); // restore original classes
  });

  test('append element', function() {
    var ul = my(my().id('ul1'));
    var originalCount = ul.find('li').length;
    var newLi = document.createElement('li');
    newLi.innerHTML = 'added new element';
    ul.append(newLi);
    assert.count(ul.find('li'), originalCount + 1);
  });

  test('append multiple elements', function() {
    var ul = my(my().id('ul1'));
    var originalCount = ul.find('li').length;
    var nodes = [1, 2, 3].map(function(num) {
      var newLi = document.createElement('li');
      newLi.innerHTML = 'added new element ' + num;
      return newLi;
    });
    ul.append(nodes);
    assert.count(ul.find('li'), originalCount + 3);
  });

  test('prepend element', function() {
    var ul = my(my().id('ul2'));
    var originalCount = ul.find('li').length;
    var newLi = document.createElement('li');
    newLi.innerHTML = 'added new element';
    ul.prepend(newLi);
    assert.count(ul.find('li'), originalCount + 1);
  });

  test('prepend multiple elements', function() {
    var ul = my(my().id('ul2'));
    var originalCount = ul.find('li').length;
    var nodes = [1, 2, 3].map(function(num) {
      var newLi = document.createElement('li');
      newLi.innerHTML = 'added new element ' + num;
      return newLi;
    });
    ul.prepend(nodes);
    assert.count(ul.find('li'), originalCount + 3);
  });

}(this.my, this.test));
