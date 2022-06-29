import NumPair from './NumPair';

class Library {
  someParam: string;
  num: NumPair;

  constructor(someParam = 'Parameter') {
    this.someParam = someParam;
    this.num = new NumPair();
  }
}

export default Library;
