const express = require('express');
const { Pinecone } = require('@pinecone-database/pinecone');
const OpenAI = require('openai');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json()); // Parse incoming JSON data

const systemPrompt = `
You are a virtual assistant designed to help users generate customized workout plans. When a user selects muscles and equipment, you will:

1. Understand the Query: Parse the user's input to determine their preferences, such as specific muscles they want to target or the equipment available.
2. Retrieve Information: Use Retrieval-Augmented Generation (RAG) to search the exercise database and retrieve relevant exercises that match the user's criteria.
3. Provide a Workout Plan: Present a workout plan with the best exercises based on the selected muscles and available equipment. Each recommendation should include:
   - Exercise Name
   - Targeted Muscle Group
   - Equipment Required
   - Number of Sets and Reps
4. Be Concise and Informative: Provide clear, concise workout plans that align with the user's preferences and needs.
`;

app.post('/generate-workout', async (req, res) => {
    try {
        const data = req.body;  // Extract data from the request body (user's selected muscles and equipment)
        const pineconeClient = new Pinecone({
            apiKey: process.env.PINECONE_API_KEY,
        });
        
        const index = pineconeClient.index('exercise-db').namespace('ns1');
        const openai = new OpenAI();

        // Assuming the last item in data contains user input
        const userSelection = data[data.length - 1].context;  // This is the user's input for muscles and equipment

        // Create an embedding of the user input using OpenAI
        const embedding = await openai.embeddings.create({
            model: 'text-embedding-3-small',
            input: userSelection,
            encoding_format: 'float',
        });

        // Query Pinecone to retrieve the top exercises from the exercise database
        const results = await index.query({
            topK: 3, // You can adjust this to get more exercises if needed
            includeMetadata: true,
            vector: embedding.data[0].embedding,
        });

        let resultString = '\n\nRecommended Exercises based on your selection:';
        results.matches.forEach((match) => {
            resultString += `\n
            Exercise: ${match.metadata.exercise_name}
            Targeted Muscle: ${match.metadata.target_muscle}
            Equipment: ${match.metadata.equipment}
            \n\n
            `;
        });

        // Create the final user message combining their input and the retrieved results
        const lastMessage = data[data.length - 1];
        const lastMessageContent = lastMessage.content + resultString;
        const lastDataWithoutLastMessage = data.slice(0, data.length - 1);

        // Generate a completion using the retrieved results and user input
        const completion = await openai.chat.completions.create({
            messages: [
                { role: 'system', content: systemPrompt },
                ...lastDataWithoutLastMessage,
                { role: 'user', content: lastMessageContent },
            ],
            model: 'gpt-4o-mini',  // Use the appropriate model you have access to
            stream: true,
        });

        // Stream the response to the client
        res.setHeader('Content-Type', 'text/event-stream');
        completion.stream(async (chunk) => {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
                res.write(content);
            }
        });

        // Close the response once the stream is done
        completion.on('end', () => {
            res.end();
        });
    } catch (error) {
        console.error('Error generating workout:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Listen on a specific port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
