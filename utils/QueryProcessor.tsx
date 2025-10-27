function isPrime(num: number): boolean {
  if (num <= 1) return false;
  if (num <= 3) return true;
  if (num % 2 === 0 || num % 3 === 0) return false;
  for (let i = 5; i * i <= num; i += 6) {
    if (num % i === 0 || num % (i + 2) === 0) return false;
  }
  return true;
}

export default function QueryProcessor(query: string): string {
  if (query.toLowerCase().includes("shakespeare")) {
    return (
      "William Shakespeare (26 April 1564 - 23 April 1616) was an " +
      "English poet, playwright, and actor, widely regarded as the greatest " +
      "writer in the English language and the world's pre-eminent dramatist."
    );
  }

  if (query.toLowerCase().includes("name")) {
    return "Yousef!";
  }

  if (query.toLowerCase().includes("age")) {
    return "20";
  }

  if (query.toLowerCase().includes("andrew id")) {
      return "yza"; // Replace with your actual Andrew ID
  }

  // Handle addition queries
  const additionMatch = query.match(/what is (\d+) plus (\d+)/i);
  if (additionMatch) {
    const num1 = parseInt(additionMatch[1]);
    const num2 = parseInt(additionMatch[2]);
    return (num1 + num2).toString();
  }

  // Handle multiplication queries
  const multiplicationMatch = query.match(/what is (\d+) multiplied by (\d+)/i);
  if (multiplicationMatch) {
    const num1 = parseInt(multiplicationMatch[1]);
    const num2 = parseInt(multiplicationMatch[2]);
    return (num1 * num2).toString();
  }

  // Handle "largest number" queries
  const largestMatch = query.match(/which of the following numbers is the largest: ([\d,\s]+)/i);
  if (largestMatch) {
    const numbers = largestMatch[1].split(',').map(n => parseInt(n.trim()));
    const largest = Math.max(...numbers);
    return largest.toString();
  }

  // Handle "square and cube" queries
  const squareCubeMatch = query.match(/which of the following numbers is both a square and a cube: ([\d,\s]+)/i);
  if (squareCubeMatch) {
    const numbers = squareCubeMatch[1].split(',').map(n => parseInt(n.trim()));
    for (const num of numbers) {
      const sixthRoot = Math.pow(num, 1/6);
      if (Math.abs(sixthRoot - Math.round(sixthRoot)) < 0.0001) {
        return num.toString();
      }
    }
    return "";
  }

  // Handle "which numbers are primes" queries
  const primesMatch = query.match(/which of the following numbers are primes: ([\d,\s]+)/i);
  if (primesMatch) {
    const numbers = primesMatch[1].split(',').map(n => parseInt(n.trim()));
    const primes = numbers.filter(num => isPrime(num));
    return primes.join(', ');
  }

  return "";
}
