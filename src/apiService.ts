import axios from 'axios';

// Function to get the user's location based on IP
export async function getLocation() {
  try {
    const response = await axios.get('http://ip-api.com/json');
    return response.data;
  } catch (error) {
    console.error('Error fetching location:', error);
  }
}

// Function to get sunrise and sunset times based on coordinates
export async function getSunTimes(latitude: number, longitude: number) {
  try {
    const url = `https://api.sunrise-sunset.org/json?lat=${latitude}&lng=${longitude}&formatted=0`;
    const response = await axios.get(url);
    return response.data.results;
  } catch (error) {
    console.error('Error fetching sun times:', error);
  }
}

module.exports = { getLocation, getSunTimes };