'use strict';

require('../common');
const assert = require('assert');

assert.strictEqual(0, Buffer.from('hello', 'utf8').slice(0, 0).length);
assert.strictEqual(0, Buffer('hello', 'utf8').slice(0, 0).length);

const buf = Buffer.from('0123456789', 'utf8');
assert.strictEqual(0, Buffer.compare(buf.slice(-10, 10),
  Buffer.from('0123456789', 'utf8')));
assert.strictEqual(0, Buffer.compare(buf.slice(-20, 10),
  Buffer.from('0123456789', 'utf8')));
assert.strictEqual(0, Buffer.compare(buf.slice(-20, -10),
  Buffer.from('', 'utf8')));
assert.strictEqual(0, Buffer.compare(buf.slice(),
  Buffer.from('0123456789', 'utf8')));
assert.strictEqual(0, Buffer.compare(buf.slice(0),
  Buffer.from('0123456789', 'utf8')));
assert.strictEqual(0, Buffer.compare(buf.slice(0, 0),
  Buffer.from('', 'utf8')));
assert.strictEqual(0, Buffer.compare(buf.slice(undefined),
  Buffer.from('0123456789', 'utf8')));
assert.strictEqual(0, Buffer.compare(buf.slice('foobar'),
  Buffer.from('0123456789', 'utf8')));
assert.strictEqual(0, Buffer.compare(buf.slice(undefined, undefined),
  Buffer.from('0123456789', 'utf8')));

assert.strictEqual(0, Buffer.compare(buf.slice(2),
  Buffer.from('23456789', 'utf8')));
assert.strictEqual(0, Buffer.compare(buf.slice(5),
  Buffer.from('56789', 'utf8')));
assert.strictEqual(0, Buffer.compare(buf.slice(10),
  Buffer.from('', 'utf8')));
assert.strictEqual(0, Buffer.compare(buf.slice(5, 8),
  Buffer.from('567', 'utf8')));
assert.strictEqual(0, Buffer.compare(buf.slice(8, -1),
  Buffer.from('8', 'utf8')));
assert.strictEqual(0, Buffer.compare(buf.slice(-10),
  Buffer.from('0123456789', 'utf8')));
assert.strictEqual(0, Buffer.compare(buf.slice(0, -9),
  Buffer.from('0', 'utf8')));
assert.strictEqual(0, Buffer.compare(buf.slice(0, -10),
  Buffer.from('', 'utf8')));
assert.strictEqual(0, Buffer.compare(buf.slice(0, -1),
  Buffer.from('012345678', 'utf8')));
assert.strictEqual(0, Buffer.compare(buf.slice(2, -2),
  Buffer.from('234567', 'utf8')));
assert.strictEqual(0, Buffer.compare(buf.slice(0, 65536),
  Buffer.from('0123456789', 'utf8')));
assert.strictEqual(0, Buffer.compare(buf.slice(65536, 0),
  Buffer.from('', 'utf8')));
assert.strictEqual(0, Buffer.compare(buf.slice(-5, -8),
  Buffer.from('', 'utf8')));
assert.strictEqual(0, Buffer.compare(buf.slice(-5, -3),
  Buffer.from('56', 'utf8')));
assert.strictEqual(0, Buffer.compare(buf.slice(-10, 10),
  Buffer.from('0123456789', 'utf8')));
for (let i = 0, s = buf; i < buf.length; ++i) {
  assert.strictEqual(0, Buffer.compare(buf.slice(i), s.slice(i)));
  assert.strictEqual(0, Buffer.compare(buf.slice(0, i), s.slice(0, i)));
  assert.strictEqual(0, Buffer.compare(buf.slice(-i), s.slice(-i)));
  assert.strictEqual(0, Buffer.compare(buf.slice(0, -i), s.slice(0, -i)));
}

const utf16Buf = Buffer.from('0123456789', 'utf16le');
assert.deepStrictEqual(utf16Buf.slice(0, 6), Buffer.from('012', 'utf16le'));

assert.strictEqual(0, Buffer.compare(buf.slice('0', '1'),
  Buffer.from('0', 'utf8')));
assert.strictEqual(0, Buffer.compare(buf.slice('-5', '10'),
  Buffer.from('56789', 'utf8')));
assert.strictEqual(0, Buffer.compare(buf.slice('-10', '10'),
  Buffer.from('0123456789', 'utf8')));
assert.strictEqual(0, Buffer.compare(buf.slice('-10', '-5'),
  Buffer.from('01234', 'utf8')));
assert.strictEqual(0, Buffer.compare(buf.slice('-10', '-0'),
  Buffer.from('', 'utf8')));
assert.strictEqual(0, Buffer.compare(buf.slice('111'),
  Buffer.from('', 'utf8')));
assert.strictEqual(0, Buffer.compare(buf.slice('0', '-111'),
  Buffer.from('', 'utf8')));

// try to slice a zero length Buffer
// see https://github.com/joyent/node/issues/5881
assert.doesNotThrow(() => Buffer.alloc(0).slice(0, 1));
assert.strictEqual(Buffer.alloc(0).slice(0, 1).length, 0);

{
  // Single argument slice
  assert.strictEqual('bcde',
                     Buffer.from('abcde', 'utf8').slice(1).toString('utf8'));
}

// slice(0,0).length === 0
assert.strictEqual(0, Buffer.from('hello', 'utf8').slice(0, 0).length);

{
  // Regression tests for https://github.com/nodejs/node/issues/9096
  const buf = Buffer.from('abcd', 'utf8');
  assert.strictEqual(buf.slice(buf.length / 3).toString('utf8'), 'bcd');
  assert.strictEqual(
    buf.slice(buf.length / 3, buf.length).toString(),
    'bcd'
  );
}

{
  const buf = Buffer.from('abcdefg', 'utf8');
  assert.strictEqual(buf.slice(-(-1 >>> 0) - 1).toString('utf8'),
                     buf.toString('utf8'));
}

{
  const buf = Buffer.from('abc', 'utf8');
  assert.strictEqual(buf.slice(-0.5).toString('utf8'), buf.toString('utf8'));
}

{
  const buf = Buffer.from([
    1, 29, 0, 0, 1, 143, 216, 162, 92, 254, 248, 63, 0,
    0, 0, 18, 184, 6, 0, 175, 29, 0, 8, 11, 1, 0, 0
  ]);
  const chunk1 = Buffer.from([
    1, 29, 0, 0, 1, 143, 216, 162, 92, 254, 248, 63, 0
  ]);
  const chunk2 = Buffer.from([
    0, 0, 18, 184, 6, 0, 175, 29, 0, 8, 11, 1, 0, 0
  ]);
  const middle = buf.length / 2;

  assert.deepStrictEqual(buf.slice(0, middle), chunk1);
  assert.deepStrictEqual(buf.slice(middle), chunk2);
}
