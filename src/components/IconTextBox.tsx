import { TextField, InputAdornment, Button, Box, Typography, Grid } from '@mui/material';

export type invalidReasons = "" | "Invalid Input" | "Exceeds Balance"|"Insufficient Flax on Issuer"

interface IconTextBoxProps {
    cornerImage: JSX.Element
    text: string,
    setText: (val: string) => void
    max: string
    invalidReason: invalidReasons
    dollarValueOfInput: string | undefined
}

const IconTextBox = (props: IconTextBoxProps) => {
    let textToDisplay = props.text.trim() === "0" ? "" : props.text
    textToDisplay = textToDisplay.trim() === "." ? "0." : textToDisplay
    return (
        <Box sx={{ width: 360, display: 'flex', flexDirection: 'column', alignItems: 'end', position: 'relative' }}>
            <Box sx={{ position: 'absolute', top: '20px', left: '0' }}>
                {props.cornerImage}
            </Box>
            <TextField
                variant="standard"
                fullWidth
                placeholder=""
                value={textToDisplay}
                onChange={(event) => {
                    if (event.target.value.trim() === "")
                        props.setText("0")
                    props.setText(event.target.value);

                }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            {/* Transparent placeholder to offset text properly */}
                            <div style={{ width: 40, height: 40 }} />
                        </InputAdornment>
                    ),
                    sx: {
                        paddingLeft: '10px', // Space to prevent text overlap with the image
                        '& input': {
                            textAlign: 'right', // Align text to the right
                        }
                    }
                }}
                sx={{
                    '& .MuiInput-underline:before': {
                        borderBottomColor: 'rgba(0, 0, 0, 0.42)', // Default underline color
                    },
                    '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
                        borderBottomColor: 'rgba(0, 0, 0, 0.87)', // Hover underline color
                    },
                    '& .MuiInput-underline:after': {
                        borderBottomColor: 'primary.main', // Focused underline color
                    },
                    '& .MuiInput-input': {
                        height: '1.1876em' // Adjust the height to match your design needs
                    },
                    marginTop: '40px', // Adjusting the top margin to accommodate the image
                    height: '50px' // Adjusting field height for proper visual balance
                }}
            />
            <Grid container alignItems="center" spacing={1}>

                <Grid item xs={8}>
                    <Typography variant='h5' sx={{ color: 'forestgreen', mt: 1, margin: "-20px 0 0 0" }}>
                        {props.dollarValueOfInput ? `\$${props.dollarValueOfInput}` : '\$0.0000'}
                    </Typography>
                </Grid>
                <Grid item xs={8}>
                    {props.invalidReason !== "Invalid Input" ? <Typography variant='h6' sx={{ color: 'red', mt: 1, margin: "-20px 0 0 0" }}>
                        {props.invalidReason}
                    </Typography> : <></>}

                </Grid>

                <Grid item xs={4} sx={{ textAlign: 'right' }}>
                    <Button onClick={() => props.setText(props.max)} size="small" sx={{ minWidth: 'auto', padding: 0, fontSize: '0.75rem' }}>MAX</Button>
                </Grid>
            </Grid>

        </Box>
    );
};

export default IconTextBox;
