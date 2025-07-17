import { useState, useEffect } from 'react';
import '../App.css'
import { NavLink, useParams } from "react-router";
import styled from 'styled-components';
import addCircle from './icons/add_circle.png';

  const Sorter = styled.div`
    width: fit-content;
    padding: 5px 20px 5px 20px;
    margin-right: 20px;
    height: 30px;
    border-radius: 10px;
    background-color: ${props => props.sort ? '#eeb95c' : 'white'};
    color: ${props => props.sort ? '#e97d30' : 'lightgrey'};
    display: flex;
    justify-content: center; 
    align-items: center; 
    cursor: pointer;
  `

  const Container = styled.div`
    width: 365px;
    height: ${props => props.construct ? '176px' : '216px'};
    border-radius: 10px;
    box-shadow: 1.5px 1.5px 5px rgba(172, 164, 164, 0.477);
    display: flex;
    align-items: ${props => props.construct ? 'center' : 'flex-start'};
    flex-direction: column;
    padding: ${props => props.construct ? '60px 20px 20px 20px' : '20px 20px 20px 20px'};
    margin: 10px 10px 10px 10px;
    background-color: ${props => props.construct ? '#e97d30' : 'white'};
    cursor: ${props => props.construct ? 'pointer' : 'default'};
  `

  const Line = styled.div`
    width: 100%;
    background-color: #b7b7b7;
    height: 2px;
    opacity: 50%;
    margin-bottom: 20px;
    margin-top: ${props => props.construct ? '28px' : '0px'};
  `

const Categories = () => {
  const { id } = useParams()
  const [cat, setCat] = useState([])
  const catId = parseInt(id)
  let category = []
  if (cat.find(el => el.id === catId) != undefined) {
    category = cat.find(el => el.id === catId)
  }
  const [catTaskList, setCatTaskList] = useState([])
  const [sortedtasks, setSortedTasks] = useState(catTaskList)
  const [sorter, setSorter] = useState(true)
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
      setCat(data)
    } catch (error) {
      console.error('Ошибка при обращении к серверу:', error)
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
      return data
    } catch (error) {
      console.error('Ошибка при обращении к серверу:', error)
      return {}
    }
  }

  const getTaskList = async () => {
    try {
      const response = await fetch(`http://localhost:3000/task-lists?category_id=${catId}`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      })
      if (!response.ok) {
        throw new Error(`Ошибка при получении списков задач: ${response.status}`)
      }
      let data = await response.json()
      const taskListPromise = data.map(async (el) => {
        try {
          const update = await getTaskListById(el.id)
          return {...el, tasks: update.tasks}
        } catch(error) {
          console.error(`Ошибка обработки списка задач с ID ${el.id}:`, error);
          return { ...el, tasks: [] }
        }})
      data = await Promise.all(taskListPromise)
      setCatTaskList(data)
    } catch (error) {
      console.error('Ошибка при обращении к серверу:', error)
    }
  }

  const addNewTaskList = async (name, id) => {
    try {
      const response = await fetch('http://localhost:3000/task-lists', {
        method: 'POST',
        headers: { 
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        'Content-Type': 'application/json',
        },
        body: JSON.stringify( {title: name, category_id: id} ),
      })

      const responseData = await response.json()

      if (!response.ok) {
        throw new Error("Ошибка добавления списка задач:", responseData.message)
      } else {
        const pattern = {done_tasks: 0, total_tasks: 0, tasks: []}
        Object.assign(responseData, pattern)
        setCatTaskList([...catTaskList, responseData])
      }
    } catch (error) {
      console.error('Ошибка при обращении к серверу:', error)
    }
  }

  const Delete = async (elId) => {
    try{
      const response = await fetch(`http://localhost:3000/task-lists/${elId}`, {
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
        setCatTaskList(catTaskList.filter(el => el.id != elId))
      }
    } catch (error) {
      console.error('Ошибка при обращении к серверу:', error)
    }
  }


  const Update = () => {
    addNewTaskList(newTitle, catId)
    setAdding(false)
    setNewTitle("")
  }


  useEffect(() => {
    if (sorter === false) {
      setSortedTasks(catTaskList.filter(el => el.total_tasks === el.done_tasks))
    } else {
      setSortedTasks(catTaskList)
      console.log(catTaskList)
    }
  }, [sorter, catTaskList])

  useEffect(() => {
    getCat()
    getTaskList()
  }, [])


  return(
    <div className="backgr">
      <NavLink to="/" end className="link">🡠  Go Back</NavLink>
      <div>
        <h1 className='title'>{category.name}</h1>
        <div className='sorter'>
          <Sorter sort={sorter} onClick={() => {setSorter(!sorter)}}>
            <p>Все</p>
          </Sorter>
          <Sorter sort={!sorter} onClick={() => {setSorter(!sorter)}}>
            <p>Выполненные</p>
          </Sorter>
        </div>
        <div className='container'>
          {sortedtasks.map((el) => {
            return(
              <Container key={el.id}>
                <div className='df'>
                  <h1 className='h1_categ'>{el.title}</h1>
                  <p className='delete' onClick={() => Delete(el.id)}>×</p>
                </div>
                <div className='df'>
                  <div/>
                  <p className='donetasks'>{el.done_tasks}/{el.total_tasks} Выполнено</p>
                </div>
                <Line/>
                <div>
                  <div className='checkbox'>
                    <input type='checkbox' className='incheck' />
                    <p className='cat_tasks'>Задача 1aaaaaaaaa</p>
                  </div>
                  <div className='checkbox'>
                    <input type='checkbox' className='incheck' />
                    <p className='cat_tasks'>Задача 2aaaaaaaaa</p>
                  </div>
                  <div className='checkbox'>
                    <input type='checkbox' className='incheck' />
                    <p className='cat_tasks'>Задача 3aaaaaaaaa</p>
                  </div>
                </div>
                <div className='df'>
                  <div />
                  <NavLink to={`/categories/${el.category_id}/task/${el.id}`} end className="link">Перейти</NavLink>
                </div>
              </Container>
            )
          })}
          {adding ? (
              <Container>
                <div className='df'>
                  <input type="text" placeholder="Название" className='inputTitleList' onChange={(el) => {setNewTitle(el.target.value)}} />
                </div>
                <Line construct/>
                {(newTitle != "") ? (
                  <div className='df'>
                    <div />
                    <p className='savebuttonLists' onClick={() => {Update()}}>Сохранить</p>
                  </div>
                ) : (
                  <div/>
                )}
              </Container>
          ) : (
            sorter ? (
              <Container construct onClick={() => {setAdding(true)}}>
                  <img src={addCircle} alt='painu vittuun!' />
                  <h1 construct>Добавить Лист</h1>
              </Container>
            ) : (
              <div />
            )
          )}
        </div>
      </div>
    </div>
  )
}

export default Categories