import native from '@/native';

describe('native bindings', () => {
  test('addition', () => {
    expect(native.addOne(1)).toBe(2);
  });
  test('multiplication', () => {
    expect(native.timesTwo(4)).toBe(8);
  });
  test('array creation', () => {
    const arr = native.createArr();
    expect(arr[0]).toStrictEqual(0.5);
    expect(native.createArr()).toEqual([0.5]);
    // For some reason, this does not succeed
    // https://github.com/facebook/jest/issues/12814
    // expect(native.createArr()).toStrictEqual([0.5]);
  });
  test('object creation', () => {
    const obj = native.createObj();
    expect(obj['key']).toStrictEqual('hello world');
    expect(native.createObj()).toEqual({ key: 'hello world' });
    // For some reason, this does not succeed
    // https://github.com/facebook/jest/issues/12814
    // expect(native.createObj()).toStrictEqual({ key: 'hello world' });
  });
  test('set property', () => {
    expect(native.setProperty({ key1: 'value1' })).toStrictEqual({
      key1: 'value1',
      key2: 'initial value1',
    });
  });
});
