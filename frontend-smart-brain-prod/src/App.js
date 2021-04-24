import React, { Component } from 'react';
import Particles from 'react-particles-js';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Navigation from './components/Navigation/Navigation';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import Profile from './components/Profile/Profile';
import Modal from './components/Modal/Modal';
import './App.css';

const particlesOptions = {
  particles: {
    number: {
      value: 30,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
}

const initialState = {
  input: '',
  imageUrl: '',
  boxes: [],
  route: 'signin',
  isProfileOpen: false,
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    imageNum: 0,
    joined: '',
    age: 0,
    pet: ''
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  loadUser = (data) => {
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        imageNum: data.imageNum,
        joined: data.joined,
        pet: data.pet,
        age: data.age
      }
    })
  }

  componentDidMount() {
    const token = window.localStorage.getItem('token');
    if (token) {
      fetch('/auth', {
        method: 'post',
        headers: {
          'Content-type': 'application/json',
          'Authorization': token
        }
      })
        .then(res => res.json())
        .then(data => {
          if (data && !data.type) {
            fetch(`/profile`, {
              method: 'get',
              headers: {
                'Content-type': 'application/json',
                'Authorization': token
              }
            })
              .then(res => res.json())
              .then(user => {
                if (user && user.email) {
                  this.loadUser(user);
                  this.onRouteChange('home');
                }
              })
          }
        })
        .catch(err => {
        })
    }
  }

  calculateFaceLocations = (data) => {
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return data.outputs[0].data.regions.map(face => {
      const clarifaiFace = face.region_info.bounding_box;
      return {
        leftCol: clarifaiFace.left_col * width,
        topRow: clarifaiFace.top_row * height,
        rightCol: width - (clarifaiFace.right_col * width),
        bottomRow: height - (clarifaiFace.bottom_row * height)
      }
    });
  }

  displayFaceBox = (boxes) => {
    this.setState({ boxes: boxes });
  }

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  }

  onButtonSubmit = () => {
    if (!this.state.input) return;
    const token = window.localStorage.getItem('token');
    if (!token) {
      this.setState(initialState);
      window.localStorage.removeItem('token');
      return;
    }
    this.setState({ imageUrl: this.state.input });

    fetch('/imageurl', {
      method: 'post',
      headers: {
        'Content-type': 'application/json',
        'Authorization': token,
      },
      body: JSON.stringify({
        input: this.state.input
      })
    }).then(apiData => apiData.json())
      .then(apiData => {
        if (apiData) {
          fetch('/image', {
            method: 'put',
            headers: {
              'Content-type': 'application/json',
              'Authorization': token
            }
          })
            .then(response => response.json())
            .then(data => {
              this.setState({ user: { ...this.state.user, imageNum: data } })
            })
            .catch()
        }
        this.displayFaceBox(this.calculateFaceLocations(apiData))
      })
      .catch(err => console.log);
  }

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState(initialState);
      window.localStorage.removeItem('token');
    } else if (route === 'home') {
      this.setState({ isSignedIn: true, route: route })
    }
    else this.setState({ route: route });
  }

  toggleModal = () => {
    this.setState(state => ({
      ...state,
      isProfileOpen: !state.isProfileOpen,
    }));
  }

  render() {
    const { isSignedIn, imageUrl, route, boxes, isProfileOpen, user } = this.state;
    return (
      <div className="App">
        <Particles className='particles'
          params={particlesOptions}
        />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} toggleModal={this.toggleModal} />
        {
          isProfileOpen &&
          <Modal>
            <Profile isProfileOpen={isProfileOpen} toggleModal={this.toggleModal} user={user} loadUser={this.loadUser} initialState={initialState} onRouteChange={this.onRouteChange} />
          </Modal>
        }
        {route === 'home'
          ? <div>
            <Logo />
            <Rank
              name={this.state.user.name}
              imageNum={this.state.user.imageNum}
            />
            <ImageLinkForm
              onInputChange={this.onInputChange}
              onButtonSubmit={this.onButtonSubmit}
            />
            <FaceRecognition boxes={boxes} imageUrl={imageUrl} />
          </div>
          : (
            route === 'signin'
              ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
              : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
          )
        }
      </div>
    );
  }
}

export default App;