import React, { Component } from 'react'
import posed from 'react-pose'
import "./UserComponents.css"
import iconCorrect from './icon-status-correct.svg'
import iconWrong from './icon-status-wrong.svg'

const HelperCircle = posed.div({
    expanded: {
        scale: 1,
        transition: { duration: 150 }
    },
    shrunk: {
        scale: 0,
        transition: { duration: 150 }
    }
})

function StatusCircle(props) {
    return(
        <div className="status-circle-holder">
            <div className="status-circle empty" />
            <HelperCircle pose={props.mode === "correct" ? "expanded" : "shrunk"} className="status-circle correct">
                <img className="status-icon" src={iconCorrect} alt="" />
            </HelperCircle>
            <HelperCircle pose={props.mode === "wrong" ? "expanded" : "shrunk"} className="status-circle wrong">
                <img className="status-icon" src={iconWrong} alt="" />
            </HelperCircle>
        </div>
    )
}

const IconHolder = posed.button({
    normal: {
        scale: 1,
        transition: { duration: 50 },
    },
    hovered: {
        scale: 1.1,
        transition: { duration: 150 },
    },
    clicked: {
        scale: 0.95,
        transition: { duration: 20 }
    }
})
class IconButton extends Component {
    constructor(props) {
        super(props)
        
        this.state = {
            pose: "normal",
            mouseOn: false
        }

        this.iconClick = this.iconClick.bind(this)
    }

    iconClick(onClick) {
        this.setState({ pose: "clicked" })

        setTimeout(() => {
            if (this.state.mouseOn) {
                this.setState({ pose: "hovered" })
            } else {
                this.setState({ pose: "normal" })
            }

            setTimeout(() => {
                onClick()
            }, 100)
        }, 100)

        // if (!e) {
        //     let e = window.event
        // }
        // e.cancelBubble = true
        // if (e.stopPropogation) e.stopPropogation()

    }

    render() {
        return (
            <IconHolder
                onClick={this.iconClick.bind(this, this.props.onClick)}
                onMouseEnter={() => this.setState({ pose: "hovered", mouseOn: true })}
                onMouseLeave={() => this.setState({ pose: this.state.pose === "clicked" ? "clicked" : "normal", mouseOn: false })}
                className="icon-button"
                pose={this.state.pose}
            >
                <img className="icon-button-image" src={this.props.icon} alt="" />
            </IconHolder>
        )
    }
}

export {
    StatusCircle, IconButton
}