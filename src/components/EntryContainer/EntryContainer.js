import React, { Component } from 'react';
import './EntryContainer.css';

class EntryContainer extends Component {
  render() {
    return (
      <div className="entryContainer">
          {this.props.items.map((item) => {

            var entryInput;

            if(item.type === "submit"){
              entryInput = <EntrySubmit type={item.type} value={item.value} handler={item.handler} defaultValue={item.defaultValue}/>;
            }else{
              entryInput = <EntryInput type={item.type} placeholder={item.placeholder} value={item.value} defaultValue={item.defaultValue} handler={item.handler} maxLength={item.maxlength}/>;
            }

            return(
              <div className="entryInputContainer">
                {entryInput}
              </div>
            )
          })}
      </div>
    )
  }
}

function EntryInput(props) {

  var t = ""
  if(props.type === 'file'){
    t = props.placeholder + ":"
  }

  return(
    <div>
      <div className="inputLabel">
      {t}
      </div>
      <input className="entryInput" type={props.type} value={props.value} defaultValue={props.defaultValue} placeholder={props.placeholder} onChange={props.handler} maxLength={props.maxlength}/>
    </div>
  )
}

function EntrySubmit(props) {
  return(
    <input className="entrySubmit" type="submit" value={props.value} defaultValue={props.defaultValue} onClick={props.handler}/>
  )
}

export default EntryContainer;
