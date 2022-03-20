import { useState, useEffect, forwardRef } from "react";
import Stack from "@mui/material/Stack";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import Tooltip from "@mui/material/Tooltip";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { useHistory } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { url } from "./App";

export function Home() {
  const [rows, setRows] = useState(""); // table rows

  const [progress, setProgress] = useState(0); // Progress Bar
  // Snackbar
  const [Message, setMessage] = useState(""); // Server Message

  // Snack bar Open/Close Status
  const [open, setOpen] = useState(false);
  const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
  // Snack bar Open/Close function
  const handleClick = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  // Userlist
  const getTableData = () => {
    setProgress(1);
    axios({
      url: `${url}/getusers`,
      method: "GET",
    })
      .then((response) => response.data)
      .then((data) => {
        setRows(data);
        setProgress(0);
      })
      .catch();
  };

  useEffect(getTableData, [setRows]);

  // Delete User
  const removeUser = (id) => {
    axios({
      url: `${url}/deleteuser/${id}`,
      method: "DELETE",
    })
      .then((response) =>
        setMessage({ msg: response.data.Message, result: "success" })
      )
      .catch((error) =>
        setMessage({ msg: error.response.data.Message, result: "warning" })
      )
      .then(handleClick)
      .then(getTableData);
  };

  return (
    <div className="home">
      <div>
        {rows.length ? (
          <TableView rows={rows} removeUser={removeUser} />
        ) : (
          progress === 1 && (
            <CircularProgress
              id="addprogress"
              color="success"
            ></CircularProgress>
          )
        )}
      </div>

      <div>
        {rows.length ? (
          <Tab rows={rows} removeUser={removeUser} />
        ) : (
          progress === 1 && (
            <CircularProgress
              id="tab-progress"
              color="success"
            ></CircularProgress>
          )
        )}
      </div>

      {/* Snack Bar */}
      <Stack spacing={2} sx={{ width: "100%" }}>
        <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
          <Alert severity={Message.result} sx={{ width: "100%" }}>
            {Message.msg}
          </Alert>
        </Snackbar>
      </Stack>
    </div>
  );
}

// Desktop Version

function TableView({ rows, removeUser }) {
  return (
    <TableContainer component={Paper} id="table">
      <Table sx={{ minWidth: 400 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="center">Name</TableCell>
            <TableCell align="center">Email</TableCell>
            <TableCell align="center">Mobile</TableCell>
            <TableCell align="center">DOB</TableCell>
            <TableCell align="center">JobType</TableCell>
            <TableCell align="center">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(({ FullName, Email, Mobile, DOB, JobType, _id }) => {
            return (
              //  Table row : Individual user data
              <TableRow
                className="userdata"
                key={_id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell align="center">
                  {" "}
                  <p className="username">{FullName} </p>
                </TableCell>
                <TableCell align="center">
                  {" "}
                  <p className="userphnno">{Email} </p>
                </TableCell>
                <TableCell align="center">
                  {" "}
                  <p className="usermail">{Mobile} </p>
                </TableCell>
                <TableCell align="center">
                  {" "}
                  <p className="status">{DOB} </p>
                </TableCell>
                <TableCell align="center">
                  {" "}
                  <p className="status">{JobType} </p>
                </TableCell>
                <TableCell align="center">
                  {" "}
                  <Features id={_id} removeUser={removeUser} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

// Features->Edit,Delete
function Features({ id, removeUser, show }) {
  let history = useHistory();
  return (
    <div className="features">
      <Tooltip title="Edit">
        {!show ? (
          <IconButton onClick={() => history.push(`/edituser/${id}`)}>
            <ModeEditIcon color="success" />
          </IconButton>
        ) : (
          <Button
            variant="contained"
            color="warning"
            onClick={() => history.push(`/edituser/${id}`)}
          >
            Edit
          </Button>
        )}
      </Tooltip>

      <Tooltip title="Delete">
        <IconButton onClick={() => removeUser(id)} className="del-button">
          <DeleteIcon color="error" />
        </IconButton>
      </Tooltip>
    </div>
  );
}

// Mobile Version

function Tab({ rows, removeUser }) {
  return (
    <div className="tab">
      {rows.map(({ FullName, Email, Mobile, DOB, JobType, _id }) => {
        return (
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography variant="h6">{FullName}</Typography>
            </AccordionSummary>

            <AccordionDetails className="tab-content">
              <Typography className="tab-item" variant="subtitle1">
                <span>Email</span> {Email}
              </Typography>
              <Typography className="tab-item" variant="subtitle1">
                <span>Mobile</span>
                {Mobile}
              </Typography>
              <Typography className="tab-item" variant="subtitle1">
                <span>DOB</span>
                {DOB}
              </Typography>
              <div className="tab-feature">
                <Typography className="tab-item" variant="subtitle1">
                  <span>JobType</span>
                  {JobType}
                </Typography>
                <Features id={_id} removeUser={removeUser} show={true} />
              </div>
            </AccordionDetails>
          </Accordion>
        );
      })}
    </div>
  );
}
