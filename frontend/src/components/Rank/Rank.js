import React from 'react';
import './styles.css';

class Rank extends React.Component {
  constructor() {
    super();
    this.state = {
      emoji: '',
    }
  }

  componentDidMount() {
    this.generateEmoji(this.props.imageNum);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.imageNum === this.props.imageNum && prevProps.name === this.props.name) {
      return null;
    }
    this.generateEmoji(this.props.imageNum)
  }

  generateEmoji = (imageNum) => {
    fetch(`https://6ilr84f27c.execute-api.us-east-1.amazonaws.com/prod/rank?rank=${imageNum}`)
      .then(res => res.json())
      .then(data => {
        return this.setState({ emoji: data.input })
      })
  }

  render() {
    return (
      <div className='user-data-container'>
        <div>
          <div className='white f3'>
            {`${this.props.name}, your current entry count is...`}
          </div>
          <div className='white f1'>
            {this.props.imageNum}
          </div>
        </div>
        <div className='white f1'>
          {this.state.emoji}
        </div>
      </div>
    )
  }
}

export default Rank;