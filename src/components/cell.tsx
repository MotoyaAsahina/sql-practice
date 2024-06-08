import { Delete } from '@mui/icons-material'
import { Box, IconButton, TextField, Typography } from '@mui/material'
import { Roboto_Mono } from 'next/font/google'
import { useState } from 'react'

const robotoMono = Roboto_Mono({ subsets: ['latin'] })

type CellProps = {
  index: number
}

export default function Cell(props: CellProps) {
  const howToExecute = process.platform === 'win32' ? 'Ctrl + Enter' : 'Cmd + Enter'

  const [hovered, setHovered] = useState(false)
  const [inputSQL, setInputSQL] = useState('')

  const executeSQL = () => {
    if (!inputSQL.trim()) {
      return
    }

    console.log(inputSQL)
  }

  return (
    <>
      <Box
        sx={[
          {
            p: '10px',
            borderRadius: '5px',
          },
          {
            ':hover': {
              bgcolor: '#f9f9f9',
            },
          },
        ]}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: '4px',
        }}
        >
          <Typography>
            [
            {props.index}
            ]
          </Typography>
          <IconButton
            sx={{
              visibility: hovered ? 'visible' : 'hidden',
            }}
          >
            <Delete />
          </IconButton>
        </Box>
        <TextField
          label="SQL"
          multiline
          minRows={3}
          size="small"
          fullWidth
          helperText={`Press \`${howToExecute}\` to execute the query.`}
          inputProps={{
            style: {
              fontFamily: robotoMono.style.fontFamily,
            },
          }}
          value={inputSQL}
          onChange={e => setInputSQL(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
              executeSQL()
            }
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
