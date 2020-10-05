const Num = {
  thousandsSeparators: num => {
    let numParts = num.toString().split('.');
    numParts[0] = numParts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return numParts.join('.');
  },
  formatCurrency: num => {
    return "$" + Num.thousandsSeparators(num);
  },
  isPrime: num => {
    //check if value is a natural numbers (integer)
    //without this check, it returns true
    if (isNaN(num) || num % 1 !== 0) {
      return false;
    }
    num = Math.abs(num); //*negative values can be primes
    if (num === 0 || num === 1) {
      return false;
    }
    const maxFactorNum = Math.sqrt(num);
    for (let i = 2; i <= maxFactorNum; i++) {
      if (num % i === 0) {
        return false;
      }
    }
    return  true;
  },
};