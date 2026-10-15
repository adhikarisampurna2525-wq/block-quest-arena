const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: true }, maxHttpBufferSize: 1e6 });
const PORT = process.env.PORT || 3000;
const rooms = new Map();
app.use(express.static(path.join(__dirname, 'public')));
app.get('/health', (_req,res)=>res.json({ok:true, service:'Block Quest multiplayer'}));
function getRoom(name){ if(!rooms.has(name)) rooms.set(name,new Map()); return rooms.get(name); }
function publicPeers(roomMap, currentId){
  return [...roomMap.entries()].map(([id,p])=>({peer:id,isMe:id===currentId,sameTab:id===currentId,presence:p.presence||{}}));
}
function broadcastPeers(name){
  const m=rooms.get(name); if(!m)return;
  for(const [id,p] of m) io.to(id).emit('peers',{peers:publicPeers(m,id),joined:[]});
  if(m.size===0) rooms.delete(name);
}
io.on('connection', socket=>{
  socket.data.room=null; socket.data.presence={};
  socket.on('join-room',(payload,ack)=>{
    const name=String(payload?.room||'').toLowerCase().replace(/[^a-z0-9-]/g,'').slice(0,32);
    if(!name) return ack?.({ok:false,error:'invalid-room'});
    if(socket.data.room){const old=rooms.get(socket.data.room);old?.delete(socket.id);socket.leave(socket.data.room);broadcastPeers(socket.data.room);}
    const m=getRoom(name);
    if(m.size>=4) return ack?.({ok:false,error:'room-full'});
    socket.data.room=name; socket.data.presence={}; m.set(socket.id,{presence:{}}); socket.join(name);
    ack?.({ok:true});
    broadcastPeers(name);
  });
  socket.on('presence',data=>{
    const name=socket.data.room, m=name&&rooms.get(name), p=m?.get(socket.id);
    if(!p||!data||typeof data!=='object')return;
    p.presence=data; socket.data.presence=data;
    broadcastPeers(name);
  });
  socket.on('game-event',msg=>{
    const name=socket.data.room;
    if(!name||!msg||typeof msg.event!=='string'||msg.event.length>40)return;
    const data=msg.data;
    if(msg.event==='sig' && (!data||data.to==null))return;
    const m=rooms.get(name); if(!m)return;
    if(msg.event==='sig'){
      const target=String(data.to);
      if(m.has(target)) io.to(target).emit('game-event:sig',{data,peer:socket.id,isMe:false});
    } else {
      socket.to(name).emit('game-event:'+msg.event,{data,peer:socket.id,isMe:false});
    }
  });
  socket.on('leave-room',()=>{
    const name=socket.data.room;if(!name)return;
    rooms.get(name)?.delete(socket.id);socket.leave(name);socket.data.room=null;broadcastPeers(name);
  });
  socket.on('disconnect',()=>{
    const name=socket.data.room;if(!name)return;
    rooms.get(name)?.delete(socket.id);broadcastPeers(name);
  });
});
server.listen(PORT,'0.0.0.0',()=>console.log(`Block Quest running on http://localhost:${PORT}`));
