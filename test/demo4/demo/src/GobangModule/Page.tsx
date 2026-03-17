import React  from "react";
import Styles from "../layouts/page.less"
import Gobang from "@/GobangModule/Gobang"
export default function Page1(){
    return (
        <div className={Styles.main}>
            <div className={Styles.header}>
                <h1>Let's play a game.</h1>
            </div>
            <div className={Styles.body}>
                <Gobang />
            </div>
            <div className={Styles.footer}>
                
            </div>
        </div>
    )
}