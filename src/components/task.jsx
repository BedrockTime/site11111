import '../App.css'
import { NavLink, useParams } from "react-router"
import styled from 'styled-components';
import { useState, useEffect } from 'react';
import addCircle from './icons/add_circle_20.png';

  const Container = styled.div`
    width: 820px;
    height: 50px;;
    border-radius: 10px;
    box-shadow: 1.5px 1.5px 5px rgba(172, 164, 164, 0.477);
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0px 20px 0px 20px;
    justify-content: space-between;
    background-color: ${props => props.construct ? '#e97d30' : 'white'};
    margin: 10px 0px 10px;
    cursor: ${props => props.construct ? 'pointer' : 'default'};
  `

const Task = () => {
  const { id } = useParams()
  const listId = parseInt(id)
  const [taskList, setTaskList] = useState({})
  const [category, setCategory] = useState({})
  const [tasks, setTasks] = useState([])
  const [adding, setAdding] = useState(false)
  const [newTitle, setNewTitle] = useState("")


  const getCat = async () => {
    try {
      const response = await fetch('http://localhost:3000/categories', {
        method: 'GET',
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      })

      if (!response.ok) {
        throw new Error(`Ошибка при получении категорий: ${response.status}`)
      }

      const data = await response.json()
      return data

    } catch (error) {
      console.error('Ошибка при обращении к серверу:', error)
      return []
    }
  }

  const getTaskListById = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/task-lists/${id}`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      })

      if (!response.ok) {
        throw new Error(`Ошибка при получении списка задач: ${response.status}`)
      }

      const data = await response.json()
      setTaskList(data)
      return data

    } catch (error) {
      console.error('Ошибка при обращении к серверу:', error)
      return {}
    }
  }

  const addNewTask = async (name, id) => {
    try {
      const response = await fetch('http://localhost:3000/tasks', {
        method: 'POST',
        headers: { 
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        'Content-Type': 'application/json',
        },
        body: JSON.stringify( {text: name, done: false , task_list_id: id} ),
      })

      const responseData = await response.json()

      if (!response.ok) {
        throw new Error("Ошибка добавления задачи:", responseData.message)
      } else {
        setTasks([...tasks, responseData])
      }

    } catch (error) {
      console.error('Ошибка при обращении к серверу:', error)

    } finally {
      setAdding(false)
      setNewTitle("")
    }
  }

  const updateTask = async (id, name, done) => {
    try {
      const response = await fetch(`http://localhost:3000/tasks/${id}`, {
        method: 'PUT',
        headers: { 
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        'Content-Type': 'application/json',
        }, 
        body: JSON.stringify( {text: name, done: done} ),
      })

      const responseData = await response.json()

      if (!response.ok) {
        throw new Error("Ошибка изменения задачи:", responseData.message)
      } else {
        setTasks(tasks.map((el) => {
          if (el.id === id) {
            return {...el, text: responseData.text, done: responseData.done}
           } else {
            return el
           }
        }))
      }

    } catch (error) {
      console.error('Ошибка при обращении к серверу:', error)
    }
  }

  const Delete = async (elId) => {
    try{
      const response = await fetch(`http://localhost:3000/tasks/${elId}`, {
        method: 'DELETE',
        headers: { 
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      const responseData = await response.json()

      if (!response.ok) {
        throw new Error("Ошибка удаления списка задач:", responseData.message)
      } else {
        console.log(responseData.message)
        setTasks(tasks.filter(el => el.id != elId))
      }

    } catch (error) {
      console.error('Ошибка при обращении к серверу:', error)
    }
  }


  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categ, taskListInf] = await Promise.all([getCat(), getTaskListById(listId)])
        setCategory(categ.find(el => el.id === taskListInf.category_id))
        setTasks(taskListInf.tasks)

      } catch (error) {
        console.error('Ошибка при загрузке данных:', error)
    }}

    fetchData()
  }, [])


  return(
    <div className="backgr">
      <NavLink to={`/categories/${taskList.category_id}`} end className="link">🡠  Go Back</NavLink>
      <div>
        <h1 className='title'>{taskList.title}</h1>
        <p className='date'>{category.name} ⟶ {taskList.title}</p>
        <div className='osn'>
          {tasks.map((el) => {
              return(
                <Container key={el.id}>
                  <div className='checkbox'>
                      <input type='checkbox' className='incheck' defaultChecked={el.done} onChange={() => {updateTask(el.id, el.text, !el.done)}}/>
                      <p className='none'>{el.text}</p>
                  </div>
                  <p className='delete' onClick={() => {Delete(el.id)}}>×</p>
                </Container>
              )})}
            {adding ? (
              <Container>
                <input type="text" placeholder="Название" className='inputTitleTask' onChange={(el) => {setNewTitle(el.target.value)}} />
                {(newTitle != "") ? (
                  <p className='savetask' onClick={() => {addNewTask(newTitle, taskList.id)}}>✓</p>
                ) : (
                  <div/>
                )}
              </Container>
          ) : (
            <Container construct onClick={() => {setAdding(true)}}>
              <div className='checkbox'>
                <img src={addCircle} alt='painu vittuun!' className='addCircle20'/>
                <p construct>Добавить Задачу</p>
              </div>
              <div/>
            </Container>
          )}
        </div>
      </div>
    </div>
  )
}

export default Task