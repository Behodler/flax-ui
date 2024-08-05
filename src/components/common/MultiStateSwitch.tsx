import React, { useEffect, useState } from "react";
import { Container, Box } from "@mui/material";
import {
    StyledToggleButtonGroup,
    StyledToggleButton,

} from "./StyledComponents";
import _ from "lodash";

interface Category {
    text: string,
    value: string
}
interface SwitchProps {
    categories: Category[],
    selectedVals: string[],
    setSelectedVal: (newVals: string[]) => void
}
const MultiStateSwitch = (props: SwitchProps) => {

    const handleSelectedValue = (event: React.MouseEvent<HTMLElement>, newSelectedValue: string[] | null) => {
        if (newSelectedValue !== null) {
            props.setSelectedVal(newSelectedValue);
        } else props.setSelectedVal([]);
    };
    const scale = 5;

    const Buttons = props.categories.map(cat => (
        <StyledToggleButton key={cat.value} value={cat.value} aria-label="center aligned">
            {cat.text}
        </StyledToggleButton>
    ))

    return (

        <Box>
            <StyledToggleButtonGroup
                value={props.selectedVals}
                onChange={handleSelectedValue}
                aria-label="multi-state switch"
            >
                {Buttons}
            </StyledToggleButtonGroup>
        </Box>
    );
};

export default MultiStateSwitch;
