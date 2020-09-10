import { Library } from "@typescript-demo-lib";

describe('index', () => {

  test('some arbitrary test', () => {
    const librar = new Library('some param');
    expect(library?.someParam).toEqual('some param');
  });

});
