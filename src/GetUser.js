import { useState, useEffect, forwardRef } from 'react';
import Stack from '@mui/material/Stack';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import { styled } from '@mui/material/styles';
import FormControl from '@mui/material/FormControl';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import { useParams, useHistory } from 'react-router-dom';
import { countryCode } from './countrycode';
import { url } from './App';

export function GetUser() {

  const { id } = useParams();
  const [data, setData] = useState('');

  const GetUserData = () => {
    axios(
      {
        url: `${url}/getuserbyid/${id}`,
        method: 'GET',
      }).then(response => response.data).then(data => setData(data)).catch();
  };

  useEffect(GetUserData, [setData,id]);


  return <div className='editUser'>
    {(Object.keys(data).length) ? <div><Edit userData={data} /></div> : <div>User Not Found</div>}
  </div>;
}




function Edit({ userData }) {

  const { id } = useParams();
  let history = useHistory();

  const [progress, setProgress] = useState(0); // Progress Bar

  // Snackbar 
  const [Message, setMessage] = useState(''); // Server Message

  // Snack bar Open/Close Status
  const [open, setOpen] = useState(false);
  const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
  // Snack bar Open/Close function
  const handleClick = () => { setOpen(true); };
  const handleClose = () => { setOpen(false); };



  let { ProfilePic: pic } = userData;
  var binaryData = [];
  binaryData.push(pic);



  
  const arr = userData.Mobile.split(' ');

  const [FullName, setFullName] = useState(userData.FullName);
  const [country, setCountry] = useState(arr[0]);
  const [Mobile, setMobile] = useState(arr[1]);
  const [JobType, setJobType] = useState(userData.JobType);
  const [PreferredLocation, setPreferredLocation] = useState((userData.PreferredLocation) ? true : false);
  const [ProfilePic, setProfilePic] = useState(window.URL.createObjectURL(new Blob(binaryData, { type: "application/zip" })));
  const [Email, setEmail] = useState(userData.Email);
  const [DOB, setDOB] = useState(userData.DOB);
  



  const data = { FullName, Mobile: `${country} ${Mobile}`, country, JobType, PreferredLocation: (PreferredLocation) ? 'Chennai' : '', ProfilePic, OldEmail: Email, NewEmail: Email, DOB };


  const updataData = (data) => {
    setProgress(1);
    axios(
      {
        url: `${url}/edituser/${id}`,
        method: "PUT",
        data,
      }).then(response => response.data).then(data => {
        setMessage({ msg: data.Message, result: 'success' }); setTimeout(() => {
          history.push('/');
        }, 2000);
      })
      .catch((error) => setMessage({ msg: error.response.data.Message, result: 'warning' })).then(handleClick).then(() => setProgress(0));
  };

  const Input = styled('input')({
    display: 'none',
  });

  return <div>
    {(progress === 1) && <CircularProgress id='addprogress' color='success'></CircularProgress>}
    <fieldset className='addUser'>
      <legend>Edit</legend>
      <div className='col1'>
        <div className='inputfield-container'>
          <label>Full Name<span>*</span></label>
          <TextField type="text" value={FullName} onChange={(e) => setFullName(e.target.value)} className='inputfield1' variant='outlined' /><br />
        </div>

        <div className='inputfield-container'>
          <label>Mobile<span>*</span></label>

          <FormControl style={{ width: '5rem', marginLeft: '1rem' }}>
            <InputLabel id="demo-simple-select-standard-label">Code</InputLabel>
            <Select
              labelId="demo-simple-select-standard-label"
              id="demo-simple-select"
              value={country}
              label="Code"
              onChange={(e) => setCountry(e.target.value)}
            >
              {countryCode.map((arr, i) => { return <MenuItem key={i} value={arr.code}>{arr.code}</MenuItem>; })}
            </Select>
          </FormControl>
          <TextField type="tel" value={Mobile} onChange={(e) => setMobile(e.target.value)} style={{ width: '8rem', marginLeft: '-1rem' }} className='inputfield' variant='outlined' /><br />


        </div>

        <div className='button-grp-container'>
          <label>Job Type<span>*</span></label>
          <ToggleButtonGroup color='primary' onChange={(e, value) => setJobType(value)} value={JobType} exclusive aria-label="outlined button group">
            <ToggleButton value='FT'>FT</ToggleButton>
            <ToggleButton value='PT'>PT</ToggleButton>
            <ToggleButton value='Consultant'>Consultant</ToggleButton>
          </ToggleButtonGroup><br />
        </div>

        <div className='inputfield-checkbox-container'>
          <label>Preferred Location</label>
          <Checkbox checked={(PreferredLocation) ? true : false} color="primary" onChange={(e) => setPreferredLocation(e.target.checked)} />
          <label>Chennai</label><br />
        </div>
      </div>

      <div className='col2'>

        <div className='profilepic-container'>
          <label>Profile Pic<span>*</span></label>
          {(ProfilePic) ? <img src={ProfilePic} className='profilepic' alt='profilepic' /> : ''}
          <Stack direction="row" alignItems="center">
            <label htmlFor="contained-button-file">
              <Input
                accept="image/*"
                id="contained-button-file"
                onInput={(e) => setProfilePic(URL.createObjectURL(e.target.files[0]))}
                type="file" />
              <Button variant="contained" component="span" className='inputfield2'>
                Upload
              </Button>
            </label>
          </Stack>
        </div>


        <div className='emailfield-container'>
          <label>Email Id<span>*</span></label>
          <TextField type="email" value={Email} onChange={(e) => setEmail(e.target.value)} className='inputfield' variant='outlined' /><br />
        </div>

        <div className='inputfield-container'>
          <label>DOB<span>*</span></label>
          <TextField type="date" value={DOB} onChange={(e) => setDOB(e.target.value)} className='input-date-field' variant='outlined' /><br />
        </div>

        <Button variant='contained' onClick={() => updataData(data)} type='submit' className='add-button'>Update</Button>
      </div>



    </fieldset>

    {/* Snack Bar */}
    <Stack spacing={2} sx={{ width: '100%' }}>
      <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
        <Alert severity={Message.result} sx={{ width: '100%' }}>
          {Message.msg}
        </Alert>
      </Snackbar>
    </Stack>
  </div>;
}
