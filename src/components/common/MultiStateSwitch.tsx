import React, { useState } from "react";
import { Container, Box } from "@mui/material";
import {
  StyledToggleButtonGroup,
  StyledToggleButton,
  ImageBox,
  Image,
  Bar,
  BarLeft,
  BarRight,
} from "./StyledComponents";

const MultiStateSwitch: React.FC = () => {
  const [alignment, setAlignment] = useState<string[]>([]);

  const handleAlignment = (event: React.MouseEvent<HTMLElement>, newAlignment: string[] | null) => {
    if (newAlignment !== null) {
      setAlignment(newAlignment);
    } else setAlignment([]);
  };

  return (
    <Container sx={{ backgroundColor: "#1D2833", height: 300 }}>
      <h1 style={{ color: "white" }}>{JSON.stringify(alignment, null, 4)}</h1>
      <Box>
        <StyledToggleButtonGroup
          value={alignment}
          onChange={handleAlignment}
          aria-label="multi-state switch"
        >
          <StyledToggleButton value="Behodler" aria-label="left aligned">
            Behodler
          </StyledToggleButton>
          <StyledToggleButton value="Blue Chip" aria-label="center aligned">
            Blue Chip
          </StyledToggleButton>
          <StyledToggleButton value="Meme" aria-label="right aligned">
            Meme
          </StyledToggleButton>
        </StyledToggleButtonGroup>
      </Box>
      <ImageBox>
        <Image
          src="https://flax.behodler.io/static/media/FlaxSmall.de087b6a39e50f4b03b8.png"
          alt="Behodler"
        />
        <Bar>
          <BarLeft width="33%" color="#FFA726" />
          <BarRight width="66%" color="#42A5F5" />
        </Bar>
        <Image
          src="https://seeklogo.com/images/E/ethereum-logo-EC6CDBA45B-seeklogo.com.png"
          alt="Ethereum"
        />
      </ImageBox>
    </Container>
  );
};

export default MultiStateSwitch;
