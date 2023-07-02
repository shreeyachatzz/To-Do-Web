import { useEffect, useState } from 'react'
import ListHeader from "./components/ListHeader"
import ListItem from "./components/ListItem"
import Auth from './components/Auth'
import { useCookies } from 'react-cookie'

const App= ()=> {
  const [cookies,setCookie,removeCookie]=useCookies(null)
  const authToken= cookies.AuthToken
  const userEmail = cookies.Email
  const [ tasks , setTasks] = useState(null)

  const getData = async() =>{  
    try{
      const response = await fetch(`http://localhost:8000/todos/${userEmail}`)
      const json= await response.json()
      setTasks(json)
    }
    catch(err){
      console.error(err)
    }
  }

  useEffect(()=> {
    if(authToken)
    {
      getData()
    }}
    , [])

  
  console.log(tasks)

  //Sort by date
  const sortedTasks = tasks?.sort((a,b)=> new Date(a.date)- new Date(b.date));

  const signOut = () => {
    console.log('signout');
    removeCookie('Email');
    removeCookie('AuthToken');
    window.location.reload();
  };

  return (
    <div className="app">
    {!authToken && <Auth/>}
      { authToken &&
        <>
        <ListHeader listName={'🐻Daily Checklist'} getData={getData} signOut={signOut}/>
        <p className='user-email'>Welcome back {userEmail}</p>
      {sortedTasks?.map((task) => <ListItem key={task.id} task={task} getData={getData}/>)}</>}
      <p className='copyright'>Created by Shreeya Chatterji</p>
    </div>
  );
}

export default App;
