import React, { useContext } from "react";
import { Grid, Typography, Paper, makeStyles } from "@material-ui/core";
import { SocketContext } from "../SocketContext";

const useStyles = makeStyles((theme) => ({
  video: {
    width: "550px",
    [theme.breakpoints.down("xs")]: {
      width: "100%",
    },
  },
  gridContainer: {
    justifyContent: "center",
    [theme.breakpoints.down("xs")]: {
      flexDirection: "column",
    },
  },
  paper: {
    backgroundColor: "#152D35",
    margin: "5px",
  },
  text: { padding: "5px" },
}));

export default function VideoChat(props) {
  const { name, callAccepted, callEnded, stream, call, myVideo, userVideo } =
    useContext(SocketContext);

  const classes = useStyles();

  return (
    <>
      <Grid container className={classes.gridContainer}>
        {stream && (
          <Paper className={classes.paper}>
            <Grid item xs={12} md={6}>
              <video
                playsInline
                muted
                ref={myVideo}
                autoPlay
                className={classes.video}
              />
              <Typography variant="h5" className={classes.text}>
                {name || "Name"}
              </Typography>
            </Grid>
          </Paper>
        )}
        {callAccepted && !callEnded && (
          <Paper className={classes.paper}>
            <Grid item xs={12} md={6}>
              <video
                playsInline
                ref={userVideo}
                autoPlay
                muted={true}
                className={classes.video}
              />
              <Typography variant="h5" className={classes.text}>
                {call.name || "Name2"}
              </Typography>
            </Grid>
          </Paper>
        )}
      </Grid>
    </>
  );
}
