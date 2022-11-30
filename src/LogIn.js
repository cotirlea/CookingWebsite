import React,{useState,useEffect} from 'react'
import {db} from "./firebase"
import { collection, getDocs, addDoc } from 'firebase/firestore/lite';
import { useNavigate } from "react-router-dom";
import './LogIn.css'


function LogIn() {

  const navigate = useNavigate();

  const [list,setList] = useState([]);
  const [{username},setUsername] = useState({username:''});
  const [{password},setPassword] = useState({password:''});
  const [{confirm},setConfirm] = useState({confirm:''})
  const [{signIn},setSignIn] = useState({signIn:false})
  const [{login},setLogIn] = useState({login:true})

  const [username_input,setUsername_input] = useState('')
  const [password_input,setPassword_input] = useState('')
  const [confirm_input,setConfirm_input] = useState('')


  const handleUsername = e =>{setUsername({username:e.target.value})}
  const handlePassword = e =>{setPassword({password:e.target.value})}
  const handleConfirm = e =>{setConfirm({confirm:e.target.value})}
  const handleSignIn = e =>{
    clean()
    setSignIn({signIn:!signIn})
    setLogIn({login:signIn})
  }
  const handleLogIn = e =>{
    clean();
    setLogIn({login:!login})
    setSignIn({signIn:login})
  }

  async function getData(db) {
    const Col = collection(db, 'user');
    const Snapshot = await getDocs(Col);
    const List = Snapshot.docs.map(doc => doc.data());
    setList(arr => [...List])
  }

  async function addData() {
    await addDoc(collection(db, 'user'), {
        username: username,
        password: password
    });
  }

  useEffect(() => {
    getData(db)    
  }, []);


  const clean = () =>{
    setConfirm_input('')
    setPassword_input('')
    setUsername_input('')
  }


  const isEmpty = () =>{
    clean();
    let clean_user = true;
    let clean_pass = true;

    if(username.length === 0){
      setUsername_input("username empty")
      clean_user = false;
    }
    if(password.length === 0){
      setPassword_input("password empty")
      clean_pass = false;
    }

    if(clean_user === false || clean_pass === false){
      return false;
    }
    else{
      return true;
    }
  }

  const validateLogIn = () =>{

    let ans = isEmpty();
    if(ans === false){
      return false;
    }

    let clean_user = false;
    let clean_pass = false;

    for(let i=0;i<list.length;i++){
      if(list[i].username === username){
        clean_user = true;
        if(list[i].password === password){
          clean_pass = true;
          return true;
        }
      } 
    }
    
    if(clean_user === false){
      setUsername_input('invalid username');
    }
    if(clean_pass === false){
      setPassword_input('invalid password');
    }

    return false;
  }

  

  const validateSignIn = () =>{
    clean();
    let errors = false;
    
  
    if(password !== confirm){
      setConfirm_input("doesn't match password");
      errors = true;
    }
    for(let i=0;i<list.length;i++){
      if(list[i].username === username){
        setUsername_input("username taken")
        errors = true;
      }
      if(list[i].password === password){
        setPassword_input("password taken")
        errors = true;
      }
    }

    if(username.length === 0)
      setUsername_input("username empty")
    if(password.length === 0)
      setPassword_input("password empty")
    if(confirm.length === 0)
      setConfirm_input("confirm password empty")
    
    return errors;
  }

  const signinFun = () =>{
    let errors = validateSignIn();
    if(errors === false){
      addData();
      navigate('/home/' + username);
    }
  }

  const loginFun = () =>{
      let k = validateLogIn();      
      if(k === true){
        navigate('/home/' + username);
      }
      
    
  }

  const submit = (event) =>{
    event.preventDefault();
    if(login)
        loginFun();
    else
        signinFun();
  }

  
  function MouseOver(event) {
    event.target.style.background = 'linear-gradient(to right, #b33c3c, #ff5349)';
    event.target.style.color = 'white';
    event.target.style.border = 'white';
  }
  function MouseOut(event){
    event.target.style.background="";
    event.target.style.color = '';
    event.target.style.border = '';
  }

  return (
    <div className='login'>
      <div className='login_container'>
        <h1>Log In</h1>
        <div className="list-container">
          <label> <input type='checkbox' checked={login} onChange={handleLogIn} /> Log In </label>
          <label> <input type='checkbox' checked={signIn} onChange={handleSignIn} /> Sign In </label>
        </div>
        <form>
          <input placeholder='username' className={username_input.length === 0? "input-value" : "input-error"}  type="text" onChange={handleUsername} />
          {username_input.length > 0 ?<label className='label_error'>{username_input}</label> : null}
          <input placeholder='password' className={password_input.length === 0? "input-value" : "input-error"} type="password" onChange={handlePassword} />
          {password_input.length > 0 ?<label  className='label_error'>{password_input}</label> : null}
          {signIn ?<input  placeholder='confirm password' className={confirm_input.length === 0? "input-value" : "input-error"} type="password" onChange={handleConfirm} /> : null }
          {confirm_input.length > 0 ?<label  className='label_error'>{confirm_input}</label> : null}
          <button onMouseOver={MouseOver} onMouseOut={MouseOut} type='submit' onClick={submit} className='login_confirm'>submit</button>
        </form>
      </div>
    </div>
  )
}

export default LogIn
