import React from 'react';
import { Typography, Button } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import './message.scss';
import { useState, useEffect } from "react";
import Avatar from '@material-ui/core/Avatar';
import { useDispatch, useSelector, connect } from "react-redux";
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import { defaultAvatar, origUrl } from '../../App.js';
import ImageList from '@material-ui/core/ImageList';
import MenuOpenIcon from '@material-ui/icons/MenuOpen';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import { actionMyUserMessage, actionForMeMessage, actionAdMessage, actionGetRooms,bd_Url,actionGetMessages } from '../../actions';


const useStyles = makeStyles((theme) => ({
  messageList: {
    width: "50%",
    maxWidth: "70%",
    backgroundColor: '#ccd7e3',
    display: 'flex',
    flexDirection: 'column-reverse',
  },
  messageListClose: {
    width: "90%",
    backgroundColor: '#ccd7e3',
    display: 'flex',
    flexDirection: 'column-reverse',
  },
  userList: {
    width: "30%",
    marginRight: "5px",
    minWidth: "max-content",
    backgroundColor: '#ccd7e3'
  },
  userListButton: {
    minWidth: "max-content",
    backgroundColor: '#ccd7e3',
    height: '498px',
    cursor: 'pointer'
  },
  MessageInput: {
    margin: '10px'
  },
  user: {
    display: 'flex',
    height: '60px',
    backgroundColor: '#88a0b9',
    margin: '10px',
    alignItems: 'center',
    padding: '5px'
  },
  avatar: {
    marginRight: '5px'
  },
  messageCard: {
    maxWidth: '80%',
    margin: '10px 10px 0px 10px',
    width: 'max-content',
    padding: '4px',
    height: 'max-content'
  },
  myUserColor: {
    backgroundColor: "#848bd8",
    maxWidth: '80%',
    margin: '10px 10px 0px 10px',
    marginRight: '-6px',
    marginLeft: '-5px',
    width: 'max-content',
    padding: '4px',
  },
  imageList: {
    width: 'auto',
    height: '402px',
    display: 'block',
    overflowY: 'scroll'
  },
  imageListUsers: {
    width: 'auto',
    height: '502px',
    display: 'block',
    overflowY: 'scroll'
  },
  userColor: {
    backgroundColor: "#50905f",
    maxWidth: '80%',
    maxHeight: '21px',
    margin: '10px 10px 0px 10px',
    marginRight: '-6px',
    width: 'max-content',
    padding: '4px',
  },
  UserDiv: {
    display: 'flex',
  },
  myUserDiv: {
    display: 'flex',
    flexDirection: 'row-reverse',
    marginRight: '15px',
  },
  time: {
    float: "right",
    fontSize: "80%",
    marginLeft: "12px",
  }
}));

function timeConverter(UNIX_timestamp) {
  const time = new Date(UNIX_timestamp);
  const months = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
  const month = months[time.getMonth()];
  const date = time.getDate();
  const hour = time.getHours();
  const min = time.getMinutes();
  const newTime = date + '.' + month + ' ' + hour + ':' + min;
  return newTime;
}


function MyMessage({ user, message, time, ownerId }) {
  const id = useSelector(state => state.auth?.payload?.id)
  const classes = useStyles();
  return (<>
    <div className={id === ownerId ? classes.myUserDiv : classes.UserDiv}>
      <Card className={id === ownerId ? classes.myUserColor : classes.userColor}>{user} </Card>
      <Card className={classes.messageCard}>{message} </Card>
    </div>
    <div className={id === ownerId ? classes.myUserDiv : classes.UserDiv}>
      <Typography className={classes.time} gutterBottom >
        {timeConverter(+time)}
      </Typography></div></>
  )
}


const Users = ({ myOnclick, user }) => {
  const id = useSelector(state => state.auth?.payload?.id)
  let url= ''
  let name = ''
  let userId
  if(id===user.user1._id){
    url= user.user2?.avatar[0]?.url
    name = user.user2?.name
    userId = user.user2?._id
  }else{
    url= user.user1?.avatar[0]?.url
    name = user.user1?.name
    userId = user.user1?._id
  }
  const classes = useStyles();
  return (
    <CardActionArea onClick={() => myOnclick(user._id, userId)}>
      <Card className={classes.user}>
        <Avatar className={classes.avatar} src={url ? bd_Url + url : defaultAvatar} alt="Remy Sharp" />
        <p >{name} </p>
      </Card>
    </CardActionArea>
  )
}


const Spoiler = ({ open, children }) => {
  return <>
    <div>{open && children}</div>
  </>
}


const Message = ({actionGetRooms,actionGetMessages,actionAdMessage, messages, rooms}) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [time, setTime] = useState(true);
  const [send, setSend] = useState(false);
  const [message, setMessage] = useState('');
  const [iduser, setIduser] = useState("");
  const [roomId, setRoomId] = useState(false);
  const [oldroomId, setOldRoomId] = useState(false);
  const [allmessage, setAllMessage] = useState([]);

  useEffect(()=>{
    if(messages.length!==0 && !messages.message){
      setAllMessage(messages)
    }
  },[messages])

  useEffect(()=>{
    actionGetRooms()
  },[])

  const onclickSend = () => {
    if (message) {
      actionAdMessage({ text: message, to: iduser })
      setSend(!send)
      setMessage('')
    }
  }

  const enterHandler = (event) => {
    if (event.key === 'Enter') {
      if (message) {
        dispatch(actionAdMessage({ text: message, to: iduser }))
        setSend(!send)
        setMessage('')
      }
    }
  }

  useEffect(() => {
    const element = document.getElementById('list');
    element.scrollTop = element.scrollHeight;
  }, [allmessage])


  useEffect(() => {
    setTimeout(() => {
      setTime(!time);
    }, 3000)
    if(roomId){
      actionGetMessages(roomId)
    }
  }, [time])

  const onclickUser = (roomId,userId) => {
    actionGetMessages(roomId)
    setRoomId(roomId)
    setIduser(userId)
  }

  const [open, setOpen] = useState(true);

  const onclickOpen = () => {
    setOpen(!open)
  }

  return (
    <main className='mainMessage'>
      <Card onClick={onclickOpen} className={classes.userListButton} >{open ? <HighlightOffIcon /> : <MenuOpenIcon />}</Card>
      <Spoiler open={open}>
        <Card className={classes.userList}>
          <ImageList rowHeight={180} className={classes.imageListUsers}>
            {rooms.map((el) => <Users myOnclick={onclickUser} user={el} />)}
          </ImageList>
        </Card>
      </Spoiler>
      <Card className={open ? classes.messageList : classes.messageListClose}>
        <div className='divButtonText'>
          <Button onClick={onclickSend} size="small" color="primary">SEND</Button>
          <TextField
            onKeyPress={enterHandler}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className={classes.MessageInput}
            id="standard-basic"
            label="Message" />
          <ImageList id='list' rowHeight={180} className={classes.imageList}>
            {allmessage.map((el) => <MyMessage user={el.owner.username} message={el.text} ownerId={el.owner._id} time={el.createdAt} />)}
          </ImageList>
        </div>
      </Card>
    </main>
  );
}


const Messages = connect(state => ({
  rooms: state.promise?.rooms?.payload || [],
  messages: state.promise?.messages?.payload || []
}), {
  actionGetRooms: actionGetRooms,
  actionGetMessages:actionGetMessages,
  actionAdMessage:actionAdMessage
})(Message)


export default Messages