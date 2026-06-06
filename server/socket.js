const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const { PrismaClient } = require('./node_modules/@prisma/client');

const prisma = new PrismaClient();
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: process.env.NEXTAUTH_URL || "*", credentials: true }
});

let maleQueue = [];
let femaleQueue = [];

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  socket.on('find-match', async ({ userId, gender }) => {
    if (gender === 'MALE') {
      if (femaleQueue.length > 0) {
        const matchId = femaleQueue.shift();
        createMatch(socket.id, matchId);
      } else {
        maleQueue.push(socket.id);
        socket.emit('waiting');
      }
    } else {
      if (maleQueue.length > 0) {
        const matchId = maleQueue.shift();
        createMatch(matchId, socket.id);
      } else {
        femaleQueue.push(socket.id);
        socket.emit('waiting');
      }
    }
  });

  async function createMatch(manId, womanId) {
    const session = await prisma.videoSession.create({
      data: { manId, womanId }
    });
    io.to(manId).emit('match-found', { partner: womanId, sessionId: session.id });
    io.to(womanId).emit('match-found', { partner: manId, sessionId: session.id });
  }

  socket.on('signal', ({ to, signal }) => {
    io.to(to).emit('signal', { from: socket.id, signal });
  });

  socket.on('end-call', async ({ sessionId, durationSecs }) => {
    const session = await prisma.videoSession.findUnique({
      where: { id: sessionId },
      include: { man: true, woman: true }
    });
    if (durationSecs > 20) {
      const paidSecs = durationSecs - 20;
      const creditsToSpend = Math.ceil(paidSecs / 60) * 3;
      const creditsToEarn = Math.ceil(paidSecs / 60) * 2;
      await prisma.$transaction([
        prisma.user.update({ where: { id: session.manId }, data: { credits: { decrement: creditsToSpend } } }),
        prisma.user.update({ where: { id: session.womanId }, data: { earnings: { increment: creditsToEarn } } }),
        prisma.videoSession.update({ where: { id: sessionId }, data: { endTime: new Date(), durationSecs, creditsSpent: creditsToSpend, creditsEarned: creditsToEarn } })
      ]);
    }
  });
});

httpServer.listen(3001, () => console.log('Matching server running on port 3001'));
