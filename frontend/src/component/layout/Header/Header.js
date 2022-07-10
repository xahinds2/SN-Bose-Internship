import React, { useState } from 'react'
import "./Header.css"
import logo from "../../../images/logo.png";
import { RiMenu3Line,RiCloseLine } from 'react-icons/ri'
import { Link } from 'react-router-dom';
import { useSelector } from "react-redux";
import UserOptions from "./UserOptions"
import Search from '../../Product/Search'
const Menu = () =>(
  <>
    <Link className='links' to='/'> HOME</Link>
    <Link className='links' to='/products'>PRODUCTS</Link>
    <Link className='links' to='/contact'>CONTACT</Link>
    <Link className='links' to='/about'>ABOUT</Link>
  </>
)
const Header = () => {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const [toggleMenu,setToggleMenu] = useState(false);

  return (
      <div className='ecom__navbar'>
        <div className='ecom__navbar-menu'>
          {toggleMenu 
          ? <RiCloseLine className='icon' color="#fff" size={27} onClick={()=> setToggleMenu(false)}/> 
          : <RiMenu3Line className='icon' color="#fff" size={27} onClick={()=> setToggleMenu(true)}/>
          }
          {toggleMenu && (
            <div className='ecom__navbar-menu_container scale-up-center'> 
            <div className='ecom__navbar-menu_container-links'> 
              <Menu/>
              <div className='ecom__navbar-menu_container-links-sign'>
              {!isAuthenticated && <Link className='links-right2' to='/login'>Log In</Link>}
              </div>
            </div>
            </div>
          )

          }
        </div>
        <div className='ecom__navbar-links'>
          <div className='ecom__navbar-links_logo'>
            <img src={logo} alt="logo"/>
          </div>
          <div className='ecom__navbar-links_container'>
            <Menu/>
          </div>
          

        </div>
        <Search/>
        <div className='ecom__navbar-sign'>
          {isAuthenticated ?<UserOptions user={user} /> : <Link className='links-right' to='/login'>Log In</Link>}
        </div>
        

      </div>
  )
}

export default Header
// import React from "react";
// import { ReactNavbar } from "overlay-navbar";
// import logo from "../../../images/logo.png";

// const options = {
//   burgerColorHover: "#eb4034",
//   logo,
//   logoWidth: "20vmax",
//   navColor1: "white",
//   logoHoverSize: "10px",
//   logoHoverColor: "#eb4034",
//   link1Text: "Home",
//   link2Text: "Products",
//   link3Text: "Contact",
//   link4Text: "About",
//   link1Url: "/",
//   link2Url: "/products",
//   link3Url: "/contact",
//   link4Url: "/about",
//   link1Size: "1.3vmax",
//   link1Color: "rgba(35, 35, 35,0.8)",
//   nav1justifyContent: "flex-end",
//   nav2justifyContent: "flex-end",
//   nav3justifyContent: "flex-start",
//   nav4justifyContent: "flex-start",
//   link1ColorHover: "#eb4034",
//   link1Margin: "1vmax",
//   profileIconUrl: "/login",
//   profileIconColor: "rgba(35, 35, 35,0.8)",
//   searchIconColor: "rgba(35, 35, 35,0.8)",
//   cartIconColor: "rgba(35, 35, 35,0.8)",
//   profileIconColorHover: "#eb4034",
//   searchIconColorHover: "#eb4034",
//   cartIconColorHover: "#eb4034",
//   cartIconMargin: "1vmax",
// };

// const Header = () => {
//   return <ReactNavbar {...options} />;
// };

// export default Header;

