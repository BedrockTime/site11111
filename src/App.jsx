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
  const [error, setError] = useState("")
  const [logInOpen, setLogInOpen] = useState(0)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")
  const [regSuc, setRegSuc] = useState("")
  const [token, setToken] = useState("")

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

  const handleLogin = async (email, password) => {
    try {
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Неверные учетные данные')
      }

      const data = await response.json();
      localStorage.setItem('token', data.access_token)
      setToken(data.access_token)
      setError(null)
    } catch (err) {
      setError(err.message || 'Произошла ошибка при входе')
    }
  }

  const handleRegistr = async (email, username, password) => {
    try {
      const response = await fetch('http://localhost:3000/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, username, password }),
      })

      const responseData = await response.json()
      if (!response.ok) {
        setError(responseData)
        throw new Error(responseData.message || 'Ошибка регистрации')
      } else {
        setRegSuc(responseData.message)
        setError("")
        setLogInOpen(2)
      }
    } catch (err) {
      setError(err.message || 'Произошла ошибка при регистрации')
  }}

  const manualLogOut = () =>{
    setUsername("")
    setPassword("")
    setEmail("")
    setLogInOpen("")
    setError("")
    setRegSuc("")
    localStorage.removeItem('token')
    setToken("")
  }

  const backButton = () => {
    setLogInOpen(0)
    setError("")
    setEmail("")
    setUsername("")
    setPassword("")
  }

  return(
    <div className="backgr">
      {!localStorage.getItem('token') ? (
        <div className='logIn'>
          <div className='window'>
            {(logInOpen === 1) ? (
              <div className='center'>
                <h1 className='h1_login_osn'>Регистрация</h1>
                <input type="email" placeholder="Почта" className='inputlogin' onChange={(el) => {setEmail(el.target.value)}}/>
                <input type="text" placeholder="Имя пользователя" className='inputlogin' onChange={(el) => {setUsername(el.target.value)}}/>
                <input type="password" placeholder="Пароль" className='inputlogin' onChange={(el) => {setPassword(el.target.value)}}/>
                {(email != "" & password != "" & username != "") ? (
                  <button className='login_button' onClick={() => {handleRegistr(email, username, password)}}>Зарегистрироваться</button>
                ) : (
                  <div />
                )}
                {(error === "") ? (
                  <div />
                ) : (
                  <p>{error}</p>
                )}
                <p className='back_button' onClick={() => {backButton()}}>Назад</p>
              </div>   
            ) : ((logInOpen === 2) ? (
              <div className='center'>
                {(regSuc != "") ? (
                  <p>{regSuc}</p>
                ) : (
                  <div />
                )}
                <h1 className='h1_login_osn'>Вход</h1>
                <input type="email" placeholder="Почта" className='inputlogin' onChange={(el) => {setEmail(el.target.value)}}/>
                <input type="password" placeholder="Пароль" className='inputlogin' onChange={(el) => {setPassword(el.target.value)}}/>
                {(email != "" & password != "") ? (
                  <button className='login_button' onClick={() => {handleLogin(email, password)}}>Войти</button>
                ) : (
                  <div />
                )}
                {(error === "") ? (
                  <div />
                ) : (
                  <p>{error}</p>
                )}
                <p className='back_button' onClick={() => {backButton()}}>Назад</p>
              </div>
            ) : (
              <div>
                <h1 className='h1_login'>Вы не вошли в аккаунт</h1>
                <div className='login_button_div'>
                  <button className='login_button' onClick={() => {setLogInOpen(1)}}>Регистрация</button>
                  <button className='login_button' onClick={() => {setLogInOpen(2)}}>Вход</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
        <NavLink className="link" />
        <div>
          <div className='logout'>
            <h1 className='title'>Todo List</h1>
            <p className='back_button' onClick={() => {manualLogOut()}}>Выйти из аккаунта</p>
          </div>
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
      </>
      )}
  </div>
  )
}

export default App