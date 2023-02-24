import { useSelector } from 'react-redux';
import React from 'react';
import '../../App.scss';
import { history, actionAuthLogout, store, defaultAvatar, origUrl } from '../../App.js';
import { connect } from 'react-redux';
import { actionOneUser,bd_Url } from '../../actions';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import { AppBar, Container, Toolbar, IconButton, Typography, Box, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import HomeIcon from '@material-ui/icons/Home';
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import BallotIcon from '@material-ui/icons/Ballot';
import EmailIcon from '@material-ui/icons/Email';
import { useEffect, useState } from "react";

const useStyles = makeStyles((theme) => ({
  menuButton: {
    position: "absolute",
    right: "-10px",
  },
  Buttons: {
    position: "absolute",
    marginTop: "-20px"
  },
  title: {
    flexGrow: 1,
    cursor: "pointer"
  },
  root: {
    display: 'flex',
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
    position: "absolute",
    right: 50,
    cursor: "pointer"

  },

}))



const Header = ({ data, myUser }) => {
  const logined = useSelector(state => state?.auth?.token);
  const id = useSelector(state => state.auth?.payload?.id)


  useEffect(() => {
    if(id){
      data(id)
    }
  }, [id])


  const classes = useStyles()
  const onclickHome = () => {
    handleClose()
    if (store.getState().auth.token) {
      history.push("/page/1")
    } else {
      history.push("/sign_in")
    }
  }
  const onclickLogout = () => {
    store.dispatch(actionAuthLogout())
    handleClose()
    history.push("/sign_in")
  }
  const onclickMyProfile = () => {
    handleClose()
    history.push("/my_profile")
  }
  const onclickAllProductsUser = () => {
    handleClose()
    history.push("/all_products_user")
  }
  const onclickCreateAd = () => {
    handleClose()
    history.push("/create_ad")
  }
  const onclickMessage = () => {
    handleClose()
    history.push("/message")
  }
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const Buttons = () => {
    if (logined) {
      return (<>
        <Avatar onClick={onclickMyProfile} alt="Remy Sharp" src={myUser.avatar && myUser.avatar.length>0 ? bd_Url + myUser.avatar[0].url : defaultAvatar} className={classes.large} />
        <div>
          <Button className={classes.Buttons} variant="outlined" color="inherit" aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
            Open Menu
          </Button>
          <Menu
            className={classes.menu}
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={onclickHome}><HomeIcon /> Home</MenuItem>
            <MenuItem onClick={onclickMessage}><EmailIcon /> Message</MenuItem>
            <MenuItem onClick={onclickMyProfile}><AccountBoxIcon /> Profile</MenuItem>
            <MenuItem onClick={onclickCreateAd}><AddCircleIcon /> Create Ad</MenuItem>
            <MenuItem onClick={onclickAllProductsUser}><BallotIcon /> My Products</MenuItem>
            <MenuItem onClick={onclickLogout}><MeetingRoomIcon /> Logout</MenuItem>
          </Menu>
        </div>
      </>)
    } else {
      return <>
        <Box mr={3}>
          <Button color="inherit" variant="outlined" onClick={() => history.push("/sign_in")}>Sign in</Button>
        </Box>
        <Button color="secondary" variant="contained" onClick={() => history.push("/sign_up")}>Sign Up</Button></>
    }
  }
  return (<>
    <AppBar position="fixed" className='myButt'>
      <Container fixed>
        <Toolbar>
          <Buttons />
          <IconButton edge='start'
            color='inherit' className={classes.menuButton} onClick={onclickHome}>
            <Typography variant='h6' className={classes.title}>OLX</Typography>
          </IconButton>
        </Toolbar>
      </Container>
    </AppBar>
  </>
  )
}


const HeaderConnect = connect(state => ({
  myUser: state.promise?.user?.payload || []
}),
  { data: actionOneUser })(Header)

export default HeaderConnect