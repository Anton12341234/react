import { useState, useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import {Typography, Button } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import CreateIcon from '@material-ui/icons/Create';
import Paper from '@material-ui/core/Paper';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { origUrl, defaultImg, history } from '../../App.js';
import './productsUser.scss';
import {connect } from 'react-redux';
import { actionAllProductsUser,bd_Url,actionDeleteAd } from '../../actions';



const GoodCard = ({ good }) => {
  const [indexArr, setindexArr] = useState(0)
  const [deleteAd, setDeleteAd] = useState(true);

  const onClickGoods = () => {
    history.push("/change/" + good._id)
  }

  const onClickDelete = () => {
    setDeleteAd(false)
  }

  
  const useStylesImg = makeStyles({
    button: {
      margin: "3%"
    },
    input: {
      margin: '3px'
    },
    inputDescription: {
      margin: '3px',
      width: '90%'
    },

    root: {
      margin: "2%",
      marginTop: "15px",
      backgroundColor: '#a9a9a96b',
    },
    media: {
      width: "100%",
      height: 280,
      borderRadius: "15px",
    },
    text: {
      padding: '10px',
      margin: '5px',
      backgroundColor: '#3f51b500',
    },
    viev: {
      marginLeft: '0px'
    }
  })
  return (
    <><Card className='cardproducts'>
      <CardContent className='contentCard'>
        <CardMedia
          className={useStylesImg().media}
          onClick={() => indexArr === good.images.length - 1 ? setindexArr(0) : setindexArr(indexArr + 1)}
          image={good.images && good.images[indexArr] ? bd_Url + good.images[indexArr].url : defaultImg}
          title="Contemplative Reptile" />
      </CardContent>
      <CardContent className='content'>
        <Card className={useStylesImg().text}>
          <Typography gutterBottom variant="h5" component="h2">
            {good.title ? good.title : ""}
          </Typography>
        </Card>
        <Card className={useStylesImg().text}>
          <Typography gutterBottom variant="h6" component="h3">
            {"Цена: " + (good.price ? good.price : 0) + " грн"}
          </Typography>
        </Card>
        <Card className={useStylesImg().text}>
          <Typography gutterBottom variant="h6" component="h5">
            {good.description ? good.description : ""}
          </Typography>
        </Card>
      </CardContent>
      <CardActions className='mediaButton'>
        <Button onClick={onClickGoods} color="inherit" variant="outlined" ><CreateIcon /> Сhange </Button>
        <Button className={useStylesImg().viev} onClick={() => history.push("/good/" + good._id)} color="inherit" variant="outlined" ><VisibilityIcon /> view </Button>
        <Button onClick={onClickDelete}color="secondary" variant="contained"><DeleteIcon /> Delete </Button>
      </CardActions>
    </Card></>
  )
}

const CardsUser = ({ loadData, productsUser = [], stat }) => {
  useEffect(() => {
    loadData()
  }, [])
  const useStyles = makeStyles((theme) => ({
    root: {
      padding: '2px 4px',
      display: 'flex',
      justifyContent: 'space-around',
      marginTop: '125px',
      marginBottom: '20px',
      width: '70%',
      marginLeft: '16%',
      padding: '15px'
    },
    rootGrid: {
      flexDirection: 'column',
      minHeight: '560px',
      marginTop: '50px'
    },
    input: {
      flex: 1,
    },
    iconButton: {
      padding: 10,
    },
    div: {
      minHeight: '560px'
    }
  }));
  const classes = useStyles()
  if (stat === 'PENDING') {
    return (
      <img className='preloader' src='https://i.pinimg.com/originals/c8/a1/76/c8a1765ffc8243f3a7b176c0ca84c3c1.gif' />
    )
  } else if (stat === 'FULFILLED' && productsUser.length === 0) {
    return (<>
      <div className={classes.div}>
        <Paper component="form" className={classes.root}>
          You haven't posted any items yet
        </Paper>
      </div>
    </>
    )
  }

  return (
    <main className="mainProductsList">
      <div className='products' >
        {productsUser.reverse().map(el => <GoodCard key={el._id} good={el}  />)}
      </div>
    </main>
  )
}


const AllProductsUser = connect(state => ({
  productsUser: state.promise?.productsUser?.payload || [],
  stat: state.promise?.list?.status || []
}),
  { loadData: actionAllProductsUser })(CardsUser)


export default AllProductsUser