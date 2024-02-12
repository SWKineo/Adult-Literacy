import React, { Component } from 'react';
import './Header.css';

class Header extends Component {

  constructor(props) {
    super(props)

    this.handleRightSubmit = this.handleRightSubmit.bind(this);
    this.handleLeftSubmit = this.handleLeftSubmit.bind(this);

  }

  handleRightSubmit(e) {
    this.props.history.push(this.props.rightItem.redirect);
  }

  handleLeftSubmit(e){
    if(this.props.leftItem.redirect == null){
      this.props.history.goBack();
    }else{
      this.props.history.push(this.props.leftItem.redirect);
    }
  }

  render() {

    var leftItem;
    var title;
    var rightItem;

    if(this.props.leftItem !== undefined){
      leftItem = <HeaderButton title={this.props.leftItem.title} handler={this.handleLeftSubmit}/>;
    }

    if(this.props.title !== undefined){
      title = <HeaderTitle title={this.props.title}/>;
    }

    if(this.props.rightItem !== undefined){
      rightItem = <HeaderButton title={this.props.rightItem.title} handler={this.handleRightSubmit}/>;
    }

    return(
      <div className="header">
        {leftItem}
        {title}
        {rightItem}
      </div>
    )
  }
}

function HeaderButton(props){
  return(
    <button onClick={props.handler} className="headerButton">{props.title}</button>
  )
}

function HeaderTitle(props) {
  return(
    <div className="headerTitle">{props.title}</div>
  )
}

export default Header;
