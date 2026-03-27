# Similarity of Singing Voices Survey

This code project is a custom built survey for my master thesis: _"Comparing Perceptual Similarity of Singing Voices with Digital Voice Representations"_. The goal of this survey is to gather a "golden standart" of perceptual similarity mapping model of singing voices.  
During the survey users are instructed to order multiple sets of triplets. One voice (X) is be the target voice and two voices (A and B) are reference voices. The user shall choose the reference voice which is more similar to X.
The survey result is used to finetune a voice embedding model.

## Before you Start

### Dataset requirements

### Software requirements

## Deploy the Survey

To deploy the survey you can use the docker-compose.yml file as example.
Edit the configuration and environment variables to fit your local setup.

### Run from prebuild docker image:

Edit the docker compose yaml file pull the image from docker hub.

```yml
services:
  app:
    container_name: similarity-of-singing-voices-survey-app-1
    image: nasenboi/similarity-of-singing-voices-survey:latest
```

## Getting Started Locally

To run this survey application locally:

1. Clone the repository:
   ```sh
   git clone https://github.com/username/similarity-of-singing-voices-survey.git
   ```
2. Navigate to the project directory:
   ```sh
   cd similarity-of-singing-voices-survey
   ```
3. Install dependencies:
   ```sh
   npm install
   ```
4. Start the development server:
   ```sh
   npm start
   ```
5. Open `http://localhost:3000` in your browser.
