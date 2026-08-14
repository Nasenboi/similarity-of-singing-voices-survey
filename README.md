# Similarity of Singing Voices Survey

### Update 2: The survey is Done! ✅

The survey will still be online for some time, but participations are not longer needed.  
Thanks to everyone that participated in this survey and supported this project!

### Update: The Survey is Online! 🌍

Visit [similarity-of-singing-voices.com](similarity-of-singing-voices.com) to participate in it.  
Every answer is appreciated!

## Description

This project is a custom-built survey for my master’s thesis:
_"Comparing Perceptual Similarity of Singing Voices with Digital Voice Representations."_

The goal of this survey is to establish a _golden standard_ for perceptual similarity ratings of singing voices. Other voice similarity ratings — either generated through acoustic measurements or machine learning embeddings — will be compared to this standard. A correlation analysis can yield the best matching _digital voice representation_ of singing voices with perceptually accurate voice models for similarity estimation. In addition acoustic measures can reveal patterns in how humans rate the similarity of singing voices. Lastly, the collected results can additionally be used to fine-tune a voice embedding model, which will generate the final voice similarity embedding used for comparison.

During the survey, users are asked to evaluate multiple triplets of audio samples. One voice (X) is the target, and two voices (A and B) are reference samples. The user selects which reference voice is more similar to X.

## Before you Start

There are a few requirements to run this survey: a dataset and supporting software.

### Dataset requirements

The songs used in this survey come from the [Free Music Archive (FMA)](https://github.com/mdeff/fma). Over 11,000 songs were manually labeled using custom Python software. The labels include:

- Audio Quality score (0–3)
- A flag indicating multiple voices

The labeled dataset is planned to be published after the survey.

For this survey, only songs with: Audio Quality = 3 & single voice, were selected, resulting in ~700 songs.

For machine learning purposes vocal and instrument stems were extracted for each song using:

- [python-audio-separator](https://github.com/nomadkaraoke/python-audio-separator/tree/main)
- [Mel-Band-Roformer Vocal model](https://github.com/KimberleyJensen/Mel-Band-Roformer-Vocal-Model)

The isolated vocals were then used to generate embeddings via:

- [speechbrain](https://speechbrain.readthedocs.io/en/latest/)
- [spkrec-ecapa-voxceleb-mel-spec](https://huggingface.co/speechbrain/spkrec-ecapa-voxceleb-mel-spec)

To generate meaningful triplets, the custom library [torch-maxent-triplet-selection](https://github.com/Nasenboi/torch-maxent-triplet-selection) was developed. It selects triplets (A, B, X) with the highest uncertainty—i.e., cases where the model is least certain whether A–X or B–X is more similar.

### Software requirements

To run and deploy the survey, a basic web stack is required.

Simple deployment:

- [docker + compose](https://www.docker.com/)

Local (non-containerized) setup:

- [Node.js + npm](https://nodejs.org/en)
- [meteor](https://docs.meteor.com/)

## Deploy the Survey

You can use the provided docker-compose.yml as a template.
Adjust configuration and environment variables to match your setup.

### Run from prebuild docker image:

Edit your Docker Compose file to pull the image from Docker Hub:

```yml
services:
  app:
    container_name: similarity-of-singing-voices-survey-app-1
    image: nasenboi/similarity-of-singing-voices-survey:latest
```

## Getting Started Locally

To run the survey locally:

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
5. Open [http://localhost:3000](http://localhost:3000) in your browser.
