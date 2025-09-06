import express from "express";
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabaseurl = process.env.PROJECT_ID || '';
const supabasekey = process.env.SUPABASE_SECRET || ''
const supabase = createClient(supabaseurl, supabasekey)


const corsOptions = {
  origin: [process.env.CLIENT_BASE_URL || 'http://localhost:3000', 'https://www.getpostman.com', 'http://localhost:5173'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};

const app = express();
app.use(cors(corsOptions))

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
  }
});

app.use(express.json());

app.get("/messages", async (req, res) => {
  const { data, error } = await supabase.from('chat').select();
  res.send(data)
});

app.post("/message", async (req, res) => {
  console.log(req)

  const insertedData = {
    message: req.body.text,
    user: (req.body.user == "Joe" ? 1 : 0)
  }

  const { data, error} = await supabase
    .from('chat')
    .insert(insertedData);

  if (error) {
    console.log(error.message);
  } else {
    console.log("inserted correctly", data);
  }

  res.send(data)
});

io.on('connection', (socket) => {
  console.log('a user has connected ts')

  socket.on('chat', async (msg) => {
    console.log('Received message:', msg)
    
    const insertedData = {
      message: msg.message,
      user: (msg.sender === "Joe" ? 1 : 0)
    }

    const { data, error } = await supabase
      .from('chat')
      .insert(insertedData)
      .select()
      .single();

    if (error) {
      console.log('Database error:', error.message);
      io.emit('chat', msg);
    } else {
      console.log('Message saved to database:', data);
      const broadcastMsg = {
        message: data.message,
        sender: data.user === 1 ? "Joe" : "Other",
        timestamp: new Date(data.created_at).toLocaleString(),
        id: data.id
      };
      io.emit('chat', broadcastMsg);
    }
  })

  socket.on('disconnect', () => {
    console.log("user disconnected")
  })
})

server.listen(3000, () => {
  console.log("running server")
})

