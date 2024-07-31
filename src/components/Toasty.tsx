import React, { useEffect, useState } from 'react';
import toasty from "../images/toasty.png"
import sound from '../sounds/toasty.mp3';
export default function Toasty(props: { show: boolean, setShow: (v: boolean) => void }) {

    const [animationStarted, setAnimationStarted] = useState<boolean>(false)
    const [left, setLeft] = useState<number>(-100)
    const animationSpeed = 30
    useEffect(() => {
        if (props.show && !animationStarted) {
            const animateToasty = (position: number, delta: number) => {
                if (delta > 0 && position < 0) {
                    setLeft(position + delta)
                    setTimeout(() => animateToasty(position + delta, delta), animationSpeed);
                    return
                } else if (delta > 0 && position >= 0) {
                    setTimeout(() => animateToasty(position - delta, -delta), 800);
                    return
                } else if (delta < 0 && position > -100) {
                    setLeft(position + delta)
                    setTimeout(() => animateToasty(position + delta, delta), animationSpeed);
                    return
                }
                else if (position <= -100 && delta < 0) {
                    setAnimationStarted(false)
                    props.setShow(false)

                }
            }
            const audio = new Audio(sound);
            audio.play();
            animateToasty(-80, 10);
            setAnimationStarted(true)
        }

    }, [props.show])
    return <div>
        <img src={toasty} width="100px" style={{ position: "fixed", bottom: 0, left: left }} />

    </div>
}