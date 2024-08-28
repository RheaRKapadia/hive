import React, { useState, useEffect } from 'react';

const DailyQuote = () => {
  const [quote, setQuote] = useState({ content: '', author: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuote = async () => {
      setIsLoading(true);
      try {
        const today = new Date().toDateString();
        const cachedQuote = localStorage.getItem('dailyQuote');
        const cachedDate = localStorage.getItem('dailyQuoteDate');

        if (cachedQuote && cachedDate === today) {
          setQuote(JSON.parse(cachedQuote));
        } else {
          const response = await fetch('https://api.quotable.io/random?tags=inspirational');
          if (!response.ok) {
            throw new Error('Failed to fetch quote');
          }
          const data = await response.json();
          const newQuote = { content: data.content, author: data.author };
          setQuote(newQuote);
          localStorage.setItem('dailyQuote', JSON.stringify(newQuote));
          localStorage.setItem('dailyQuoteDate', today);
        }
        setError(null);
      } catch (err) {
        setError('Failed to fetch quote. Please try again later.');
        console.error('Error fetching quote:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuote();
  }, []);

  if (isLoading) {
    return <div className="quote">Loading...</div>;
  }

  if (error) {
    return <div className="quote error">{error}</div>;
  }

  return (
    <div className="quote">
      <p>"{quote.content}"</p>
      <span className="author">- {quote.author}</span>
    </div>
  );
};

export default DailyQuote;
