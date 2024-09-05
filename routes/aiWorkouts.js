const express = require('express');
const { Pinecone } = require('@pinecone-database/pinecone');
const OpenAI = require('openai');
const bodyParser = require('body-parser');
const router = express.Router()
const {getAllExercises, getAllEquipment, getAllMuscles, getTargetMuscles} = require('../exercisedb')
const firestore = require('../firestore')


//route to display new workout ai generated form
//returns list of all equipment and userId
router.get('/:userId/workouts/new/ai', async (req, res) => {

    try {
        const userId = req.params.userId
        const equipmentAll = await getAllEquipment(req, res)
        const targetMusclesAll = await getTargetMuscles(req, res)

        /*
        console.log(userId)
        console.log(equipmentAll)
        console.log(targetMusclesAll)
        */
        // console.log(exercises.pagination)
        res.status(200).render('17_newAiWorkout', {
            equipmentAll, targetMusclesAll, userId
        })
    } catch (error) {
    console.error('Error fetching exercises data:', error)
    res.status(500).json({ error: 'Failed to fetch exercises data' });
}
})

router.post('/:userId/workouts/new/ai', async (req, res) => {
    try {
        console.log('beginning of post route')
        const { muscle, equipment } = req.body;  // Extract form data (selected muscles and equipment)
        console.log('muscles: ', muscle, "\nequipment: ", equipment)
        const pineconeClient = new Pinecone({
            apiKey: process.env.PINECONE_API_KEY,
        });
        
        const index = pineconeClient.index('exercise-db');
        const openai = new OpenAI();

        // Combine user-selected muscles and equipment for embedding
        const userSelection = `Muscles: ${muscle.join(', ')}, Equipment: ${equipment.join(', ')}`;

        // Create an embedding of the user input using OpenAI
        const embeddingResponse = await openai.embeddings.create({
            model: 'text-embedding-3-small',
            input: userSelection,
        });

        const embedding = embeddingResponse.data[0].embedding;

        // Query Pinecone to retrieve the top 6 exercises from the exercise database
        const results = await index.query({
            topK: 6,  // Retrieve the top 6 matches
            includeMetadata: true,
            vector: embedding,
        });

        // Prepare the response by extracting exercise metadata
        const recommendedExercises = results.matches.map((match) => ({
            name: match.metadata.name,
            target: match.metadata.target,
            equipment: match.metadata.equipment,
            secondaryMuscles: match.metadata.secondaryMuscles,
            instructions: match.metadata.instructions,
        }));

        firestore.createWorkout(exercises, workoutName, location, userId)
        // Send the recommended exercises as a JSON response
        res.status(200).json({
            message: 'Recommended exercises based on your selection:',
            exercises: recommendedExercises,
        });
        console.log('end of post route')
    } catch (error) {
        console.error('Error generating workout:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router












// app.post('/generate-workout', async (req, res) => {
//     try {
//         const data = req.body;  // Extract data from the request body (user's selected muscles and equipment)
//         const pineconeClient = new Pinecone({
//             apiKey: process.env.PINECONE_API_KEY,
//         });
        
//         const index = pineconeClient.index('exercise-db')
//         const openai = new OpenAI();

//         // Assuming the last item in data contains user input
//         const userSelection = data[data.length - 1].context;  // This is the user's input for muscles and equipment

//         // Create an embedding of the user input using OpenAI
//         const embedding = await openai.embeddings.create({
//             model: 'text-embedding-3-small',
//             input: userSelection,
//             encoding_format: 'float',
//         });

//         // Query Pinecone to retrieve the top exercises from the exercise database
//         const results = await index.query({
//             topK: 3, // You can adjust this to get more exercises if needed
//             includeMetadata: true,
//             vector: embedding.data[0].embedding,
//         });

//         let resultString = '\n\nRecommended Exercises based on your selection:';
//         results.matches.forEach((match) => {
//             resultString += `\n
//             Exercise: ${match.metadata.exercise_name}
//             Targeted Muscle: ${match.metadata.target_muscle}
//             Equipment: ${match.metadata.equipment}
//             \n\n
//             `;
//         });

//         // Create the final user message combining their input and the retrieved results
//         const lastMessage = data[data.length - 1];
//         const lastMessageContent = lastMessage.content + resultString;
//         const lastDataWithoutLastMessage = data.slice(0, data.length - 1);

//         // Generate a completion using the retrieved results and user input
//         const completion = await openai.chat.completions.create({
//             messages: [
//                 { role: 'system', content: systemPrompt },
//                 ...lastDataWithoutLastMessage,
//                 { role: 'user', content: lastMessageContent },
//             ],
//             model: 'gpt-4o-mini',  // Use the appropriate model you have access to
//             stream: true,
//         });

//         // Stream the response to the client
//         res.setHeader('Content-Type', 'text/event-stream');
//         completion.stream(async (chunk) => {
//             const content = chunk.choices[0]?.delta?.content;
//             if (content) {
//                 res.write(content);
//             }
//         });

//         // Close the response once the stream is done
//         completion.on('end', () => {
//             res.end();
//         });
//     } catch (error) {
//         console.error('Error generating workout:', error);
//         res.status(500).send('Internal Server Error');
//     }
// });

