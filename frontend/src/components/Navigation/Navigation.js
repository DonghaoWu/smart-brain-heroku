import React, { Fragment } from 'react';
import Logo from '../Logo/Logo';
import './styles.css'
import ProfileIcon from '../Profile/ProfileIcon';

const Navigation = ({ onRouteChange, isSignedIn, toggleModal }) => {
  return (
    <nav className='nav-container'>
      <Logo />
      {
        isSignedIn ?
          <ProfileIcon onRouteChange={onRouteChange} toggleModal={toggleModal} />
          :
          <div className='auth-buttons'>
            <p onClick={() => onRouteChange('signin')} className='f3 link dim black underline pa3 pointer'>Sign In</p>
            <p onClick={() => onRouteChange('register')} className='f3 link dim black underline pa3 pointer'>Register</p>
          </div>
      }
    </nav>
  )
}

export default Navigation;