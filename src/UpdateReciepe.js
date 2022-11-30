import React, { useState,useEffect } from 'react';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import blank from './blank.jpg'
import {db} from "./firebase"
import { collection, query, where, getDocs, doc, updateDoc,setDoc } from "firebase/firestore/lite"; 
import { getStorage, ref, uploadBytes,getDownloadURL } from "firebase/storage";
import './CreateReciepe.css'
import { useParams,useNavigate } from 'react-router-dom';
import Header from './Header';


function UpdateReciepe() {
    let { name } = useParams();
    const navigate = useNavigate();
    const [username,setUsername] = useState('')
    const [title,setTitle] = useState('')
    const [ingredients, setIngredients] = useState([])
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

    const setType = (type) =>{
        if(type === 'dish'){handleDish()}
        if(type === 'ingredient'){handleIngredient()}
        if(type === 'cocktail'){handleCocktail()}
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
        setIngredients(newFormValues);
    }

    const handleStep = (i, e) => {
        let newFormValues = [...step];
        newFormValues[i][e.target.name] = e.target.value;
        setStep(newFormValues);
    }

    
    
    const addIngredients = () => {
        setIngredients([...ingredients, { name: ""}])
    }

    const addStep = () => {
        setStep([...step, { name: ""}])
    }
    
    const removeIngredients = (i) => {
        let newFormValues = [...ingredients];
        newFormValues.splice(i, 1);
        setIngredients(newFormValues)
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

    const getIngredientDB = (l) =>{
        let list = []
        for(let i=0;i<l.length;i++){
            list.push({name:l[i]})
        }
        setIngredients(arr => [...list])
    }

    const getStepDB = (l) =>{
        let list = []
        for(let i=0;i<l.length;i++){
            list.push({name:l[i]})
        }
        setStep(arr => [...list])
    }

    const done = () =>{
        let errors = verify()
        if(errors.length === 0){
            storeImge()
            update()
            navigate('/home/'+username);
        }
        else{
            alert(errors)
        }
    }

    const getIngrediente = () =>{
        let l = []
        for(let i=0;i<ingredients.length;i++){
            l.push(ingredients[i].name)

        }
        return l;
    }

    const getStep = () =>{
        let l = []
        for(let i=0;i<step.length;i++){
            l.push(step[i].name)
        }
        return l;
    }

    const verify = () =>{
        let errors = ""
        
        if(ingredients.length === 0){
            errors = errors + "nici un ingredient nu a fost ales \n"
        }
        if(ingredient === false && dish === false && cocktail === false){
            errors = errors + "tipul nu a fost ales \n"
        }
        if(step.length === 0){
            errors = errors + "nu a fost pu nici un pas \n"
        }
        return errors;
    }

    async function update(){
        let ing = getIngrediente();
        let stp = getStep();
        let type = getType();
        const updateRef = doc(db, "reciepe",name);
        updateDoc(updateRef, {
              ingredients:ing,
              name:title,
              steps:stp,
              type:type,
        });
        
    }



    async function storeImge(){
      if(info.length !== 0){
        const storage = getStorage();
        const storageRef = ref(storage, username+'/'+name);
        const metadata = {contentType: 'image/jpeg',};
        uploadBytes(storageRef, info, metadata);
        let x = await getDownloadURL(ref(storage, username+'/'+name))
        const updateRef = doc(db, "reciepe",name);
        updateDoc(updateRef, {
          img:x
        });
      }
    }

    async function getData(){
    const q = query(collection(db, 'reciepe'), where('name', '==', name));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
        getIngredientDB(doc.data().ingredients)
        getStepDB(doc.data().steps)
        setImage({image:doc.data().image})
        setUsername(doc.data().user)
        setType(doc.data().type)
        setTitle(doc.data().name)
    });
  }


   useEffect(() =>{
          getData()
    },[])


    return (
        <div className='reciepe'>
            <Header username={username}/>
            <div className='reciepe_container'>
                <h1>UpdateReciepe Reciepe</h1>
                <h1>{title}</h1>
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
}

export default UpdateReciepe