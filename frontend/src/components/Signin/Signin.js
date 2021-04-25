import React from 'react';
import './Signin.css';

class Signin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      errorMessage: ''
    }
  }

  handleInputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value })
  }

  saveTokenInLocalStorage = (token) => {
    window.localStorage.setItem('token', token);
  }

  onSubmitSignInAsync = async () => {
    try {
      const session = await fetch('/signin', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: this.state.email,
          password: this.state.password
        })
      })

      if (session.status === 500) {
        throw new Error(`Unable to connect server.`)
      }
      const sessionData = await session.json();
      if (sessionData.type === 'error') {
        throw new Error(sessionData.message)
      }
      else if (sessionData.userId && sessionData.success === 'true') {
        this.saveTokenInLocalStorage(sessionData.token);
        const profile = await fetch(`/profile`, {
          method: 'get',
          headers: {
            'Content-type': 'application/json',
            'Authorization': sessionData.token
          }
        })
        if (profile.status === 500) {
          throw new Error(`Unable to connect server.`)
        }

        const profileData = await profile.json();
        if (profileData.type === 'error') {
          throw new Error(profileData.message)
        }
        else if (profileData && profileData.email) {
          this.props.loadUser(profileData);
          this.props.onRouteChange('home');
        }
      }
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }
  }

  render() {
    const { onRouteChange } = this.props;
    return (
      <article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
        <main className="pa4 black-80 main-container">
          <div className="measure">
            <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
              <legend className="f1 fw6 ph0 mh0">Sign In</legend>
              <div className="mt3">
                <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
                <input
                  className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                  type="email"
                  name="email"
                  id="email-address"
                  onChange={this.handleInputChange}
                />
              </div>
              <div className="mv3">
                <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
                <input
                  className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                  type="password"
                  name="password"
                  id="password"
                  onChange={this.handleInputChange}
                />
              </div>
            </fieldset>
            <div className='main-error'>{this.state.errorMessage}</div>
            <div className="">
              <input
                onClick={this.onSubmitSignInAsync}
                className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
                type="submit"
                value="Sign in"
              />
            </div>
            <div className="lh-copy mt3">
              <p onClick={() => onRouteChange('register')} className="f6 link dim black db pointer">Register</p>
            </div>
          </div>
        </main>
      </article>
    );
  }
}

export default Signin;