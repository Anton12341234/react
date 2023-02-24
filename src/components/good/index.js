import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Typography, Button } from '@material-ui/core';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import '../../App.scss';
import './good.scss';
import TextField from '@material-ui/core/TextField';
import { origUrl, defaultAvatar } from '../../App.js';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { connect } from 'react-redux';
import { actionOneUser, actionOnelist, actionAdComment, actionAdMessage,bd_Url } from '../../actions';

const useStyles = makeStyles({
  root: {
    marginTop: 50,
    margin: "auto",
    textAlign: "-webkit-center"
  },
  comment: {
    width: "75%",
    marginBottom: '4px'
  },
  media: {
    height: '100%',
  },
  alert: {
    left: '75%'
  },
  time: {
    margin: "5px",
    float: "right"
  },
  actionArea: {
    width: "100%"
  }
})

const useStylesAlert = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const defaultImg = "https://www.lionstroy.ru/published/publicdata/U70619SHOP/attachments/SC/products_pictures/nophoto.png"


function timeConverter(UNIX_timestamp) {
  const time = new Date(UNIX_timestamp);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = months[time.getMonth()];
  const date = time.getDate();
  const hour = time.getHours();
  const min = time.getMinutes();
  const newTime = date + ' ' + month + ' ' + hour + ':' + min;
  return newTime;
}


function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const Commets = ({ good }) => {
  const classes = useStyles()
  return (<>
    {good.comments.map(el =>
      <div className='commentCard'>
        <Card >
          <Typography className={classes.time} gutterBottom component="h5">
            {timeConverter(+el.createdAt)}
          </Typography>
          <CardContent className='commentAvatar'>
            <Avatar alt="Remy Sharp" src={el.owner.avatar && el.owner.avatar.length>0 ? bd_Url + el.owner.avatar[0].url : defaultAvatar} />
            <p className="avatarName">
              {el.owner.username}
            </p>
          </CardContent>
          <div className='comment'>
            {el.text && el.text}
          </div>
        </Card>
      </div>)}</>
  )
}

const Good = ({ loadData,data, good, myUser, status, statusMessage, admessage }) => {
  const { _id, page } = useParams()
  const dispatch = useDispatch();
  const id = useSelector(state => state.auth?.payload?.sub?.id)
  const [comment, setComment] = useState('');
  const [message, setMessage] = useState('');
  const [send, setSend] = useState(false);
  const [open, setOpen] = useState(false);
  const [messageId, setMessageId] = useState(admessage._id);
  const [statusAlert, setStatusAlert] = useState('success');
  useEffect(() => {
    loadData(_id)
  }, [send])

  useEffect(() => {
    data(id)
  }, [])

  const [indexArr, setindexArr] = useState(0)


  const onclickSend = () => {
    dispatch(actionAdComment({ text: comment, ad: { _id } }))
    setSend(!send)
    setComment('')
  }
  const onclickMessage = () => {
    dispatch(actionAdMessage({ text: message, to: good.owner._id }))
    setMessage('')
  }
  const closeAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };


  const classes = useStyles()
  const classAlert = useStylesAlert()

  useEffect(() => {
    if (messageId !== admessage._id) {
      if (statusMessage === 'FULFILLED') {
        setStatusAlert('success')
        setOpen(true);
        setMessageId(admessage._id)
      }
      if (statusMessage === 'REJECTED') {
        setStatusAlert('error')
        setOpen(true);
        setMessageId(admessage._id)
      }
    }
  }, [statusMessage])

  if (status === 'PENDING') {
    return (
      <img className='preloader' src='https://i.pinimg.com/originals/c8/a1/76/c8a1765ffc8243f3a7b176c0ca84c3c1.gif' />
    )
  }

  return (<>
    <main className="mainGood">
      <div className='cardRoot'>
        <Card className={classes.root}>
          <div className='card'>
            <CardActionArea className={classes.actionArea} >
              <img className="goodImg"
                onClick={() => indexArr === good.images.length - 1 ? setindexArr(0) : setindexArr(indexArr + 1)}
                src={good.images && good.images[indexArr] ? bd_Url + good.images[indexArr].url : defaultImg} />
            </CardActionArea>
            <CardContent className='cardContent'>
              <div className='messageCardSend'>
                <CardContent className='commentAvatar'>
                  <Avatar alt="Remy Sharp" src={good?.owner?.avatar && good.owner.avatar.length>0 ? bd_Url + good.owner.avatar[0].url : defaultAvatar} />
                  <p className="avatarName">
                    {good.owner ? good.owner.username : ""}
                  </p>
                </CardContent>
                <TextField
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className={classes.comment}
                  id="outlined-multiline-static"
                  label="Message"
                  multiline
                  variant="outlined" />
                <Button size="small" color="primary" onClick={onclickMessage}>
                  SEND
                </Button>
                <Typography gutterBottom variant="h5" component="h2">
                  {good.title ? good.title : ""}
                </Typography>
                <Typography gutterBottom variant="h6" component="h3">
                  {"Цена: " + (good.price ? good.price : 0) + " грн"}
                </Typography>
              </div>
            </CardContent>
          </div>
          <div className='description'>
            <Typography variant="body2" color="textSecondary" component="p">
              {good.description ? good.description : ""}
            </Typography>
          </div>
          <Typography className={classes.time} gutterBottom component="h5">
            {timeConverter(+good.createdAt)}
          </Typography>
        </Card>
      </div>
      <Card className='commentCardSend'>
        <CardContent className='commentAvatar'>
          <Avatar alt="Remy Sharp" src={myUser.avatar && myUser.avatar.length>0 ? bd_Url + myUser.avatar[0].url : defaultAvatar} />
          <p className="avatarName">
            {myUser.username ? myUser.username : ''}
          </p>
        </CardContent>
        <TextField
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className={classes.comment}
          id="outlined-multiline-static"
          label="Comment"
          multiline
          variant="outlined" />
        <Button size="small" color="primary" onClick={onclickSend}>
          SEND
        </Button>
        <div className={classAlert.root}>
          <Snackbar className={classes.alert} open={open} autoHideDuration={3000} onClose={closeAlert}>
            <Alert onClose={closeAlert} severity={statusAlert}>
              Message sent successfully!
            </Alert>
          </Snackbar>
        </div>
      </Card>
      {good.comments && <Commets good={good} />}
    </main>
  </>
  )
}

const GoodUser = connect(state => ({
  good: state.promise?.onelist?.payload || [],
  status: state.promise?.onelist?.status || [],
  admessage: state.promise?.admessage?.payload || [],
  statusMessage: state.promise?.admessage?.status || [],
  myUser: state.promise?.user?.payload || []
}), {
  loadData: actionOnelist,
  data: actionOneUser
})(Good)


export default GoodUser