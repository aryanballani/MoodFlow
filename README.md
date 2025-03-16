# Mood Flow

Mood Flow is a personalized activity recommendation platform that suggests activities based on your mood, weather, and preferences. It also enables users to log and share activities with friends, fostering a social and engaging experience.

## Inspiration
We wanted to build a project that helps people identify the perfect activity tailored to their mood and weather conditions. Additionally, Mood Flow allows users to share their consistent activities through a logging page and connect with friends.

## Features
- **Personalized Recommendations:** Suggests activities based on user mood, interests, location, and age.
- **Weather-Based Suggestions:** Integrates real-time weather data for optimized activity recommendations.
- **Social Features:** Enables users to meet friends at suggested locations and post activities later.
- **User Authentication:** Allows users to log in and track their past activities.

## How It Works
1. Users log in and input their mood, location, age, and interests.
2. A locally hosted LLM (Ollama-3.2-3B) generates personalized activity suggestions.
3. Google Maps API provides location-based recommendations where users can meet.
4. Users can log their activities and share them with friends.

## Technologies Used
- **Frontend:** React.js
- **Backend:** Express.js
- **Database:** MongoDB
- **AI Model:** Ollama-3.2-3B for activity generation
- **APIs:** Google Maps API, Weather API

## Challenges We Faced
- Syncing latitude and longitude data with the Weather API.
- Integrating the backend with the frontend seamlessly.

## Accomplishments
- Successfully built and deployed a functional application within the given timeframe.
- Explored and integrated various technologies, enhancing our technical skills.

## What We Learned
- React Hooks for managing state and component lifecycles.
- Setting up and configuring the Ollama-3B model for local AI processing.
- Implementing Express.js for handling backend API calls.

## Future Plans
- **Enhanced Social Features:** Expanding the networking aspect by allowing users to post, react, and share activities with each other.
- **Improved UI/UX:** Enhancing the interface for a more seamless user experience.
- **Scalability:** Improving performance and expanding the recommendation model.

## Watch a tutorial and try It Out
https://www.youtube.com/watch?v=jcUoEGAPVgo

