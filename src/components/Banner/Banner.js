import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './Banner.css';

class Banner extends Component {

  constructor(props) {
    super(props)

    this.state = {
      leftItems: [
        {
          title: "Users",
          dest: "/admin/user"
        },
        {
          title: "Words",
          dest: "/admin/word"
        }
      ],
      rightItems: [
        {
          title: "Sign Out",
          dest: "/admin"
        }
      ]
    }
  }

  handleSignOut(){
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userType');
  }

  render() {

    return (
      <div className="banner">
        {this.state.leftItems.map((item) => {
          return (
            <div className="leftItem">
              <BannerItem title={item.title} to={item.dest} />
            </div>
          )
        })}
        {this.state.rightItems.map((item) => {
          return (
            <div className="rightItem">
              <BannerItem title={item.title} to={item.dest} handler={this.handleSignOut}/>
            </div>
          )
        })}
      </div>
    )
  }
}

export default Banner;

function BannerItem(props) {
  return(
    <Link to={props.to}><button onClick={props.handler} className="bannerButton">{props.title}</button></Link>
  )
}
