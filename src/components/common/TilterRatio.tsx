import React, { useState } from "react";
import { Container, Box, Tooltip } from "@mui/material";
import {
    ImageBox,
    Image,
    Bar,
    BarLeft,
    BarRight,
} from "./StyledComponents";

const TilterRatio  = (props:{title:string}) => {

    const scale = 4;
    return (
        <Tooltip title={props.title}>
            <div >
                <ImageBox scale={scale}>
                    <Image scale={scale}
                        src="https://flax.behodler.io/static/media/FlaxSmall.de087b6a39e50f4b03b8.png"
                        alt="Behodler"
                    />
                    <Bar scale={scale}>
                        <BarLeft width="33%" color="#FFA726" scale={scale} />
                        <BarRight width="66%" color="#42A5F5" scale={scale} />
                    </Bar>
                    <Image scale={scale}
                        src="https://seeklogo.com/images/E/ethereum-logo-EC6CDBA45B-seeklogo.com.png"
                        alt="Ethereum"
                    />
                </ImageBox>
            </div>
        </Tooltip>
    );
};

export default TilterRatio;
