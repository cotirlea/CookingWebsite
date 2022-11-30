import React, { useState, useEffect } from 'react';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import blank from './blank.jpg'
import {db} from "./firebase"
import { doc, setDoc } from "firebase/firestore/lite"; 
import { getStorage, ref, uploadBytes,getDownloadURL } from "firebase/storage";


import './CreateReciepe.css'
import { async } from '@firebase/util';

const Test = () => {
    const [title,setTitle] = useState('')
    const [ingredients, setingredients] = useState([])
    const [step,setStep] = useState([])
    const [{image,info},setImage] = useState({image:blank,info:''})
    const hiddenFileInput = React.useRef(null);
    const [{dish},setDish] = useState({dish:false})
    const [{cocktail},setCocktail] = useState({cocktail:false})
    const [{ingredient},setIngredient] = useState({ingredient:false})
     const handleClick = event => {
         hiddenFileInput.current.click();
    };
    const imageHandler = e => {
      setImage({
        image: URL.createObjectURL(e.target.files[0]),
        info : e.target.files[0]
      })
    }

    const handleDish = e =>{
        setDish({dish:true})
        setCocktail({cocktail:false})
        setIngredient({ingredient:false})
    }

    const handleCocktail = e =>{
        setDish({dish:false})
        setCocktail({cocktail:true})
        setIngredient({ingredient:false})
    }

    const handleIngredient = e =>{
        setDish({dish:false})
        setCocktail({cocktail:false})
        setIngredient({ingredient:true})
    }

    const handleTitle = e =>{
        setTitle(e.target.value)
    }

    const handleIngredients = (i, e) => {
        let newFormValues = [...ingredients];
        newFormValues[i][e.target.name] = e.target.value;
        setingredients(newFormValues);
    }

    const handleStep = (i, e) => {
        let newFormValues = [...step];
        newFormValues[i][e.target.name] = e.target.value;
        setStep(newFormValues);
    }
    
    const addIngredients = () => {
        setingredients([...ingredients, { name: ""}])
    }

    const addStep = () => {
        setStep([...step, { name: ""}])
    }
    
    const removeIngredients = (i) => {
        let newFormValues = [...ingredients];
        newFormValues.splice(i, 1);
        setingredients(newFormValues)
    }

    const removeStep = (i) => {
        let newFormValues = [...step];
        newFormValues.splice(i, 1);
        setStep(newFormValues)
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

    const getType = () =>{
        if(dish === true){
            return 'dish'
        }
        if(cocktail === true){
            return 'cocktail'
        }
        if(ingredient === true){
            return 'ingredient'
        }
    }

    async function create(){
        const type = getType();
        const storage = getStorage();
        const storageRef = ref(storage, 'user1/'+title);
        const metadata = {contentType: 'image/jpeg',};
        await uploadBytes(storageRef, info, metadata);
        let url = await getDownloadURL(ref(storage, 'user1/'+title)) 
        console.log(url)
        setDoc(doc(db, "reciepe",title), {
              image:url,
              ingredients:ingredients,
              name:title,
              steps:step,
              type:type,
              user:'user1',
            })
    }

    const done = () =>{
        create()
    }


    return (
        <div className='reciepe'>
            <div className='reciepe_container'>
                <h1>Create Reciepe</h1>
                <h2>Add Title:</h2>
                    <input placeholder='add title' className='input-value' type="text" name="name" value={title} onChange={e => handleTitle(e)} />
                <h2>Add Ingredients:</h2>
                {ingredients.map((element, index) => (
                    <div className="add_row" key={index}>
                        <input placeholder='add ingredient' className='input-value' type="text" name="name" value={element.name } onChange={e => handleIngredients(index, e)} />
                        <button onMouseOver={MouseOver} onMouseOut={MouseOut} className='bttn_remove' type="button"  onClick={() => removeIngredients(index)}>Remove</button> 
                    </div>
                ))}
                <button onMouseOver={MouseOver} onMouseOut={MouseOut}  className="bttn_ingredient" type="button" onClick={() => addIngredients()}>Add</button>

                <h2>Add Image</h2>
                <img src={image} alt="" />
                <AddCircleOutlineIcon style={{ fontSize: 50}} className='btn' onClick={handleClick}/>
                <input type="file" ref={hiddenFileInput} accept="image/*" onChange={imageHandler}style={{display: 'none'}}/>

                <h2>Add type</h2>
                <div className="list-container">
                    <label> <input type='checkbox' checked={dish} onChange={handleDish} /> Dish </label>
                    <label> <input type='checkbox' checked={cocktail} onChange={handleCocktail} /> Cocktail </label>
                    <label> <input type='checkbox' checked={ingredient} onChange={handleIngredient} /> ingredient </label>
                </div>

                <h2>Add Steps:</h2>
                {step.map((element, index) => (
                    <div className="add_row" key={index}>
                        <input placeholder='add step' className='input-value' type="text" name="name" value={element.name } onChange={e => handleStep(index, e)} />
                        <button onMouseOver={MouseOver} onMouseOut={MouseOut} className='bttn_remove' type="button"  onClick={() => removeStep(index)}>Remove</button> 
                    </div>
                ))}
                <button onMouseOver={MouseOver} onMouseOut={MouseOut}  className="bttn_ingredient" type="button" onClick={() => addStep()}>Add</button>

                <h2>Confrim</h2>
                <button onMouseOver={MouseOver} onMouseOut={MouseOut}  className="bttn_ingredient" type="button" onClick={() => done()}>Submit</button>
            </div>
      </div>
    )
};

export default Test;