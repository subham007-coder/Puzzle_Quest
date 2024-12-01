import React, { useState, useEffect } from "react";
import "./MemoryGame.css";

const BACKEND_URL = "https://puzzle-game-backend-a7gf.onrender.com";

const MemoryGame = () => {
  const [cards, setCards] = useState([]); // Cards state
  const [flippedCards, setFlippedCards] = useState([]); // State to track flipped cards
  const [matchedCards, setMatchedCards] = useState([]); // State to track matched cards
  const [currentAudio, setCurrentAudio] = useState(null); // To track the currently playing song

  // Fetch card data from API
  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/songs`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include'
        });
        const data = await response.json();

        // Duplicate cards for matching and shuffle
        const formattedCards = data.flatMap((card) => [
          { ...card, id: `${card._id}-1` },
          { ...card, id: `${card._id}-2` },
        ]);
        const shuffledCards = formattedCards.sort(() => Math.random() - 0.5);

        setCards(shuffledCards);
      } catch (error) {
        console.error("Error fetching cards:", error);
      }
    };

    fetchCards();
  }, []);

  // Handle card click
  const handleCardClick = (id) => {
    if (flippedCards.length === 2) return; // Prevent flipping more than 2 cards

    setFlippedCards((prev) => [...prev, id]);

    // Find the card clicked
    const clickedCard = cards.find((card) => card.id === id);

    // If two cards are flipped, check for a match
    if (flippedCards.length === 1) {
      const firstCard = cards.find((card) => card.id === flippedCards[0]);
      const secondCard = clickedCard;

      // If the first and second card are the same, don't play the song again
      if (firstCard._id === secondCard._id) {
        // It's a match, so do nothing regarding song playing
        setTimeout(() => {
          setFlippedCards([]);
        }, 1000);
      } else {
        // If the cards don't match, stop the song after a delay
        setTimeout(() => {
          if (currentAudio) {
            currentAudio.pause(); // Stop the song
          }
          setFlippedCards([]); // Reset flipped cards
        }, 1000);
      }
    } else {
      // If it's the first card, play the song
      if (currentAudio) {
        currentAudio.pause(); // Stop the song if there was a previous one
      }

      const audio = new Audio(`${clickedCard.audio}`);
      audio.play();
      setCurrentAudio(audio);
    }

    // Check for a match and set matched cards if necessary
    if (flippedCards.length === 1) {
      const firstCard = cards.find((card) => card.id === flippedCards[0]);
      const secondCard = clickedCard;

      if (firstCard && secondCard && firstCard._id === secondCard._id) {
        setMatchedCards((prev) => [...prev, firstCard._id]);
      }
    }
  };

  return (
    <div className="flex justify-center items-center tracking-tighter">
      <div className="grid grid-cols-4 gap-4 p-8">
        {cards.slice(0, 16).map((card) => (
          <div
            key={card.id}
            className={`card cursor-pointer relative w-24 h-32 bg-blue-600 rounded-lg shadow-lg flex items-center justify-center overflow-hidden transform transition-transform duration-300 ${
              flippedCards.includes(card.id) || matchedCards.includes(card._id)
                ? "flipped scale-110"
                : ""
            }`}
            onClick={() => handleCardClick(card.id)}
          >
            <div className="card-inner w-full h-full transform rotate-y-180">
              <div className="card-front w-full h-full flex items-center justify-center bg-white rounded-lg">
                <img
                  src={`${card.image}`}
                  alt={card.title}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="card-back w-full h-full bg-gray-800 rounded-lg flex items-center justify-center text-white text-2xl">
                ?
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MemoryGame;
