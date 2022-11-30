import React,{useEffect,useState} from 'react'
import './Home.css'
import { useParams } from 'react-router-dom';
import {db} from "./firebase"
import { collection, query, where, getDocs } from 'firebase/firestore/lite';
import ReciepeCard from './ReciepeCard' 
import Header from './Header'

function Home() {

  let { username } = useParams();
  let { filter } = useParams();
  const [myArray, updateMyArray] = useState([]);
  
  async function getData(){
    const q = query(collection(db, 'reciepe'), where('user', '==', username));
    let list = []

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      
          list.push(doc.data())
    });
    updateMyArray( arr => [ ...list]);
  }

  const test = () =>{}
  
  useEffect(() =>{
    getData();
  },[])
  
  return (
    <div className='home'>
      <Header username={username}/>
      <h1>{username}</h1>
      {
        myArray.map(item => (
          <ReciepeCard
            name = {item.name}
            image={item.image}
            user={item.user}
          />
        ))}
    </div>
  )
}

export default Home