import React, { Component } from 'react';
import './Profile.css';

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: this.props.user.name,
            age: this.props.user.age,
            pet: this.props.user.pet,
            message: '',
        }
    }

    onProfileUpdate = async () => {
        try {
            const { name, age, pet } = this.state;
            const formInput = { name, age, pet };
            const token = window.localStorage.getItem('token');
            if (!token) {
                this.props.loadUser(this.props.initialState);
                window.localStorage.removeItem('token');
                return;
            }
            const updateRes = await fetch(`/profile`, {
                method: 'post',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': token,
                },
                body: JSON.stringify({ formInput })
            })
            if (updateRes.status === 500) {
                throw new Error(`Unable to connect server.`)
            }
            const updateData = await updateRes.json();
            if (updateData.type === 'error') {
                throw new Error(updateData.message)
            }
            this.setState({ message: updateData });
        } catch (err) {
            console.log(err.message);
            this.setState({ message: err.message });
        }
    }

    onFormChange = (event) => {
        this.setState({ [event.target.name]: event.target.value })
    }

    render() {
        const { toggleModal, user } = this.props
        const { name, age, pet } = this.state;
        return (
            <div className='profile-modal'>
                <article className='modal-content-container'>
                    <div className='modal-close-container'>
                        <div className='modal-close' onClick={toggleModal}>&times;</div>
                    </div>
                    <main className='pa3 black-80 w-90'>
                        <div className='modal-name-avar'>
                            <h4 className='modal-name'>Username:{name}</h4>
                            <img src='https://tachyons.io/img/logo.jpg' className='h3 w3 dib' alt='avatar' />
                        </div>
                        <h4>{`Images submitted: ${user.imageNum}`}</h4>
                        <p>{`Member since: ${new Date(user.joined).toLocaleDateString()}`}</p>
                        <hr />
                        <p className='modal-message'>{this.state.message}</p>
                        <label className='mt2 fw6' htmlFor='user-name'>Name:</label>
                        <input onChange={this.onFormChange} type='text' name='name' className='pa2 ba w-100' value={name}></input>
                        <label className='mt2 fw6' htmlFor='user-age'>Age:</label>
                        <input onChange={this.onFormChange} type='text' name='age' className='pa2 ba w-100' value={age}></input>
                        <label className='mt2 fw6' htmlFor='user-pet'>Favourite Pet:</label>
                        <input onChange={this.onFormChange} type='text' name='pet' className='pa2 ba w-100' value={pet}></input>
                        <div className='mt4' style={{ display: 'flex', justifyContent: 'space-evenly' }}>
                            <button className='b pa2 grow pointer hover-white w-40 bg-light-blue b--black-20'
                                onClick={() => this.onProfileUpdate()}>
                                Save
                            </button>
                            <button className='b pa2 grow pointer hover-white w-40 bg-light-red b--black-20'
                                onClick={toggleModal}>
                                Cancel
                            </button>
                        </div>
                    </main>
                </article>
            </div>
        );
    }
}

export default Profile;