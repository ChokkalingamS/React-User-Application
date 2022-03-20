import { useState, forwardRef } from "react";
import Stack from "@mui/material/Stack";
import axios from "axios";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import { styled } from "@mui/material/styles";
import FormControl from "@mui/material/FormControl";
import CircularProgress from "@mui/material/CircularProgress";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import { useHistory } from "react-router-dom";
import { countryCode } from "./countrycode";
import { url } from "./App";

export function AddUser() {
  const [FullName, setFullName] = useState("");
  const [country, setCountry] = useState("");
  const [Mobile, setMobile] = useState("");
  const [JobType, setJobType] = useState("");
  const [ProfilePic, setProfilePic] = useState("");
  const [Email, setEmail] = useState("");
  const [DOB, setDOB] = useState("");

  const [Location1, setLocation1] = useState(false);
  const [Location2, setLocation2] = useState(false);
  const [Location3, setLocation3] = useState(false);

  let history = useHistory();
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

  var loc = [];
  if (Location1) {
    loc.push({ location: "Chennai", checked: true });
  }
  if (Location2) {
    loc.push({ location: "Bangalore", checked: true });
  }
  if (Location3) {
    loc.push({ location: "Pune", checked: true });
  }

  const data = {
    FullName,
    Mobile,
    country,
    JobType,
    PreferredLocation: loc,
    ProfilePic,
    Email,
    DOB,
  };

  const storeData = (data) => {
    setProgress(1);
    axios({
      url: `${url}/createuser`,
      method: "POST",
      data,
    })
      .then((response) => response.data)
      .then((data) => {
        setMessage({ msg: data.Message, result: "success" });
        setTimeout(() => {
          history.push("/");
        }, 2000);
      })
      .catch((error) =>
        setMessage({ msg: error.response.data.Message, result: "warning" })
      )
      .then(handleClick)
      .then(() => setProgress(0));
  };

  const Input = styled("input")({
    display: "none",
  });

  return (
    <div>
      {progress === 1 && (
        <CircularProgress id="addprogress" color="success"></CircularProgress>
      )}

      <fieldset className="addUser">
        <legend>Registration</legend>
        <div className="col1">
          <div className="inputfield-container">
            <label>
              Full Name<span>*</span>
            </label>
            <TextField
              type="text"
              onChange={(e) => setFullName(e.target.value)}
              className="inputfield1"
              variant="outlined"
            />
            <br />
          </div>

          <div className="inputfield-container">
            <label>
              Mobile<span>*</span>
            </label>

            <FormControl className="mobile-num-container">
              <InputLabel id="demo-simple-select-standard-label">
                Code
              </InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select"
                value={country}
                label="Code"
                onChange={(e) => setCountry(e.target.value)}
              >
                {countryCode.map((arr, i) => {
                  return (
                    <MenuItem key={i} value={arr.code}>
                      {arr.code}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            <TextField
              type="tel"
              onChange={(e) => setMobile(e.target.value)}
              style={{ width: "8rem", marginLeft: "-1rem" }}
              className="mobileinputfield"
              variant="outlined"
            />
            <br />
          </div>

          <div className="button-grp-container">
            <label>
              Job Type<span>*</span>
            </label>
            <ToggleButtonGroup
              color="primary"
              onChange={(e, value) => setJobType(value)}
              value={JobType}
              exclusive
              aria-label="outlined button group"
            >
              <ToggleButton value="FT" className="FT-button">
                FT
              </ToggleButton>
              <ToggleButton value="PT" className="PT-button">
                PT
              </ToggleButton>
              <ToggleButton value="Consultant" className="Consultant-button">
                Consultant
              </ToggleButton>
            </ToggleButtonGroup>
            <br />
          </div>

          <div className="inputfield-checkbox-container">
            <label>Preferred Location</label>
            <br />

            <div>
              <Checkbox
                color="primary"
                onChange={(e) => setLocation1(e.target.checked)}
              />
              <label>Chennai</label>

              <Checkbox
                color="primary"
                onChange={(e) => setLocation2(e.target.checked)}
              />
              <label>Bangalore</label>

              <Checkbox
                color="primary"
                onChange={(e) => setLocation3(e.target.checked)}
              />
              <label>Pune</label>
            </div>

            <br />
          </div>
        </div>

        <div className="col2">
          <div className="profilepic-container">
            <label>
              Profile Pic<span>*</span>
            </label>
            {ProfilePic ? (
              <img src={ProfilePic} className="profilepic" alt="profilepic" />
            ) : (
              ""
            )}
            <Stack direction="row" alignItems="center">
              <label htmlFor="contained-button-file">
                <Input
                  accept="image/*"
                  id="contained-button-file"
                  onInput={(e) =>
                    setProfilePic(URL.createObjectURL(e.target.files[0]))
                  }
                  type="file"
                />
                <Button
                  variant="contained"
                  component="span"
                  className="inputfield2"
                >
                  Upload
                </Button>
              </label>
            </Stack>
          </div>

          <div className="emailfield-container">
            <label>
              Email Id<span>*</span>
            </label>
            <TextField
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              className="emailinputfield"
              variant="outlined"
            />
            <br />
          </div>

          <div className="inputfield-container">
            <label>
              DOB<span>*</span>
            </label>
            <TextField
              type="date"
              onChange={(e) => setDOB(e.target.value)}
              className="input-date-field"
              variant="outlined"
            />
            <br />
          </div>

          <Button
            variant="contained"
            onClick={() => storeData(data)}
            color="success"
            type="submit"
            className="add-button"
          >
            Add
          </Button>
        </div>
      </fieldset>

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
