import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import SaveIcon from '@material-ui/icons/Save';
import { makeStyles } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import './myprofile.scss';
import { useState, useEffect } from "react";
import { useDispatch, useSelector, connect } from "react-redux";
import { origUrl, defaultAvatar } from '../../App.js';
import { useParams } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { actionOneUser, actionUpload, actionUpdateMe ,bd_Url} from '../../actions';


function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}
const useStylesAlert = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));


const useStyles = makeStyles((theme) => ({
  root: {
    height: '50vh',
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },

  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

function MyProfile({ loadData, action, myUser = [], newImg, status }) {
  const id = useSelector(state => state.auth?.payload?.id)
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone();
  const [profile, setProfile] = useState({ avatar: [], username: '', nick: '', addresses: '', phones: '' });
  const classAlert = useStylesAlert();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    acceptedFiles.map(file => action(file));
  }, [acceptedFiles]);
  console.log(profile)
  useEffect(() => {
    console.log(newImg)
    setProfile({ ...profile, avatar: [newImg] })
  }, [newImg])

  useEffect(() => {
    loadData(id)
  }, [id])
  const dispatch = useDispatch();

  useEffect(() => {
    if(myUser && typeof myUser.length==='undefined'){
      setProfile({ avatar: myUser.avatar, username: myUser.username, nick: myUser.nick, addresses: myUser.addresses, phones: myUser.phones })
    }
  }, [myUser])


  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };
  const onClickChange = () => {
    dispatch(actionUpdateMe({ ...profile, _id: id, avatar: { _id: profile.avatar[0]._id, url: profile.avatar[0].url } }))
    loadData(id)
    setOpen(true)
  }

  const enterHandler = (event) => {
    if (event.key === 'Enter') {
      onClickChange()
    }
  }


  const classes = useStyles();
  if (status === 'PENDING') {
    return (
      <img className='preloader' src='https://i.pinimg.com/originals/c8/a1/76/c8a1765ffc8243f3a7b176c0ca84c3c1.gif' />
    )
  }
  return (
    <main className="main1">
      <div className="banner-wrap" >
        <div className="conteiner">
          <div className="flex__box" onKeyPress={enterHandler}>
            <div className="conteiner__images">
              <div className="photo">
                <img className="imgDnd" src={profile.avatar[0] ? bd_Url + profile.avatar[0].url : defaultAvatar} alt="" />
                <div {...getRootProps({ className: 'dropzon' })}>
                  <input {...getInputProps()} />
                  <p>Drag 'n' drop some files here, or click to select files</p>
                </div>
              </div>
            </div>
            <div className="banner">
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="Login"
                label="Login"
                name="Login"
                autoComplete="Login"
                autoFocus
                value={profile.username}
                onChange={(e) => setProfile({ ...profile, username: e.target.value })}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="Name"
                label="Name"
                name="Name"
                autoComplete="Name"
                autoFocus
                value={profile.nick}
                onChange={(e) => setProfile({ ...profile, nick: e.target.value })}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="Number phone"
                label="Number phone"
                name="Number phone"
                autoComplete="Number phone"
                autoFocus
                value={profile.phones}
                onChange={(e) => setProfile({ ...profile, phones: e.target.value })}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="City"
                label="City"
                name="City"
                autoComplete="City"
                autoFocus
                value={profile.addresses}
                onChange={(e) => setProfile({ ...profile, addresses: e.target.value })}
              />
              <Button
                onClick={onClickChange}
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                startIcon={<SaveIcon />}
              >
                Сhange profile
              </Button>
              <div className={classAlert.root}>
                <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                  <Alert onClose={handleClose} severity="success">
                    Profile changed successfully!
                  </Alert>
                </Snackbar>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

const Profile = connect(state => ({
  myUser: state.promise?.user?.payload || [],
  status: state.promise?.user?.status || [],
  newImg: state.promise?.upload?.payload || []
}),
  {
    loadData: actionOneUser,
    action: actionUpload
  })(MyProfile)


export default Profile