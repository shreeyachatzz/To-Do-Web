import { useState, useEffect } from 'react'
import TickIcon from './TickIcon'
import Modal from './Modal'
import ProgressBar from './ProgressBar'

const ListItem= ({task, getData}) => {

  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden'; // Disable scroll
    } else {
      document.body.style.overflow = ''; // Enable scroll
    }

    return () => {
      document.body.style.overflow = ''; // Re-enable scroll when component unmounts
    };
  }, [showModal]);


  const deleteItem = async()=>{
    try{
      const response= await fetch( `http://localhost:8000/todos/${task.id}`,{
        method:'DELETE',
      })
      if(response.status===200)
      {
        getData()
      }
    }catch(err){
      console.error(err)
    }

  }

    return (
      <li className="list-item">
        <div className='info-container'>
          <TickIcon />
          <p className='task-title'>{task.title}</p>
          <ProgressBar progress={task.progress}/>
        </div>

        <div className='button-contianer'>
          <button className='edit' onClick={()=>setShowModal(true)}>EDIT</button>
          <button className='delete' onClick={deleteItem}>DELETE</button>
        </div>
        {showModal && <Modal mode={'edit'} setShowModal={setShowModal} getData={getData} task={task}/>}
      </li>
    );
  }
  
  export default ListItem;
  