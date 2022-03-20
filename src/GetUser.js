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
  const [progress, setProgress] = useState(0); // Progress Bar

  // data fetched based on user id
  const GetUserData = () => {
    setProgress(1)
    axios(
      {
        url: `${url}/getuserbyid/${id}`,
        method: 'GET',
      }).then(response => response.data).then(data => {setData(data);setProgress(0)}).catch();
  };

  useEffect(GetUserData, [setData,id]);


  return <div className='editUser'>
    {/* After the data is fetched Edit Component will be rendered */}
    {(Object.keys(data).length) ? <div><Edit userData={data} /></div> :(progress === 1) && <CircularProgress id='addprogress' color='success'></CircularProgress>}
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

// console.log(userData);

  // var binaryData = [];
  // binaryData.push(pic);


  const [FullName, setFullName] = useState(userData.FullName);
  const [country, setCountry] = useState(userData.country);
  const [Mobile, setMobile] = useState(userData.Mobile);
  const [JobType, setJobType] = useState(userData.JobType);
  // const [ProfilePic, setProfilePic] = useState(window.URL.createObjectURL(new Blob(binaryData, { type: "application/zip" })));
  const [ProfilePic, setProfilePic] = useState(userData.ProfilePic);
  const [Email, setEmail] = useState(userData.Email);
  const [DOB, setDOB] = useState(userData.DOB);

  const {PreferredLocation}=userData;
  console.log(ProfilePic);

  const [Location1,setLocation1]=useState(false)
  const [Location2,setLocation2]=useState(false)
  const [Location3,setLocation3]=useState(false)
  
  const setLocation=()=>{
        const {PreferredLocation}=userData;

       let loc1=PreferredLocation.filter(({location})=>location==='Chennai')
       if(loc1.length)
       {
           setLocation1(true)
       }
       let loc2=PreferredLocation.filter(({location})=>location==='Bangalore')
       if(loc2.length)
       {
           setLocation2(true)
       } let loc3=PreferredLocation.filter(({location})=>location==='Pune')
       if(loc3.length)
       {
           setLocation3(true)
       }
  }

    useEffect(setLocation,[PreferredLocation,userData])

  

  var loc=[]
  if(Location1)
  {
    loc.push({location:'Chennai',checked:true})
  }
  if(Location2)
  {
      loc.push({location:'Bangalore',checked:true})
  }
  if(Location3)
  {
      loc.push({location:'Pune',checked:true})
  }

  const data = { FullName, Mobile, country, JobType, PreferredLocation:loc, ProfilePic, OldEmail: Email, NewEmail: Email, DOB };

  // Update User
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
      <legend>Update</legend>
      <div className='col1'>
        <div className='inputfield-container'>
          <label>Full Name<span>*</span></label>
          <TextField type="text" value={FullName} onChange={(e) => setFullName(e.target.value)} className='inputfield1' variant='outlined' /><br />
        </div>

        <div className='inputfield-container'>
          <label>Mobile<span>*</span></label>

          <FormControl  className='mobile-num-container'>
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
          <TextField type="tel" value={Mobile} onChange={(e) => setMobile(e.target.value)} style={{ width: '8rem', marginLeft: '-1rem' }} className='mobileinputfield' variant='outlined' /><br />



        </div>

        <div className='button-grp-container'>
          <label>Job Type<span>*</span></label>
          <ToggleButtonGroup color='primary' onChange={(e, value) => setJobType(value)} value={JobType} exclusive aria-label="outlined button group">
          <ToggleButton value='FT' className='FT-button' >FT</ToggleButton>
            <ToggleButton value='PT' className='PT-button'>PT</ToggleButton>
            <ToggleButton value='Consultant' className='Consultant-button'>Consultant</ToggleButton>
          </ToggleButtonGroup><br />
        </div>

        <div className='inputfield-checkbox-container'>
          <label>Preferred Location</label><br/>
         
         <div>
          <Checkbox color="primary"checked={Location1} onChange={(e) => setLocation1(e.target.checked)} />
          <label>Chennai</label>
          
          <Checkbox color="primary" checked={Location2}onChange={(e) => setLocation2(e.target.checked)} />
          <label>Bangalore</label>
          
          <Checkbox color="primary" checked={Location3}onChange={(e) => setLocation3(e.target.checked)} />
          <label>Pune</label>
          </div>

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
          <TextField type="email" value={Email} onChange={(e) => setEmail(e.target.value)} className='emailinputfield' variant='outlined' /><br />
        </div>

        <div className='inputfield-container'>
          <label>DOB<span>*</span></label>
          <TextField type="date" value={DOB} onChange={(e) => setDOB(e.target.value)} className='input-date-field' variant='outlined' /><br />
        </div>
        
        <div className='button-container'>
        <Button variant='contained' color='error' onClick={()=>history.push('/')} className='cancel-button'>Cancel</Button>
        <Button variant='contained' onClick={() => updataData(data)} type='submit' className='update-button'>Update</Button>
        </div>

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
