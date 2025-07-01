import './App.css'
import { NavLink} from "react-router";
import styled from 'styled-components';
import { useState } from 'react';

  const Container = styled.div`
    width: 365px;
    height: 240px;;
    border-radius: 10px;
    box-shadow: 1.5px 1.5px 5px rgba(172, 164, 164, 0.477);
    display: flex;
    align-items: center;
    flex-direction: column;
    padding: 40px 20px 20px 20px;
    margin: 10px 10px 10px 10px;
    background-color: ${props => props.construct ? '#e97d30' : 'white'};
    cursor: ${props => props.construct ? 'pointer' : 'default'};
  `

  const H1 = styled.h1`
    margin-top: 30px;
    margin-bottom: ${props => props.noStats ? '39px' : '0px'};
    font-family: Roboto-Light;
    color: ${props => props.construct ? 'white' : 'black'}
  `

const App = () => {
  const startCat = [
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

  const stats = [
    {
      "category_id": 1,
      "total_lists": 4,
      "done_lists": 2
    },
    {
      "category_id": 2,
      "total_lists": 6,
      "done_lists": 3
    }
  ]

  var date = new Date()
  const [cat, setCat] = useState(startCat)
  const [adding, setAdding] = useState(false)
  const [addPicture, setAddPicture] = useState(false)
  const [picture, setPicture] = useState("")
  const [newTitle, setNewTitle] = useState("")

  const AddNew = () => {
    setAdding(true)
  }

  const Update = () => {
    const newId = cat.length > 0 ? cat[cat.length - 1].id + 1 : 1
    const newItem = {id: newId, name: newTitle, icon_id: picture}
    setCat([...cat, newItem])
    setAdding(false)
    setPicture("")
    setNewTitle("")
  }

  return(
    <div className="backgr">
      <NavLink className="link"></NavLink>
      <div>
        <h1 className='title'>Todo List</h1>
        <p className='date'>{date.getDate()}.{date.getMonth()+1}.{date.getFullYear()}</p>
        <div className='container'>
          {cat.map((el) => {
            const catStat = stats.find(elem => elem.category_id === el.id)
            return(
              <Container key={el.id}>
                <img src={el.icon_id} alt=' painu vittuun!'/>
                {catStat ? (
                  <div className='center'>
                    <H1>{el.name}</H1>
                    <p className='stat_p'>{catStat.done_lists}/{catStat.total_lists} выполнено</p>
                  </div>
                ) : (
                  <H1 noStats>{el.name}</H1>
                )}
                <NavLink to={`/categories/${el.id}`} end className="link">Перейти</NavLink>
              </Container>
            )
          })}
          {adding ? (
            <Container>
                {addPicture ? (
                  <div className='div_st1' onClick={() => {setAddPicture(false)}}>
                    <img src='src/components/icons/home.png' alt='painu vittuun!' className='img' onClick={() => {setPicture("src/components/icons/home.png")}}/>
                    <img src='src/components/icons/shopping_cart.png' alt='painu vittuun!' className='img' onClick={() => {setPicture("src/components/icons/shopping_cart.png")}}/>
                  </div>
                ) : ((picture === "") ? (
                  <div className='img' onClick={() => {setAddPicture(true)}}>
                    <img src='src/components/icons/add_circle_o.png' alt='painu vittuun!'/>
                    <p className='img_p'>Выберите картинку</p>
                  </div>
                ) : (
                  <img src={picture} alt='painu vittuun!'/>
                ))}
                {(picture != "") ? (
                  <input type="text" placeholder="Название" className='inputTitleCat' onChange={(el) => {setNewTitle(el.target.value)}}/>
                ) : (
                  <div/>
                )}
                {(newTitle != "") ? (
                  <p className='savebutton' onClick={() => {Update()}}>Сохранить</p>
                ) : (
                  <div/>
                )}
            </Container>
          ) : (
            <Container construct onClick={() => {AddNew()}}>
              <img src="src/components/icons/add_circle.png" alt='painu vittuun!' />
              <H1 construct>Добавить категорию</H1>
            </Container>
          )}
        </div>
      </div>
    </div>
  )
}

export default App