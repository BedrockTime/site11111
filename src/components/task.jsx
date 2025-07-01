import '../App.css'
import { NavLink, useParams } from "react-router"
import styled from 'styled-components';
import { useState } from 'react';
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
  const cat = [
    {
      "id": 1,
      "name": "Учёба",
      "icon_id": "src/components/icons/home.png"
    },
    {
      "id": 2,
      "name": "Еда",
      "icon_id": "src/components/icons/shopping_cart.png"
    }
  ]

    const task_lists = [
    {
      "id": 1,
      "title": "Подготовка к экзамену",
      "category_id": 1,
      "total_tasks": 5,
      "done_tasks": 3
    },
    {
      "id": 2,
      "title": "gasdwad",
      "category_id": 1,
      "total_tasks": 5,
      "done_tasks": 3
    },
    {
      "id": 3,
      "title": "gasdwadaaaaa",
      "category_id": 1,
      "total_tasks": 5,
      "done_tasks": 5
    },
    {
      "id": 4,
      "title": "gaaaasdwadaaaaa",
      "category_id": 2,
      "total_tasks": 3,
      "done_tasks": 5
    }
  ]

  const startTasks_list = [
    {
        "id": 1,
        "title": "fasadw",
        "done": true,
        "task_list_id": 1
    },
    {
        "id": 2,
        "title": "saawdwdw",
        "done": false,
        "task_list_id": 1
    },
    {
        "id": 3,
        "title": "ffffff",
        "done": false,
        "task_list_id": 1,
    },
    {
        "id": 4,
        "title": "ffffffadwadawd",
        "done": false,
        "task_list_id": 2,
    }
  ]

  const { id } = useParams()
  const listId = parseInt(id)
  const [tasks_list, setTasks_list] = useState(startTasks_list)
  let task_list = []
  if (task_lists.find(el => el.id === listId) != undefined) {
    task_list = task_lists.find(el => el.id === listId)
  }
  const catId = task_list.category_id
  let category = []
  if (cat.find(el => el.id === catId) != undefined) {
    category = cat.find(el => el.id === catId)
  }
  const listTasks= tasks_list.filter(el => el.task_list_id === listId)
  const [adding, setAdding] = useState(false)
  const [newTitle, setNewTitle] = useState("")

  const Update = () => {
    const newId = tasks_list.length > 0 ? tasks_list[tasks_list.length - 1].id + 1 : 1
    const newItem = {id: newId, title: newTitle, done: false, task_list_id: listId}
    setTasks_list([...tasks_list, newItem])
    setAdding(false)
    setNewTitle("")
  }

  const Delete = (elemId) => {
    setTasks_list(tasks_list.filter(el => el.id != elemId))
  }

  return(
    <div className="backgr">
      <NavLink to={`/categories/${task_list.category_id}`} end className="link">🡠  Go Back</NavLink>
      <div>
        <h1 className='title'>{task_list.title}</h1>
        <p className='date'>{category.name} ⟶ {task_list.title}</p>
        <div className='osn'>
          {listTasks.map((el) => {
              return(
                <Container key={el.id}>
                  <div className='checkbox'>
                      <input type='checkbox' className='incheck' defaultChecked={el.done}/>
                      <p className='none'>{el.title}</p>
                  </div>
                  <p className='delete' onClick={() => {Delete(el.id)}}>×</p>
                </Container>
              )})}
            {adding ? (
              <Container>
                <input type="text" placeholder="Название" className='inputTitleTask' onChange={(el) => {setNewTitle(el.target.value)}} />
                {(newTitle != "") ? (
                  <p className='savetask' onClick={() => {Update()}}>✓</p>
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