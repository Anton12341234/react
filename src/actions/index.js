import {actionPromise, gql,origUrl} from '../App';

const bd_Url = "http://localhost:5000/"



const actionUpload = (files) =>
	async (dispatch) => {
		const formData = new FormData();
		formData.append("Image", files);
		await dispatch(actionUploadFile(formData));
	}

const actionUploadFile = formData =>
actionPromise('upload',
  fetch(`${bd_Url}api/Image`, {
    method: "POST",
    headers: localStorage.authToken ? {Authorization: 'Bearer ' + localStorage.authToken} : {},
    body: formData
  }).then(res => res.json())
);

const actionLogin = (login, password) =>{
  const loginObj = {
    username:login,
    password:password
  }
  return ()=>actionPromise('login', gql(`${bd_Url}auth/login`,'POST',loginObj))
}

const actionRegister = (login, password, nick) =>{
  const loginObj = {
    username:login,
    password:password,
    nick:nick
  }
  return ()=>actionPromise('reg', gql(`${bd_Url}auth/registration`,'POST',loginObj))
}

const actionList = (skip = 0, limit=15)=>{
  const body = {
    skip:skip,
    limit:limit
  }
  return ()=>actionPromise('list', gql(`${bd_Url}api/all_Posts`,'POST',body))
}

const actionListSearch = (searchText = '', skip = 0, limit=15)=>{
  const body = {
    skip:skip,
    limit:limit,
    searchText:searchText
  }
  return ()=>actionPromise('list', gql(`${bd_Url}api/all_Search`,'POST',body))
}

const actionlistCount = ()=>{
  return ()=>actionPromise('listCount', gql(`${bd_Url}api/posts/count`,'GET'))
}

const actionOnelist = (_id)=>{
  return ()=>actionPromise('onelist', gql(`${bd_Url}api/posts/${_id}`,'GET'))
}

const actionUpdateMe = (user)=>{
  return ()=>actionPromise('profile', gql(`${bd_Url}auth/users`,'PUT',user))
 }

const actioCreateAd = (obj)=>{
 return ()=>actionPromise('crate', gql(`${bd_Url}api/posts`,'POST',obj))
}

const actioUpdateAd = (obj)=>{
  return ()=>actionPromise('crate', gql(`${bd_Url}api/posts`,'PUT',obj))
 }

const actionOneUser = (_id)=>{
  return ()=>actionPromise('user', gql(`${bd_Url}auth/users/${_id}`,'GET'))
}

const actionAllProductsUser = ()=>{
  return ()=>actionPromise('productsUser', gql(`${bd_Url}api/my_posts`,'GET'))
}

const actionDeleteAd = (_id)=>{
  return ()=>actionPromise('delete', gql(`${bd_Url}api/posts/${_id}`,'DELETE'))
}

const actionAdComment = (comment)=>{
  return ()=>actionPromise('adComment', gql(`${bd_Url}api/comment`,'POST',comment))
}

const actionSearchCount = (searchText = '')=>{
  const body = {
    searchText:searchText
  }
  return ()=>actionPromise('listCount', gql(`${bd_Url}api/all_Search/count`,'POST',body))
}


const actionAdMessage = (message)=>{
  return ()=>actionPromise('admessage', gql(`${bd_Url}api/message`,'POST',message))
}

const actionGetRooms = ()=>{
  return ()=>actionPromise('rooms', gql(`${bd_Url}api/message_Rooms`,'GET'))
}

const actionGetMessages = (id)=>{
  const body = {
    room_id: id
  }
  return ()=>actionPromise('messages', gql(`${bd_Url}api/message_get`,'POST',body))
}

const actionMyUserMessage = (_id) => 
actionPromise('allMeMessage', gql(`query allMeMessage($userId: String){
  MessageFind(query: $userId){
    _id
  text
  createdAt
  to{
    _id login avatar {_id url}
  }
  owner{
    _id
    login
    nick
  }
  }
}`, {userId: JSON.stringify([{___owner: _id}])}));


const actionForMeMessage = (_id) =>
actionPromise('allForMeMessage', gql(`query forMeMessage($qq: String!){
  UserFindOne(query:$qq){
   incomings{
    _id text createdAt  owner{
      _id login avatar {_id url}
    }
   }
  }
}`, {qq: JSON.stringify([{_id}])}))



export {
    actionAllProductsUser,
    actionMyUserMessage,
    actionForMeMessage,
    actionList,
    actionListSearch,
    actionSearchCount,
    actionlistCount,
    actionLogin,
    actionUpload,
    actionOneUser,
    actionAdMessage, 
    actionOnelist,
    actionAdComment, 
    actioCreateAd,
    actionRegister, 
    actionUpdateMe,
    actioUpdateAd,
    actionDeleteAd,
    actionGetRooms,
    actionGetMessages,
    bd_Url
  } 