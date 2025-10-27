export default function QueryProcessor(query: string): string {
  if (query.toLowerCase().includes("shakespeare")) {
    return (
      "William Shakespeare (26 April 1564 - 23 April 1616) was an " +
      "English poet, playwright, and actor, widely regarded as the greatest " +
      "writer in the English language and the world's pre-eminent dramatist."
    );
  }

  if (query.toLowerCase().includes("name")) {
    return "Yousef";
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

  // Handle "largest number" queries
  const largestMatch = query.match(/which of the following numbers is the largest: ([\d,\s]+)/i);
  if (largestMatch) {
    const numbers = largestMatch[1].split(',').map(n => parseInt(n.trim()));
    const largest = Math.max(...numbers);
    return largest.toString();
  }

  return "";
}
