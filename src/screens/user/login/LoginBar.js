import React, { Component } from 'react';
import PropTypes from 'prop-types';
import posed from 'react-pose';
import { StatusCircle } from '../../../components/UserComponents'
import './LoginBar.css';
import iconUserSelected from './icon-user-selected.svg'
import iconUserUnselected from './icon-user-unselected.svg'
import iconPasswordSelected from './icon-password-selected.svg'
import iconPasswordUnselected from './icon-password-unselected.svg'
import { createStylerFactory } from '../../../../node_modules/stylefire';

class LoginBar extends Component {
    constructor(props) {
        super(props)

        if (props.mode === "username") {
            this.iconSelected = iconUserSelected
            this.iconUnselected = iconUserUnselected
        } else {
            this.iconSelected = iconPasswordSelected
            this.iconUnselected = iconPasswordUnselected
        }

        this.handleFakeInput = this.handleFakeInput.bind(this)
        this.setFakeCursor = this.setFakeCursor.bind(this)
        
        this.fakeInput = React.createRef()

        this.state = {
            lastFakeInput: ""
        }
    }

    handleFakeInput(e) {
        let newInput = e.target.value
        
        console.log(this.state.lastFakeInput.length + " " + newInput.length)
        if (this.state.lastFakeInput.length < newInput.length) {
            this.props.update(newInput.charAt(newInput.length - 1))
            this.setState({ lastFakeInput: "ABCD" })
        } else if (this.state.lastFakeInput.length > newInput.length) {
            this.props.update('Backspace')
            if (newInput.length === 0) {
                this.setState({ lastFakeInput: "ABCD" })
            } else {
                this.setState({ lastFakeInput: "ABCD" })
            }
        } else if (this.state.lastFakeInput.length === 1 && newInput.length === 0) {
           
        }
    }

    setFakeCursor(e) {
	    this.setState({ lastFakeInput: "" })
        setTimeout(_ => {
            this.setState({ lastFakeInput: "ABCD" })
        }, 100)
    }

    render() {
        // Set the character boxes to flash or not
        let flashing = false
        if (this.props.active) {
            if (this.props.text.length !== 4) {
                flashing = true
            }
        }


        return (
            <div className="Login-bar">
                <input className="Fake-bar" ref={(instance) => { this.fakeInput = instance }} autoFocus value={this.state.lastFakeInput} onChange={this.handleFakeInput} onFocus={this.setFakeCursor} />
                <LoginSelection iconSelected={this.iconSelected} iconUnselected={this.iconUnselected} active={this.props.active} />
                <LoginField text={this.props.text} flashing={flashing} />
                <StatusCircle mode={this.props.attemptStatus} />
            </div>
        );
    }
}

LoginBar.propTypes = {
    active: PropTypes.bool,
    mode: PropTypes.string,              // "username", "password"
    attemptStatus: PropTypes.string,     // "none", "correct", "wrong"
    text: PropTypes.string
}

// TODO: Add default props

const Selected = posed.span({
    active: {
        scale: 1.0,
        transition: { duration: 300 }
    },
    inactive: {
        scale: 0,
        transition: { duration: 300 }
    }
});

function LoginSelection(props) {
    return (
        <div className="selection-holder">
            <span className="selection inactive">
                <img src={props.iconUnselected} className="selection-icon" alt="" />
            </span>
            <Selected className="selection active" pose={props.active ? "active" : "inactive"}>
                <img src={props.iconSelected} className="selection-icon" alt="" />
            </Selected>
        </div>
    );
}

class LoginField extends Component {
    constructor(props) {
        super(props)

        this.state = {
            flashed: false
        }

        this.lastLength = 0
        this.timer = setInterval(() => this.setState({ flashed: !this.state.flashed }), 500)
    }

    componentWillUnmount() {
        clearInterval(this.timer)
    }

    render() {
        if (this.props.text.length !== this.lastLength) {
            this.lastLength = this.props.text.length
            this.setState({ flashed: false })
            clearInterval(this.timer)
            this.timer = setInterval(() => this.setState({ flashed: !this.state.flashed }), 500)
        }
        
        return (
            <div className="Login-field" >
                {[0, 1, 2, 3].map((index) => {
                    return(
                        <LoginChar
                            char={this.props.text.charAt(index)}
                            flashed={this.state.flashed
                                && index === this.props.text.length
                                && this.props.flashing}
                            key={index}
                        />
                    )
                })}
            </div>
        );
    }
}

const LoginBox = posed.div({
    off: { 
        opacity: 0,
        transition: { duration: 50 }
    },
    on: { 
        opacity: 1,
        transition: { duration: 50 }
     }
})
function LoginChar(props) {
    return (
        <LoginBox pose={props.flashed ? "off" : "on"} className="Login-char" >
            {props.char}
        </LoginBox>
    );
}

export default LoginBar;
