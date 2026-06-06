"use client";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import Timer from "./Timer";
interface Props { userGender: string; userId: string; }
export default function VideoChat({ userGender, userId }: Props) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [partner, setPartner] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [callDuration, setCallDuration] = useState(0);
  const localVideo = useRef<HTMLVideoElement>(null);
  const remoteVideo = useRef<HTMLVideoElement>(null);
  const pc = useRef<RTCPeerConnection | null>(null);
  useEffect(() => {
    const s = io(process.env.NEXT_PUBLIC_SOCKET_URL!);
    setSocket(s);
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => { if (localVideo.current) localVideo.current.srcObject = stream; });
    return () => { s.disconnect(); if (pc.current) pc.current.close(); };
  }, []);
  const findMatch = () => {
    if (!socket) return;
    socket.emit("find-match", { userId, gender: userGender });
    socket.once("match-found", ({ partner, sessionId }) => {
      setPartner(partner);
      setSessionId(sessionId);
      createPeerConnection(partner);
    });
  };
  const createPeerConnection = (partnerId: string) => {
    const config = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };
    pc.current = new RTCPeerConnection(config);
    pc.current.onicecandidate = (e) => {
      if (e.candidate) socket?.emit("signal", { to: partnerId, signal: e.candidate });
    };
    pc.current.ontrack = (e) => { if (remoteVideo.current) remoteVideo.current.srcObject = e.streams[0]; };
    const stream = localVideo.current?.srcObject as MediaStream;
    stream?.getTracks().forEach(track => pc.current?.addTrack(track, stream));
    socket?.emit("signal", { to: partnerId, signal: { type: "offer" } }); // simplified, full webrtc handshake omitted for brevity
  };
  return (
    <div className="flex flex-col items-center">
      <div className="grid grid-cols-2 gap-4 w-full max-w-4xl">
        <video autoPlay muted ref={localVideo} className="bg-black rounded" />
        <video autoPlay ref={remoteVideo} className="bg-black rounded" />
      </div>
      <Timer onTimeUpdate={setCallDuration} isActive={!!partner} sessionId={sessionId} partner={partner} />
      <button onClick={findMatch} className="mt-4 bg-blue-500 text-white px-6 py-2 rounded">Find Match</button>
    </div>
  );
}
