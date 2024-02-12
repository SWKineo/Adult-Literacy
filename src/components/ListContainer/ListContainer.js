import React, { Component } from 'react';
import './ListContainer.css';



class ListContainer extends Component {

  render() {
    return (
      <div className="listContainer">
        {this.props.items.map((item) => {
          return (
            <div className="listItemContiner">
              <ListItem text={item.value}/>
              {this.props.actions.map((action) => {
                return (
                  <div className="listButtonContainer">
                    <ListButton title={action.title} history={this.props.history} redirect={action.redirect} id={item.id}/>
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
    )
  }
}

class ListButton extends Component {

  constructor(props) {
    super(props)

    this.handleSubmit = this.handleSubmit.bind(this);

  }

  handleSubmit(e) {
    this.props.history.push(this.props.redirect + "/" + this.props.id);
  }

  render() {
    return (
      <button onClick={this.handleSubmit} className="listButton">{this.props.title}</button>
    )
  }
}



function ListItem(props) {
  return(
    <div className="listItem">{props.text}</div>
  )
}


export default ListContainer;
