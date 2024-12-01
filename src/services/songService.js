export const fetchSongs = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/songs");
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching songs:", error);
      return [];
    }
  };
  