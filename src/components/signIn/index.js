import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import { Button } from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { useState } from 'react';
import { store, actionAuthLogin, history } from '../../App.js';
import VisibilityIcon from '@material-ui/icons/Visibility';
import InputAdornment from '@mui/material/InputAdornment';
import { IconButton } from '@material-ui/core';
import { actionLogin } from '../../actions';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';

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
    marginTop: theme.spacing(12),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));




function SignIn() {
  const classes = useStyles();
  const [text, setText] = useState({ login: '', pass: '' })
  const [inputPass, setInputPass] = useState('password')
  const [jwtToken, setJwtToken] = useState(false)

  async function buttonOnckick() {
    const token = await store.dispatch(actionLogin(text.login, text.pass))
    console.log(token)
    if (token) {
      store.dispatch(actionAuthLogin(token.token));
      setJwtToken(false)
      history.push("/page/1")
    }else{
      setJwtToken(true)
    }
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
    <Container component="main" maxWidth="xs" >
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form className={classes.form} noValidate>
          <TextField
            onKeyPress={enterHandler}
            value={text.login}
            onChange={e => setText({ ...text, login: e.target.value })}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            onKeyPress={enterHandler}
            value={text.pass}
            onChange={e => setText({ ...text, pass: e.target.value })}
            variant="outlined"
            margin="normal"
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
          <Typography variant="body2" color="secondary" >{jwtToken && 'Please enter a valid Email and/or password.'}</Typography>
          <Button
            onClick={buttonOnckick}
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="#" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}



export default SignIn