import { Add } from '@mui/icons-material'
import { Box, IconButton, Typography } from '@mui/material'
import { useState } from 'react'

import Cell from '@/components/cell'

export default function Home() {
  const [cellLen, setCellLen] = useState(1)

  const addCell = () => {
    setCellLen(cellLen + 1)
  }

  return (
    <>
      <main>
        <Box sx={[
          {
            width: '100%',
            height: '100%',
            maxWidth: '1000px',
            mx: 'auto',
            py: '20px',
            px: '44px',
          },
          {
            '@media (max-width: 1000px)': {
              px: '4%',
            },
          },
        ]}
        >
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
          >
            {
              Array(cellLen).fill(0).map((_, index) => (
                <Cell key={index} />
              ))
            }
          </Box>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            mt: '20px',
            px: '10px',
            gap: '10px',
          }}
          >
            <IconButton onClick={addCell}>
              <Add />
            </IconButton>
            <Typography>
              Create a new cell
            </Typography>
          </Box>
        </Box>
      </main>
    </>
  )
}
