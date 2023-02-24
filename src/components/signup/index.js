import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { useState} from 'react';
import { store, actionAuthLogin, history, jwtDecode } from '../../App.js';
import { useDispatch } from "react-redux";
import VisibilityIcon from '@material-ui/icons/Visibility';
import InputAdornment from '@mui/material/InputAdornment';
import { IconButton } from '@material-ui/core';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import { actionRegister, actionUpdateMe, actionLogin } from '../../actions';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Anton project © '}
      <Link color="inherit" href="https://mui.com/">
        OLX
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(13),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  typography: {
    marginLeft: theme.spacing(15),
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignUp() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [text, setText] = useState({ login: '', pass: '', pass2: '', lastName: '', firstName: '' })
  const [inputPass, setInputPass] = useState('password')
  const [user, setUser] = useState(false)
  const [checkPass, setCheckPass] = useState(false)

  async function buttonOnckick() {
    if(text.pass.length>=6){
      const nick = text.lastName + " " + text.firstName
      console.log(nick)
      const user = await dispatch(actionRegister(text.login, text.pass,nick))
      console.log(user)
      if (user) {
        const token = await dispatch(actionLogin(text.login, text.pass))
        console.log(token)
        if (token) {
          await store.dispatch(actionAuthLogin(token.token));
          history.push("/page/1")
        }
      }else{
        setUser(true)
      }
    }else{setCheckPass(true)}
  }

  const enterHandler = (event) => {
    if (event.key === 'Enter') {
      buttonOnckick()
    }
  }

  const seePassword = () => {
    if (inputPass === 'password') {
      setInputPass('text')
    } else {
      setInputPass('password')
    }
  }
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <form className={classes.form} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                onKeyPress={enterHandler}
                value={text.firstName}
                onChange={e => setText({ ...text, firstName: e.target.value })}
                autoComplete="fname"
                name="firstName"
                variant="outlined"
                required
                fullWidth
                id="firstName"
                label="First Name"
                autoFocus
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                onKeyPress={enterHandler}
                value={text.lastName}
                onChange={e => setText({ ...text, lastName: e.target.value })}
                variant="outlined"
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="lname"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                onKeyPress={enterHandler}
                value={text.login}
                onChange={e => setText({ ...text, login: e.target.value })}
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                onKeyPress={enterHandler}
                value={text.pass}
                onChange={e => setText({ ...text, pass: e.target.value })}
                variant="outlined"
                required
                fullWidth
                InputProps={{
                  endAdornment: <InputAdornment position="end">
                    <IconButton onClick={seePassword}>
                      {inputPass !== 'password' ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>,
                }}
                name="password"
                label="Password"
                type={inputPass}
                id="password"
                autoComplete="current-password"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                onKeyPress={enterHandler}
                value={text.pass2}
                onChange={e => setText({ ...text, pass2: e.target.value })}
                variant="outlined"
                required
                fullWidth
                InputProps={{
                  endAdornment: <InputAdornment position="end">
                    <IconButton onClick={seePassword}>
                      {inputPass !== 'password' ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>,
                }}
                name="password"
                label="Password"
                type={inputPass}
                id="password"
                autoComplete="current-password"
              />
            </Grid>
            <Typography variant="body2" color="secondary" className={classes.typography}>{text.pass !== text.pass2 && 'Passwords do not match'}</Typography>
            <Typography variant="body2" color="secondary" className={classes.typography}>{user && 'Such user already exists'}</Typography>
            <Typography variant="body2" color="secondary" className={classes.typography}>{checkPass && 'Password must contain at least 6 characters'}</Typography>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox value="allowExtraEmails" color="primary" />}
                label="I want to receive inspiration, marketing promotions and updates via email."
              />
            </Grid>
          </Grid>
          <Button
            onClick={text.pass === text.pass2 && buttonOnckick}
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign Up
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="#" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  );
}