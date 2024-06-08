import { Delete } from '@mui/icons-material'
import { Box, IconButton, TextField, Typography } from '@mui/material'
import { Roboto_Mono } from 'next/font/google'

const robotoMono = Roboto_Mono({ subsets: ['latin'] })

export default function Cell() {
  const howToSend = process.platform === 'win32' ? 'Ctrl + Enter' : 'Cmd + Enter'

  return (
    <>
      <Box sx={[
        {
          p: '10px',
          border: '1px solid #fff',
          borderRadius: '5px',
        },
        {
          ':hover': {
            border: '1px solid #000',
          },
        },
      ]}
      >
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: '4px',
        }}
        >
          <Typography>
            [1]
          </Typography>
          <IconButton>
            <Delete />
          </IconButton>
        </Box>
        <TextField
          label="SQL"
          multiline
          minRows={3}
          size="small"
          fullWidth
          helperText={`Press \`${howToSend}\` to execute the query.`}
          inputProps={{
            style: {
              fontFamily: robotoMono.style.fontFamily,
            },
          }}
        />
        <Box sx={{
          width: '100%',
          height: '300px',
          mt: '10px',
          border: '1px solid #000',
        }}
        >
        </Box>
      </Box>
    </>
  )
}
