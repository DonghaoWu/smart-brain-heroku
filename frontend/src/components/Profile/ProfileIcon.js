import React from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

class ProfileIcon extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdownOpen: false
    };
  }

  toggle = () => {
    this.setState({ dropdownOpen: !this.state.dropdownOpen });
  }

  render() {
    return (
      <div className="pa3 tc">
        <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
          <DropdownToggle
            tag="span"
            onClick={this.toggle}
            data-toggle="dropdown"
            aria-expanded={this.state.dropdownOpen}
          >
            <img
              src='https://tachyons.io/img/logo.jpg'
              className="br-100 h3 w3 dib" alt="avatar" />
          </DropdownToggle>
          <DropdownMenu className='b--transparent shadow-5' right>
            <DropdownItem onClick={() => this.props.toggleModal()}>View Profile</DropdownItem>
            <DropdownItem onClick={() => this.props.onRouteChange('signout')}>Sign Out</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    );
  }
}

export default ProfileIcon;