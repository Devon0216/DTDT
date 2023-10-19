require('dotenv').config()
const express = require('express')
const app = express()
const path = require('path')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const connectDB = require('./config/dbConn')
const mongoose = require('mongoose')
const PORT = process.env.PORT || 3500
const natural = require('natural');
const http = require('http');
const socketIo = require('socket.io');



app.use(cors(corsOptions))
const server = http.createServer(app);

// Set up socket.io for the communication bewteen users
const io = socketIo(server, {
  cors: {
    origin: "https://whiteboarddj.onrender.com",
    methods: ["GET", "POST"]
  }
});
const connectedUsers = {};

// Listen for new connections from clients socket
io.on('connection', (socket) => {
  const query = socket.handshake.query;

  if (query.userId) {
    const userId = query.userId;
    connectedUsers[userId] = socket.id;
    io.emit('userList', Object.keys(connectedUsers));
 
    // Send the connected users list to all connected sockets
    socket.on('sendMessage', (data) => {
      data.recipients.forEach(recipientId => {
        const recipientSocketId = connectedUsers[recipientId];
        if (recipientSocketId) {
          io.to(recipientSocketId).emit('receiveMessage', data.message );
        }
      });
    });

    // Send the current running agenda to all connected sockets
    socket.on('sendRunnigAgenda', (data) => {
      data.recipients.forEach(recipientId => {
        const recipientSocketId = connectedUsers[recipientId];
        if (recipientSocketId) {
          io.to(recipientSocketId).emit('receiveRunningAgenda', data );
        }
      });
    });
    
    // Disconnect the socket when the user closes the browser
    socket.on('disconnect', () => {
      console.log("disconnected")
      if (query.userId) {
        delete connectedUsers[query.userId];
        io.emit('userList', Object.keys(connectedUsers));
      }
    });
  }
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Connect to MongoDB
connectDB()

// Set up the application and routes
app.use(express.json())
app.use(cookieParser())
app.use('/', express.static(path.join(__dirname, 'public')))
app.use('/', require('./routes/root'))
app.use('/users', require('./routes/userRoutes'))
app.use('/notes', require('./routes/noteRoutes'))
app.use('/miro', require('./routes/miroRoutes'))
app.use('/workshops', require('./routes/workshopRoutes'))
app.use('/auth', require('./routes/authRoutes'))

// Set up the summarization route
app.post('/summarise', (req, res) => {
  const { notes, sensitivity } = req.body;

  try {
    // Tokenize the document into sentences
    const tokenizer = new natural.SentenceTokenizer();
    const sentences = tokenizer.tokenize(notes);

    // Create a new TfIdf instance
    const tfidf = new natural.TfIdf();
    sentences.forEach((sentence) => {
      tfidf.addDocument(new natural.WordTokenizer().tokenize(sentence));
    });

    // Calculate the TF-IDF scores and select top sentences for summary
    const numSentencesInSummary = sensitivity;
    const summarySentences = [];
    sentences.forEach((sentence, sentenceIndex) => {
      let totalScore = 0;
      const tokens = new natural.WordTokenizer().tokenize(sentence);
      tokens.forEach((token) => {
        totalScore += tfidf.tfidf(token, sentenceIndex);
      });
      summarySentences.push({ sentence, score: totalScore });
    });

    // Sort sentences by score and get the top N sentences according to the sensitivity
    summarySentences.sort((a, b) => b.score - a.score);
    const topSentences = summarySentences.slice(0, numSentencesInSummary);

    const summary = topSentences.map((item) => item.sentence).join(' ');
    res.json({ summary });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

// If error is encountered, send 404 page
app.all('*', (req, res) => {
    res.status(404)
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    } else if (req.accepts('json')) {
        res.json({ message: '404 Not Found' })
    } else {
        res.type('txt').send('404 Not Found')
    }
})

// Set up the MongoDB connection
mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB')
})

mongoose.connection.on('error', err => {
    console.log(err)
})

module.exports = {app}