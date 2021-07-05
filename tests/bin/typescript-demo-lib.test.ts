import { mockProcessStdout } from 'jest-mock-process';
import main from '@/bin/typescript-demo-lib';

const uuidRegex = new RegExp(
  '^[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}',
);

describe('main', () => {
  test('main takes synthetic parameters', () => {
    // jest can also "spy on" the console object
    // and then you can test on stdout
    expect(main(['1'])).toEqual(0);
  });
  test('no input', () => {
    const mockLog = mockProcessStdout();
    main(['thing', 'thing']);
    expect(mockLog).toHaveBeenCalledTimes(4);
    expect(mockLog.mock.calls[0][0]).toBe('[]\n');
    expect(mockLog.mock.calls[1][0]).toBe('new library\n');
    expect(mockLog.mock.calls[2][0]).toMatch(uuidRegex);
    expect(mockLog.mock.calls[3][0]).toBe('NaN + NaN = NaN\n');
    mockLog.mockRestore();
  });
  test('adds 0 + 0', () => {
    const mockLog = mockProcessStdout();
    main(['thing', 'thing', '0', '0']);
    expect(mockLog).toHaveBeenCalledTimes(4);
    expect(mockLog.mock.calls[0][0]).toBe('[0,0]\n');
    expect(mockLog.mock.calls[1][0]).toBe('new library\n');
    expect(mockLog.mock.calls[2][0]).toMatch(uuidRegex);
    expect(mockLog.mock.calls[3][0]).toBe('0 + 0 = 0\n');
    mockLog.mockRestore();
  });
  test('adds 0 + 1', () => {
    const mockLog = mockProcessStdout();
    main(['thing', 'thing', '0', '1']);
    expect(mockLog).toHaveBeenCalledTimes(4);
    expect(mockLog.mock.calls[0][0]).toBe('[0,1]\n');
    expect(mockLog.mock.calls[1][0]).toBe('new library\n');
    expect(mockLog.mock.calls[2][0]).toMatch(uuidRegex);
    expect(mockLog.mock.calls[3][0]).toBe('0 + 1 = 1\n');
    mockLog.mockRestore();
  });
  test('adds 1 + 0', () => {
    const mockLog = mockProcessStdout();
    main(['thing', 'thing', '1', '0']);
    expect(mockLog).toHaveBeenCalledTimes(4);
    expect(mockLog.mock.calls[0][0]).toBe('[1,0]\n');
    expect(mockLog.mock.calls[1][0]).toBe('new library\n');
    expect(mockLog.mock.calls[2][0]).toMatch(uuidRegex);
    expect(mockLog.mock.calls[3][0]).toBe('1 + 0 = 1\n');
    mockLog.mockRestore();
  });
  test('adds 7657 + 238947', () => {
    const mockLog = mockProcessStdout();
    main(['thing', 'thing', '7657', '238947']);
    expect(mockLog).toHaveBeenCalledTimes(4);
    expect(mockLog.mock.calls[0][0]).toBe('[7657,238947]\n');
    expect(mockLog.mock.calls[1][0]).toBe('new library\n');
    expect(mockLog.mock.calls[2][0]).toMatch(uuidRegex);
    expect(mockLog.mock.calls[3][0]).toBe('7657 + 238947 = 246604\n');
    mockLog.mockRestore();
  });
});
