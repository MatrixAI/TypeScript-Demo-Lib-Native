import Library from './Library';

class NumPair {
  num1: number;
  num2: number;
  lib: Library;

  constructor(firstNum = 0, secondNum = 0) {
    this.num1 = firstNum;
    this.num2 = secondNum;
    this.lib = new Library();
  }
}

export default NumPair;
