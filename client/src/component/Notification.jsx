import React, { useContext } from "react";

import { SocketContext } from "../SocketContext";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

export default function Notification() {
  const { answerCall, call, callAccepted } = useContext(SocketContext);
  return (
    <>
      {call.isReceivedCall && !callAccepted && (
        <Stack sx={{ width: "50%" }} spacing={2}>
          <Alert
            severity="info"
            action={
              <Button color="inherit" size="small" onClick={answerCall}>
                answer
              </Button>
            }
          >
            {call.name} is calling
          </Alert>
        </Stack>
      )}
    </>
  );
}
