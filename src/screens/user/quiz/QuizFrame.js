import React, { Component } from 'react'
import PropType from 'prop-types'
import posed, { PoseGroup } from 'react-pose'
import { Redirect } from 'react-router-dom'
import Sound from 'react-sound'
import { StatusCircle, IconButton } from '../../../components/UserComponents'
import { Word } from '../progress/ProgressFrame'
import './QuizFrame.css'
import iconHome from './icon-home.svg'
import iconAudio from '../icon-audio.svg'

class OptionWord {
    constructor(text, key, onClick) {
        this.text = text
        this.key = key
        this.onClick = onClick
    }
}

const CLICK_CORRECT = "correct"
const CLICK_WRONG = "wrong"
const CLICK_RANDOM = "empty"

class QuizFrame extends Component {
    constructor(props) {
        super(props)

        /* Temp Word object since the parentWord hasn't been
         * registered as a Word yet */
        this.w = new Word()

        fetch(`http://rr.acg.maine.edu:1337/wordset/${props.match.params.id}`, {
            method: "GET"
        }).then(results => {
            return results.json()
        }).then(data => {
            let word = data.data
            this.setState({
                parentWord: word,
                availableWords: [
                    new OptionWord(word.primary_word, 0, this.addCorrect),
                    new OptionWord(word.first_distractor, 1, this.addWrong),
                    new OptionWord(word.second_distractor, 2, this.addWrong)
                ]
            })

            let newAttempt = new FormData()
            newAttempt.append("user_id", sessionStorage.getItem('user_id'))
            newAttempt.append("word_set_id", this.state.parentWord.id)
    
            fetch("http://rr.acg.maine.edu:1337/attempt/create", {
                method: "POST",
                body: newAttempt
            }).then(results => {
                return results.json()
            }).then(({ data, error }) => {
                this.setState({ attemptId: data.id })
            })

            setTimeout(() => {
                this.startRound()
            }, 500)
        })



        this.startRound = this.startRound.bind(this)
        this.addCorrect = this.addCorrect.bind(this)
        this.addWrong = this.addWrong.bind(this)
        this.playPrompt = this.playPrompt.bind(this)
        this.resetAutoPrompt = this.resetAutoPrompt.bind(this)
        this.finishAudio = this.finishAudio.bind(this)
        this.registerClick = this.registerClick.bind(this)
        this.goBack = this.goBack.bind(this)

        this.resetAutoPrompt()

        this.badClicks = 0

        this.state = {
            parentWord: null,
            attemptId: 11,
            availableWords: [
                new OptionWord("the", 0, this.addCorrect),
                new OptionWord("be", 1, this.addWrong),
                new OptionWord("of", 2, this.addWrong)
            ],
            redirect: false,
            updating: false,
            audioPrompt: "none",   // "none", "prompt word", "say word"
            audioPosition: 0,
            roundNumber: 0,        // 1 - 3
            correct: 0,            // 0 - 3
            wrong: 0,              // 0 - 3
            shownWords: []
        }
    }

    resetAutoPrompt() {
        if (this.promptTimeout) {
            clearInterval(this.promptTimeout)
        }

        this.promptTimeout = setInterval( _ => {
            this.playPrompt()
        }, 30000)
    }

    startRound() {
        let temp = []
        for (let i = 0; i < this.state.roundNumber + 1; i++) {
            temp.push(this.state.availableWords[i])
        }

        this.setState({
            updating: false,
            audioPrompt: "prompt word",
            audioPosition: 400,
            roundNumber: this.state.roundNumber + 1,
            correct: 0,
            wrong: 0,
            shownWords: temp
        })
    }

    shuffle(a) {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1))
            if (i === j) {
                i++
            } else {
                const temp = a[i]
                a[i] = a[j]
                a[j] = temp
	        }
        }

        return a
    }

    /**
     * Register a correct word. If this.state.correct === 3, start the next
     * round. Otherwise, add one to this.state.correct and shuffle the shown words.
     */
    addCorrect() {
        this.registerClick(CLICK_CORRECT)

        if(this.state.updating) return
        
        if (this.state.correct < 2) {
            let shuffledWords = this.shuffle(this.state.shownWords)

            this.setState({
                audioPrompt: "say word",
                audioPosition: 500,
                correct: this.state.correct + 1,
                wrong: 0,
                shownWords: []
            })

            setTimeout(() => {
                this.setState({
                    shownWords: shuffledWords,
                    audioPrompt: "prompt word",
                    audioPosition: 400
                })
            }, 1800)
        } else {
            this.setState({
                audioPrompt: "say word",
                audioPosition: 500,
                correct: 3,
                updating: true,
                shownWords: []
            })

            // Successful session
            if (this.state.roundNumber === 3) {
                let finishedAttempt = new FormData()
                finishedAttempt.append("attempt_id", this.state.attemptId)
                finishedAttempt.append("progress", this.w.PROGRESS_PASSED)
                
                fetch("http://rr.acg.maine.edu:1337/attempt/update", {
                    method: "POST",
                    body: finishedAttempt
                }).then(results => {
                    return results.json()
                }).then(({ data, error }) => {
                    console.log(`[QuizFrame]: Attempt error: ${error}`)
                })

                // Trigger redirect
                setTimeout(() => {
                    this.setState({ redirect: true })
                }, 1500)

            // Successful round
            } else {
                // Trigger round start
                setTimeout(() => {
                    this.startRound()
                }, 2200)
            }
            
            
        }
    }

    /**
     * Register a wrong word. If this.state.wrong === 3, return to the progress 
     * screen. If the user is on round 3, mark their progress by updating
     * progress on the word to Word.PROGRESS_ATTEMPTED. Otherwise, add one to this.state.wrong and shuffle the shown words.
     */
    addWrong() {
        this.registerClick(CLICK_WRONG)

        if (this.state.wrong < 2) {
            let shuffledWords = this.shuffle(this.state.shownWords)
            
            this.setState({
                correct: 0,
                wrong: this.state.wrong + 1,
                shownWords: []
            })

            setTimeout(() => {
                this.setState({
                    shownWords: shuffledWords,
                    audioPrompt: "prompt word",
                    audioPosition: 400
                })
            }, 1800)

        } else {
            this.setState({
                correct: 0,
                wrong: 3,
                updating: true,
                shownWords: []
            })

            if (this.state.roundNumber === 3) {
                let finishedAttempt = new FormData()
                finishedAttempt.append("attempt_id", this.state.attemptId)
                finishedAttempt.append("progress", this.w.PROGRESS_ATTEMPTED)
                
                fetch("http://rr.acg.maine.edu:1337/attempt/update", {
                    method: "POST",
                    body: finishedAttempt
                }).then(results => {
                    return results.json()
                }).then(({ data, error }) => {
                    console.log(`QUIZFRAME: Attempt error: ${error}`)
                })

                // Trigger redirect
                setTimeout(() => {
                    this.setState({ redirect: true })
                }, 1500)

            } else {
                let finishedAttempt = new FormData()
                finishedAttempt.append("attempt_id", this.state.attemptId)
                finishedAttempt.append("progress", this.w.PROGRESS_NONE)
                
                fetch("http://rr.acg.maine.edu:1337/attempt/update", {
                    method: "POST",
                    body: finishedAttempt
                })

                // Trigger redirect
                setTimeout(() => {
                    this.setState({ redirect: true })
                }, 1500)
            }
        }
    }

    playPrompt() {
        this.setState({
            audioPrompt: "prompt word"
        })
    }

    finishAudio() {
        this.setState({
            audioPrompt: "none"
        })
    }

    /**
     * Register a click somewhere on the page
     */
    registerClick(clickType) {
        /* Repeat the prompt if the user seems lost, or delay the auto
         * prompt if they seem to know what they're doing */
        if (clickType === CLICK_RANDOM) {
            if (this.badClicks > 5) {
                this.playPrompt()
                this.badClicks = 0
                this.resetAutoPrompt()
            } else {
                this.badClicks++
            }
        } else {
            this.resetAutoPrompt()
        }

        let attempt = new FormData()
        // The type of click: Correct, Wrong, or Random
        attempt.append('selection_type', clickType)
        attempt.append('round', this.state.roundNumber)
        attempt.append('attempt_id', this.state.attemptId)

        fetch(`http://rr.acg.maine.edu:1337/attempt/click/create`, {
            method: "POST",
            body: attempt
        }).then(results => {
            return results.json()
        }).then(data => {
            if (data.error) {
                console.log("QUIZFRAME: Attempt failed to post!")
            }
        })
    }

    goBack() {
        if (this.state.roundNumber > 2) {
            let finishedAttempt = new FormData()
            finishedAttempt.append("attempt_id", this.state.attemptId)
            finishedAttempt.append("progress", this.w.PROGRESS_ATTEMPTED)
            
            fetch("http://rr.acg.maine.edu:1337/attempt/update", {
                method: "POST",
                body: finishedAttempt
            }).then(results => {
                return results.json()
            }).then(({ data, error }) => {
                console.log(`QUIZFRAME: Attempt error: ${error}`)
            })
        }
        this.setState({ redirect: true })
    }

    render() {
        /* Assign modes to the StatusCircles based on this.state.correct
         * and this.state.wrong */
        let circleModes = []
        /* Either correct > 0 and wrong === 0, or correct === 0 and wrong > 0
         * So only one of these loops will run */
        for (let i = 0; i < this.state.correct; i++) {
            circleModes[i] = "correct"
        }
        for (let i = 0; i < this.state.wrong; i++) {
            circleModes[i] = "wrong"
        }

        if (this.state.redirect) {
            return <Redirect to="/student" />
        } else {
            return (
                <div className="Quiz" >
                    <div className="Quiz-background" onClick={this.registerClick.bind(this, CLICK_RANDOM)} />
                    <QuizOptions showCards={this.state.showCards} words={this.state.shownWords} />
                    <div className="Quiz-bottom">
                        <IconButton icon={iconHome} onClick={(e) => this.goBack()} />
                        <div className="Quiz-status" onClick={this.registerClick.bind(this, CLICK_RANDOM)}>
                            <StatusCircle mode={circleModes[0]}/>
                            <StatusCircle mode={circleModes[1]}/>
                            <StatusCircle mode={circleModes[2]}/>
                        </div>
                        <Sound
                            url={this.state.parentWord !== null ? this.state.parentWord.audio_file_descriptive : ""}
                            playStatus={this.state.audioPrompt === "prompt word" 
                                ? Sound.status.PLAYING : Sound.status.STOPPED }
                            playFromPosition={this.state.audioPosition}
                            onFinishedPlaying={this.finishAudio}
                        />
                        <Sound
                            url={this.state.parentWord !== null ? this.state.parentWord.audio_file : ""}
                            playStatus={this.state.audioPrompt === "say word" 
                                ? Sound.status.PLAYING : Sound.status.STOPPED }
                            playFromPosition={this.state.audioPosition}
                            onFinishedPlaying={this.finishAudio}
                        />
                        <IconButton icon={iconAudio} onClick={this.playPrompt} />
                    </div>
                </div>
            )
        }
    }
}

const QuizCard = posed.button({
    enter: { 
        scale: 1,
        opacity: 1,
        transition: { duration: 200 }
     },
    hovered: {
        scale: 1.07,
        transition: { duration: 100 }
    },
    exit: { 
        scale: 0,
        opacity: 0,
        transition: { duration: 250 }
     } 
})

class QuizOptions extends Component {
    constructor(props) {
        super(props)
        
        this.state = {
            hovered: [],
            wordCount: props.words.length
        }
    }

    render() {
        return(
            <div className="Quiz-options">
                <PoseGroup>
                    {this.props.words.map((word) => {
                        return(
                            <QuizCard
                                key={word.key}className={"card-quiz" + (word.text === "I" ? " letter-I" : "")}
                                onClick={word.onClick}
                                onMouseEnter={() => {
                                    // es-lint
                                    this.state.hovered[word.key] = true
                                    this.setState({ hovered: this.state.hovered })
                                }}
                                onMouseLeave={() => {
                                    this.state.hovered[word.key] = false
                                    this.setState({ hovered: this.state.hovered })
                                }}
                                pose={this.state.hovered[word.key] ? "hovered" : "enter"}
                            >
                                {word.text}
                            </QuizCard>
                        )
                    })}
                </PoseGroup>
            </div>
        )
    }
}
QuizOptions.propTypes = {
    words: PropType.arrayOf(PropType.instanceOf(OptionWord)),
    showCards: PropType.bool
}

export default QuizFrame
