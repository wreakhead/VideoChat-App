import { createContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import Peer from "simple-peer";

const SocketContext = createContext();
const socket = io("http://localhost:7000/");

const ContextProvider = ({ children }) => {
  const [mute, setMute] = useState(false);
  const [name, setName] = useState("");
  const [myID, setMyID] = useState("");
  const [stream, setStream] = useState(null);
  const [call, setCall] = useState({});
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((currStream) => {
        setStream(currStream); //setting user permission for audio/video
        myVideo.current.srcObject = currStream; // reff upcoming user data
      });

    // setting user id emmited fron server
    socket.on("me", (id) => setMyID(id));
    socket.on("calluser", ({ signal, from, name }) => {
      setCall({ isReceivedCall: true, from, name, signal });
    });
  }, []);

  const answerCall = () => {
    setCallAccepted(true);

    // initiator == false because we are not the one calling
    const peer = new Peer({ initiator: false, trickle: false, stream });

    peer.on("signal", (data) => {
      socket.emit("answercall", { signal: data, to: call.from });
    });

    peer.on("stream", (currStream) => {
      userVideo.current.srcObject = currStream;
    });
    peer.signal(call.signal);

    connectionRef.current = peer;
  };

  const callUser = (id) => {
    const peer = new Peer({ initiator: true, trickle: false, stream });
    peer.on("signal", (data) => {
      socket.emit("calluser", {
        userToCallID: id,
        signalData: data,
        from: myID,
        name,
      });
    });

    peer.on("stream", (currStream) => {
      userVideo.current.srcObject = currStream;
    });

    socket.on("callaccepted", (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });
    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);
    //stopping the feed from others camera
    connectionRef.current.destroy();
    window.location.reload();
  };

  return (
    <SocketContext.Provider
      value={{
        call,
        callAccepted,
        callEnded,
        myVideo,
        userVideo,
        stream,
        name,
        setName,
        myID,
        callUser,
        leaveCall,
        answerCall,
        setMute,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export { ContextProvider, SocketContext };
