import './App.css';
import './Responsive.css'
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from '@mui/material/Button';
import Toolbar from "@mui/material/Toolbar";
import { Route,Link,Switch} from 'react-router-dom';
import { AddUser } from './AddUser';
import { GetUser } from './GetUser';
import { Home } from './Home';

export default function App() {
  return (
    <div className="App">
          <Container/>
    </div>
  );
}

export const url='https://user-appli-cation.herokuapp.com/api';

function Container()
{
      return <div className='container'>
        <NavBar/>
            <Switch>
                    <Route exact  path='/adduser'><AddUser/></Route>
                    <Route exact  path='/edituser/:id'><GetUser/></Route>
                    <Route exact  path='/'><Home/></Route>
            </Switch>
      </div>
}

// Nav Bar
function NavBar()
{
   return   <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" id='nav'>
            <Toolbar variant="regular">
            <Button color='inherit'><Link className='link' to='/'>Home</Link></Button>
            <Button color='inherit'><Link className='link' to='/adduser'>Add User</Link></Button>
            </Toolbar>
            </AppBar>
            </Box>
}