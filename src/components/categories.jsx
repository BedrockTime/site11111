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

  const startTask_list = [
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

  const { id } = useParams()
  const catId = parseInt(id)
  let category = []
  if (cat.find(el => el.id === catId) != undefined) {
    category = cat.find(el => el.id === catId)
  }
  const [task_list, setTask_list] = useState(startTask_list)
  const catTaskList = task_list.filter(el => el.category_id === catId)
  const [sortedtasks, setSortedTasks] = useState(catTaskList)
  const [sorter, setSorter] = useState(true)
  const [adding, setAdding] = useState(false)
  const [newTitle, setNewTitle] = useState("")

  useEffect(() => {
    if (sorter === false) {
      setSortedTasks(catTaskList.filter(el => el.total_tasks === el.done_tasks))
    } else {
      setSortedTasks(catTaskList)
    }
  }, [sorter, task_list])

  const Update = () => {
    const newId =  task_list.length > 0 ?  task_list[task_list.length - 1].id + 1 : 1
    const newItem = {id: newId, title: newTitle, category_id: catId, total_tasks: 0, done_tasks: 0}
    setTask_list([...task_list, newItem])
    setAdding(false)
    setNewTitle("")
  }

  const Delete = (elemId) => {
    setTask_list(task_list.filter(el => el.id != elemId))
  }

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