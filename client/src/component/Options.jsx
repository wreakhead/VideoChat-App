import Box from "@mui/material/Box";

import Modal from "@mui/material/Modal";

import React, { useContext, useState } from "react";
import { SocketContext } from "../SocketContext";
import { CopyToClipboard } from "react-copy-to-clipboard";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import CallEndRoundedIcon from "@mui/icons-material/CallEndRounded";
import CallRoundedIcon from "@mui/icons-material/CallRounded";
import Tooltip from "@mui/material/Tooltip";
import EditIcon from "@mui/icons-material/Edit";
import MicIcon from "@mui/icons-material/Mic";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 350,
  backgroundColor: "#152D35",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: "5px",
};

export default function Options() {
  const {
    myID,
    name,
    setName,
    callAccepted,
    leaveCall,
    callUser,
    callEnded,
    setMute,
  } = useContext(SocketContext);
  const [idToCall, setIdToCall] = useState("");

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <div>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <input
              className="inputModal"
              label="Name"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              className="inputModal"
              label="ID to call"
              placeholder="ID to call"
              value={idToCall}
              onChange={(e) => setIdToCall(e.target.value)}
            />
            <button className="okButton" onClick={handleClose} type="submit">
              ok
            </button>
          </Box>
        </Modal>
      </div>
      {callAccepted && !callEnded ? <></> : <></>}

      <div className="fixedBar">
        <Tooltip title="Edit Name/ID" placement="top">
          <button className="editButton" onClick={handleOpen}>
            <EditIcon />
          </button>
        </Tooltip>
        <CopyToClipboard text={myID}>
          <Tooltip title="Copy ID" placement="top">
            <button className="copyButton">
              <ContentCopyRoundedIcon />
            </button>
          </Tooltip>
        </CopyToClipboard>
        {callAccepted && !callEnded ? (
          <button className="hangUp" onClick={leaveCall}>
            <CallEndRoundedIcon />
          </button>
        ) : (
          <button className="callButton" onClick={() => callUser(idToCall)}>
            <CallRoundedIcon />
          </button>
        )}
      </div>
    </>
  );
}
