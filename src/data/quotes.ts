import quotes from './quotes.json';

type Quote = {
  text: string;
  author: string;
};

export function getRandomQuote(): Quote {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  return quotes[randomIndex];
}

export default quotes;
