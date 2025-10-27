function isPrime(num: number): boolean {
  if (num <= 1) return false;
  if (num <= 3) return true;
  if (num % 2 === 0 || num % 3 === 0) return false;
  for (let i = 5; i * i <= num; i += 6) {
    if (num % i === 0 || num % (i + 2) === 0) return false;
  }
  return true;
}

function evaluateExpression(expression: string): number {
  // Replace operation words with symbols
  let expr = expression
    .replace(/multiplied by/gi, '*')
    .replace(/divided by/gi, '/')
    .replace(/plus/gi, '+')
    .replace(/minus/gi, '-')
    .replace(/to the power of/gi, '**');

  // Extract numbers and operators
  const tokens = expr.match(/(\d+|\*\*|\*|\/|\+|\-)/g);
  if (!tokens) return NaN;

  const numbers: number[] = [];
  const operators: string[] = [];

  for (const token of tokens) {
    if (/\d+/.test(token)) {
      numbers.push(parseInt(token));
    } else {
      operators.push(token);
    }
  }

  // Handle power first
  for (let i = 0; i < operators.length; i++) {
    if (operators[i] === '**') {
      numbers[i] = Math.pow(numbers[i], numbers[i + 1]);
      numbers.splice(i + 1, 1);
      operators.splice(i, 1);
      i--;
    }
  }

  // Handle multiplication and division
  for (let i = 0; i < operators.length; i++) {
    if (operators[i] === '*') {
      numbers[i] = numbers[i] * numbers[i + 1];
      numbers.splice(i + 1, 1);
      operators.splice(i, 1);
      i--;
    } else if (operators[i] === '/') {
      numbers[i] = numbers[i] / numbers[i + 1];
      numbers.splice(i + 1, 1);
      operators.splice(i, 1);
      i--;
    }
  }

  // Handle addition and subtraction
  let result = numbers[0];
  for (let i = 0; i < operators.length; i++) {
    if (operators[i] === '+') {
      result += numbers[i + 1];
    } else if (operators[i] === '-') {
      result -= numbers[i + 1];
    }
  }

  return result;
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

  // Handle power queries FIRST (before mixed operations)
  const powerMatch = query.match(/what is (\d+) to the power of (\d+)/i);
  if (powerMatch) {
    const base = parseInt(powerMatch[1]);
    const exponent = parseInt(powerMatch[2]);
    const result = Math.pow(base, exponent);
    // Handle very large numbers
    if (result === Infinity) {
      return "Infinity";
    }
    // Return in scientific notation if too large
    if (result > Number.MAX_SAFE_INTEGER) {
      return result.toExponential();
    }
    return result.toString();
  }

  // Handle mixed operations (e.g., "78 multiplied by 26 plus 55")
  const mixedOpMatch = query.match(/what is ([\d\s]+(?:(?:multiplied by|divided by|plus|minus)\s+[\d\s]+)+)/i);
  if (mixedOpMatch) {
    const result = evaluateExpression(mixedOpMatch[1]);
    if (!isNaN(result)) {
      return result.toString();
    }
  }

  // Handle multiple additions (e.g., "64 plus 34 plus 12")
  const multiAdditionMatch = query.match(/what is ([\d\s]+(?:plus\s+[\d\s]+)+)/i);
  if (multiAdditionMatch) {
    const nums = multiAdditionMatch[1].split('plus').map(n => parseInt(n.trim()));
    const sum = nums.reduce((acc, val) => acc + val, 0);
    return sum.toString();
  }

  // Handle addition queries (two numbers)
  const additionMatch = query.match(/what is (\d+) plus (\d+)/i);
  if (additionMatch) {
    const num1 = parseInt(additionMatch[1]);
    const num2 = parseInt(additionMatch[2]);
    return (num1 + num2).toString();
  }

  // Handle multiple subtractions
  const multiSubtractionMatch = query.match(/what is ([\d\s]+(?:minus\s+[\d\s]+)+)/i);
  if (multiSubtractionMatch) {
    const parts = multiSubtractionMatch[1].split('minus').map(n => parseInt(n.trim()));
    const result = parts.reduce((acc, val, idx) => idx === 0 ? val : acc - val, 0);
    return result.toString();
  }

  // Handle subtraction queries (two numbers)
  const subtractionMatch = query.match(/what is (\d+) minus (\d+)/i);
  if (subtractionMatch) {
    const num1 = parseInt(subtractionMatch[1]);
    const num2 = parseInt(subtractionMatch[2]);
    return (num1 - num2).toString();
  }

  // Handle multiple multiplications
  const multiMultiplicationMatch = query.match(/what is ([\d\s]+(?:multiplied by\s+[\d\s]+)+)/i);
  if (multiMultiplicationMatch) {
    const parts = multiMultiplicationMatch[1].split('multiplied by').map(n => parseInt(n.trim()));
    const result = parts.reduce((acc, val) => acc * val, 1);
    return result.toString();
  }

  // Handle multiplication queries (two numbers)
  const multiplicationMatch = query.match(/what is (\d+) multiplied by (\d+)/i);
  if (multiplicationMatch) {
    const num1 = parseInt(multiplicationMatch[1]);
    const num2 = parseInt(multiplicationMatch[2]);
    return (num1 * num2).toString();
  }

  // Handle division queries
  const divisionMatch = query.match(/what is (\d+) divided by (\d+)/i);
  if (divisionMatch) {
    const num1 = parseInt(divisionMatch[1]);
    const num2 = parseInt(divisionMatch[2]);
    return (num1 / num2).toString();
  }

  // Handle "largest number" queries
  const largestMatch = query.match(/which of the following numbers is the largest: ([\d,\s]+)/i);
  if (largestMatch) {
    const numbers = largestMatch[1].split(',').map(n => parseInt(n.trim()));
    const largest = Math.max(...numbers);
    return largest.toString();
  }

  // Handle "square and cube" queries
  const squareCubeMatch = query.match(/which of the following numbers (?:is|are) both a square and a cube: ([\d,\s]+)/i);
  if (squareCubeMatch) {
    const numbers = squareCubeMatch[1].split(',').map(n => parseInt(n.trim()));
    const squareAndCubes = numbers.filter(num => {
      // A number is both a square and a cube if it's a perfect 6th power
      const sixthRoot = Math.pow(num, 1/6);
      return Math.abs(sixthRoot - Math.round(sixthRoot)) < 0.000001;
    });
    return squareAndCubes.join(', ');
  }

  // Handle "which numbers are primes" queries
  const primesMatch = query.match(/which of the following numbers are primes: ([\d,\s]+)/i);
  if (primesMatch) {
    const numbers = primesMatch[1].split(',').map(n => parseInt(n.trim()));
    const primes = numbers.filter(num => isPrime(num));
    return primes.join(', ');
  }

  // Handle "smallest number" queries
  const smallestMatch = query.match(/which of the following numbers is the smallest: ([\d,\s]+)/i);
  if (smallestMatch) {
    const numbers = smallestMatch[1].split(',').map(n => parseInt(n.trim()));
    const smallest = Math.min(...numbers);
    return smallest.toString();
  }

  // Handle "perfect squares" queries
  const perfectSquaresMatch = query.match(/which of the following numbers are perfect squares: ([\d,\s]+)/i);
  if (perfectSquaresMatch) {
    const numbers = perfectSquaresMatch[1].split(',').map(n => parseInt(n.trim()));
    const perfectSquares = numbers.filter(num => {
      const sqrt = Math.sqrt(num);
      return sqrt === Math.floor(sqrt);
    });
    return perfectSquares.join(', ');
  }

  // Handle "even numbers" queries
  const evenMatch = query.match(/which of the following numbers are even: ([\d,\s]+)/i);
  if (evenMatch) {
    const numbers = evenMatch[1].split(',').map(n => parseInt(n.trim()));
    const evens = numbers.filter(num => num % 2 === 0);
    return evens.join(', ');
  }

  // Handle "odd numbers" queries
  const oddMatch = query.match(/which of the following numbers are odd: ([\d,\s]+)/i);
  if (oddMatch) {
    const numbers = oddMatch[1].split(',').map(n => parseInt(n.trim()));
    const odds = numbers.filter(num => num % 2 !== 0);
    return odds.join(', ');
  }

  // Handle anagram queries
  const anagramMatch = query.match(/which of the following is an anagram of (\w+): (.+)\?/i);
  if (anagramMatch) {
    const target = anagramMatch[1].toLowerCase();
    const candidates = anagramMatch[2].split(',').map(w => w.trim().toLowerCase());
    const targetSorted = target.split('').sort().join('');

    const anagrams = candidates.filter(word => {
      const wordSorted = word.split('').sort().join('');
      return wordSorted === targetSorted;
    });

    return anagrams.join(', ');
  }

  // Handle Scrabble score queries
  const scrabbleMatch = query.match(/what is the scrabble score of (\w+)/i);
  if (scrabbleMatch) {
    const word = scrabbleMatch[1].toLowerCase();
    const scores: { [key: string]: number } = {
      'a': 1, 'e': 1, 'i': 1, 'o': 1, 'u': 1, 'l': 1, 'n': 1, 'r': 1, 's': 1, 't': 1,
      'd': 2, 'g': 2,
      'b': 3, 'c': 3, 'm': 3, 'p': 3,
      'f': 4, 'h': 4, 'v': 4, 'w': 4, 'y': 4,
      'k': 5,
      'j': 8, 'x': 8,
      'q': 10, 'z': 10
    };

    let total = 0;
    for (const letter of word) {
      total += scores[letter] || 0;
    }

    return total.toString();
  }

  return "";
}
