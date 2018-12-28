import React, { Component } from 'react';
import { slide as Menu } from 'react-burger-menu';
import Location from './Location';

class MenuComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      'locations': '',
      'query': '',
      'suggests': true,
    };

    this.filterLocations = this.filterLocations.bind(this);
    this.toggleSuggestions = this.toggleSuggestions.bind(this);
  }

  componentWillMount() {
      this.setState({
          'locations': this.props.locations
      });
  }

  toggleSuggestions() {
      this.setState({
          'suggests': !this.state.suggests
      });
  }

  locationList = () => {
    return this.state.locations.map(function (listItem, index) {
      return (
          <Location key={index} openInfoWindow={this.props.openInfoWindow.bind(this)} data={listItem}/>
      );
    }, this);
  }

  filterLocations(event) {
    this.props.closeInfoWindow();
    const {value} = event.target;
    let locations = [];
    this.props.locations.forEach(function (location) {
        if (location.longname.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
            location.marker.setVisible(true);
            locations.push(location);
        } else {
            location.marker.setVisible(false);
        }
    });

    this.setState({
        'locations': locations,
        'query': value
    });
}

  
  render () {
    // const locationlist =

      
    return (
      <Menu width={ '25%' } isOpen noOverlay >
        <div >
          <input role="search" className="search-field" 
                  aria-labelledby="filter" 
                  id="search-field" 
                  type="text" 
                  placeholder="Filter"
                  value={this.state.query} 
                  onChange={this.filterLocations}/>
          <ul>
              {this.state.suggests && this.locationList()}
          </ul>
        </div>
      </Menu>
    );
  }
}

export default MenuComponent