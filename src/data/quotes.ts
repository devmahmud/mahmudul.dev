import quotes from './quotes.json';

type Quote = {
  text: string;
  author: string;
};

export function getRandomQuote(): Quote {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  const randomIndex = array[0] % quotes.length;
  return quotes[randomIndex];
}

export default quotes;
