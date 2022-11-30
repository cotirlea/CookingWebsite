import React from 'react';
import './Header.css'
import SearchIcon from '@mui/icons-material/Search';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import HomeIcon from '@mui/icons-material/Home';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import {MenuItem,Select } from "@material-ui/core";



function Header({username}) {
    const navigate = useNavigate();
    const [values, setValues] = React.useState(['cocktail','dish','ingredient']);

    const goHome = () =>{
        navigate('/home/' + username)
    }
    
    const createProd = () =>{
        navigate('/create/' + username);
    }
    const filter = (event) =>{
        if(event.target.value === 'cocktail'){
        navigate('/home/'+username + '/cocktail');
      }
      else if(event.target.value === 'dish'){
        navigate('/home/'+username + '/dish');
      }
      else{
        navigate('/home/'+username + '/ingredient');
      }
    }

    return (
        <div className="header">
            <div className='header_right'>
                <button  className="header__button" onClick={createProd} >create product </button>
            </div>
            <div className='header_left'>
                <Select IconComponent = {FilterAltIcon} value={values} onChange={filter} disableUnderline  >
                    {values.map((value, index) => {
                     return <MenuItem value={value}>{value}</MenuItem>;
                    })}
                </Select>
                <HomeIcon onClick={goHome} className='svg_icon' />
                <div className="header__nav">
                    <Link to="/">
                        <div  className='header__option'>
                            <span className='header__optionLineOne'>
                                Hello {username.lenght === 0 ? 'Guest' : username}
                            </span>
                            <span className='header__optionLineTwo'>
                                {'Sign Out'}
                            </span>
                        </div>
                    </Link>                     
                </div>
            </div>
        </div>

    )
}

export default Header
