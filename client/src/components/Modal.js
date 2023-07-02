import {useState} from 'react'
import { useCookies } from 'react-cookie'

const Modal= ({mode, setShowModal, getData , task})=> {
  const [cookies,setCookie,removeCookie]=useCookies(null)
  const editMode = mode === 'edit'? true: false

  //this data is sensitive to whether the edit button was selected or not
  const [data, setData]=useState({
    user_email: editMode ? task.user_email: cookies.Email,
    title:editMode ? task.title : null,
    progress:editMode ? task.progress:50,
    date: editMode ? task.date: new Date()
  })
  

  //this is where we will be trying to post data to our database
  const postData = async (e) =>{
   e.preventDefault()//This prevents default refreshing of the page
    try{
      const response= await fetch('http://localhost:8000/todos',{
        method:'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
      })    
      if(response.status === 200){
        console.log('WORKED')
        setShowModal(false)
        getData()
      }
    }catch(err){
      console.error(err)
    }
  }

  //this is where we will be trying to edit data currently in our database
  const editData = async (e) =>{
    //there was some error coming in the response.status===200 section and it was showing that getData() cant be fetched from ths section so the change/edit was not reflecting on the page unless refreshed, so fo the time being I am keeping the refreshing opion true so that the change is reflected as it automatically refreshes without having to press the refresh button.
    //if this problem is resolved we can uncomment the e.preventDefault() then the page would not be refreshed and it would look better.
    //this error was resolved as it appears that ListItem in App.js was not passing getData

    e.preventDefault()//This prevents default refreshing of the page
    try{
      const response= await fetch(`http://localhost:8000/todos/${task.id}`,{
        method:'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
      })    
      if(response.status === 200){
        console.log('EDITED')
        setShowModal(false)
        getData()
      }
    }catch(err){
      console.error(err)
    }
  }


  const handleChange = (e) =>{
    const{name,value} = e.target

    //in case we have handle change then this method below changes the values of the parameters in data(above) to whatever data it is recieving for the respective parameters onClick 
    //...data basically dumps all the info recieved into the prev value of the parameters
    setData(data =>({
      ...data,
      [name]:value
    }))

    console.log(data)//to see the changing data in the console
  }


    return (
      <div className="overlay">
      <div className="modal">
        <div className="form-title-container">
          <h3>Let's {mode} your task</h3>
          <button onClick={() => setShowModal(false)}>X</button>
        </div>

        <form>
          <input
            required
            maxLength={30}
            placeholder="Your Task"
            name="title"
            value={data.title}
            onChange={handleChange}
          />
          <br/>
          <label htmlFor="range">Drag to select your current progress</label>
          <input
            type="range"
            min="0"
            max="100"
            name="progress"
            value={data.progress}
            onChange={handleChange}
          />
          {/* onClick does not do anything is we are in edit mode, otherwise it posts the data */}
          <input className={mode} type="submit" onClick={editMode?editData:postData}/>
        </form>

      </div>
        
      </div>
    );
  }
  
  export default Modal;
  