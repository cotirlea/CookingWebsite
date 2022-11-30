import React,{useEffect,useState} from 'react'
import { useParams } from 'react-router-dom';
import {db} from "./firebase"
import { collection, query, where, getDocs } from 'firebase/firestore/lite';
import './Reciepe.css'
import { Link,useNavigate } from "react-router-dom";
import { async } from '@firebase/util';
import Header from './Header';


function Reciepe() {

  let { name } = useParams();
  const [username,setUsername] = useState('')
  const [ingredients,setIngredients] = useState([])
  const [steps,setSteps] = useState([])
  const [image,setImage] = useState('')

   async function getData(){
    const q = query(collection(db, 'reciepe'), where('name', '==', name));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
        setIngredients(doc.data().ingredients)
        setSteps(doc.data().steps)
        setImage(doc.data().image)
        setUsername(doc.data().user)
    });
  }


   useEffect(() =>{
          getData()
    },[])
  return (
    <div className='reciepe'>
      <Header username={username}/>
      <div className='reciepe_container'>
        <div className='reciepe_title'>
          <h1>{name}</h1>
        </div>
        <img className='profile_pic' src={image} alt='' />
        <div className='reciepe_ingredients'>
        <h2>Ingredients</h2>
        {
          ingredients.map((item,index) =>(
            <div>
              <p>{(index+1)+') '+item}</p>
            </div>   
          ))}
        </div>
          {
            steps.map((item,index) =>(
              <div className='reciepe_step'>
                <h2>{'Step: '+(index+1)+'.'}</h2>
                <p>{item}</p>
              </div>
            ))}
      </div>
    </div>
  )
}

export default Reciepe