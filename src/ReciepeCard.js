import React,{useState,useRef} from 'react'
import './ReciepeCard.css'
import {MenuItem,Select } from "@material-ui/core";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { useNavigate } from "react-router-dom";
import { doc, deleteDoc } from "firebase/firestore/lite";
import {db} from "./firebase"
import { getStorage, ref, deleteObject } from "firebase/storage";



function ReciepeCard({name,image,user}) {
    const [values, setValues] = React.useState(['edit','delete','share']);
    const [selected, setSelected] = useState("");
    const navigate = useNavigate();
    const [copySuccess, setCopySuccess] = useState("")
    const textAreaRef = useRef(null)

    async function handleView(event) {
      navigate('/reciepe/'+name);
    }

    async function remove_strg(){
      const storage = getStorage();
      const storageRef = ref(storage, user+'/'+name);
      await deleteObject(storageRef)
    }
    async function remove_data(){
      await deleteDoc(doc(db, "reciepe", name))
    }

    async function copyToClip() {
        /*
        const link = window.location.href
        const k = link.replace('home/'+user, "");
        k = k + 'reciepe/' + name
        */
        const link = window.location.href
        const k = link.replace('home/'+user, "") + 'reciepe/' + name
        await navigator.clipboard.writeText(k)
        alert('Link copied')
    }


    async function handleChange(event) {
      if(event.target.value === 'edit'){
        navigate('/update/'+name);
      }
      else if(event.target.value === 'share'){
        copyToClip()
      }
      else{
        await remove_data()
        await remove_strg()
        window.location.reload()
      }
    }
    return (
    <div className='product'>
      <div className='header_up'> 
            <p>{name}</p>
            <Select IconComponent = {MoreHorizIcon} value={selected} onChange={handleChange} disableUnderline  >
                {values.map((value, index) => {
                  return <MenuItem value={value}>{value}</MenuItem>;
                })}
            </Select>
      </div>
      <img src={image} alt="" />
      <div className='header_low'>
        <button className="button__add" onClick={handleView}>view reciepe</button>
      </div>
    </div>
  )
}

export default ReciepeCard;