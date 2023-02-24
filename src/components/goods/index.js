import { useState, useEffect } from 'react';
import { Typography, Button } from '@material-ui/core';
import React from 'react';
import { useParams } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import '../../App.scss';
import './goods.scss';
import { origUrl } from '../../App.js';
import SearchIcon from '@material-ui/icons/Search';
import CardActionArea from '@material-ui/core/CardActionArea';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import { IconButton } from '@material-ui/core';
import { history } from '../../App.js';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import {connect } from 'react-redux';
import { actionList, actionlistCount, actionListSearch, actionSearchCount,bd_Url } from '../../actions';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    marginTop: '55px',
    marginBottom: '0px',
    width: '70%',
    marginLeft: '16%'
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  pagination: {
    display: 'flex',
    justifyContent: 'space-around',
    margin: '40px'
  }
}));

const defaultImg = "https://www.lionstroy.ru/published/publicdata/U70619SHOP/attachments/SC/products_pictures/nophoto.png"

const GoodCard = ({ good, page }) => {
  const [indexArr, setindexArr] = useState(0)
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

  const useStylesImg = makeStyles({
    root: {
      margin: '14px'
    },
    media: {
      height: 280,
    },
    mediaButton: {
      justifyContent: 'center'
    },
    time: {
      margin: "5px",
      float: "right"
    },
    card: {
      textAlign: "center"
    }
  })
  const onClickGood = () => {
    history.push(page + "/good/" + good._id)
  }
  return (
    <div className="product-wrapper">
      <Card className={useStylesImg().root}>
        <CardActionArea className={useStylesImg().card}>
          <CardMedia
            className={useStylesImg().media}
            onClick={() => indexArr === good.images.length - 1 ? setindexArr(0) : setindexArr(indexArr + 1)}
            image={good.images && good.images[indexArr] ? bd_Url + good.images[indexArr].url : defaultImg}
            title="Contemplative Reptile" />
          <CardContent onClick={onClickGood}>
            <Typography gutterBottom variant="h5" component="h2">
              {good.title ? good.title : ""}
            </Typography>
            <Typography gutterBottom variant="h6" component="h3">
              {"Цена: " + (good.price ? good.price : 0) + " грн"}
            </Typography>
            <Typography className={useStylesImg().time} gutterBottom component="h5">
              {timeConverter(+good.createdAt)}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </div>
  )
}


// const ButtonAllList = ({allList,goodsArr,searchList})=>{
//   if(JSON.stringify(goodsArr)===JSON.stringify(searchList)||goodsArr.length===0){
//     return(<Button variant="outlined" onClick={allList}>all goods</Button>)
//   }
// }


const Cards = ({ actionList, actionlistCount, actionListSearch, actionSearchCount, status, count, list }) => {
  const [search, setSearch] = useState('');
  const [goodsArr, setGoodsArr] = useState([]);
  const { _id } = useParams()
  const [page, setPage] = useState(1);
  const [buttonAllList, setButtonAllList] = useState(false);

 
  const limit = 15

  const handleChange = (event, value) => {
    let skip = value * limit - limit
    history.push("/page/" + value)
    setPage(value);
    buttonAllList ? actionListSearch(search, skip, limit) : actionList(skip, limit)
  };


  useEffect(() => {
    let skip = _id * limit - limit
    actionlistCount()
    actionList(skip, limit)
    setPage(+_id)
  }, [])

  useEffect(() => {
    setGoodsArr(list)
  }, [list])

  const onclickSearch = () => {
    if (search) {
       setButtonAllList(true)
       actionListSearch(search)
       actionSearchCount(search)
    }
  }

  const onClickAllList = () => {
    actionList()
    actionlistCount()
    setButtonAllList(false)
    setSearch('')
  }

  const enterHandler = (event) => {
    if (event.key === 'Enter') {
      onclickSearch()
    }
  }

  const classes = useStyles()

  if (status === 'PENDING') {
    return (
      <img className='preloader' src='https://i.pinimg.com/originals/c8/a1/76/c8a1765ffc8243f3a7b176c0ca84c3c1.gif' />
    )
  }
  return (<>
    <main className="mainGoodsList">
      <Paper component="form" className={classes.root}>
        <IconButton
          onClick={onclickSearch}
          className={classes.iconButton}
          aria-label="search">
          <SearchIcon />
        </IconButton>
        <InputBase
          onKeyPress={enterHandler}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={classes.input}
          placeholder="Search" />
        {buttonAllList && <Button variant="outlined" onClick={onClickAllList}>all goods</Button>}
      </Paper>
      <Stack spacing={2}>
        <Pagination
          className={classes.pagination}
          color="primary"
          variant="outlined"
          count={Math.ceil(count / limit)}
          page={page}
          onChange={handleChange} />
      </Stack>
      <div className='cards'>
        {goodsArr.map(el => <GoodCard key={el._id} page={_id} good={el} />)}
      </div>
      <Stack spacing={2}>
        <Pagination
          className={classes.pagination}
          color="primary"
          variant="outlined"
          count={Math.ceil(count / limit)}
          page={page}
          onChange={handleChange} />
      </Stack>
    </main></>)
}


const MainList = connect(state => ({
  status: state.promise?.list?.status || [],
  list: state.promise?.list?.payload || [],
  count: state.promise?.listCount?.payload || [],
}),
  {
    actionList: actionList,
    actionlistCount: actionlistCount,
    actionListSearch: actionListSearch,
    actionSearchCount: actionSearchCount
  })(Cards)

export default MainList
