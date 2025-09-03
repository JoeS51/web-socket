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
  origin: [process.env.CLIENT_BASE_URL || 'http://localhost:3000', 'https://www.getpostman.com'],
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

app.get("/", async (req, res) => {
  const { data, error } = await supabase.from('chat').select();
  res.send(data)
});

io.on('connection', (socket) => {
  console.log('a user has connected ts')

  socket.on('chat', (msg) => {
    console.log(msg)
    io.emit('chat', msg)
  })

  io.on('disconnect', () => {
    console.log("user disconnected")
  })
})

server.listen(3000, () => {
  console.log("running server")
})

