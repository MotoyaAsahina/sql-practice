import { Add } from '@mui/icons-material'
import { Box, IconButton, Typography } from '@mui/material'
import React, { useRef, useState } from 'react'

import Cell from '@/components/Cell'

export default function Home() {
  const [cellLen, setCellLen] = useState(1)

  const cellsList = useRef<null | HTMLDivElement>(null)

  const addCell = () => {
    setCellLen(cellLen + 1)

    setTimeout(() => {
      cellsList.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
        inline: 'nearest',
      })
    }, 0.001)
  }

  return (
    <>
      <main>
        <Box
          sx={[
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
          ref={(node: HTMLDivElement) => {
            cellsList.current = node
          }}
        >
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
          }}
          >
            {
              Array(cellLen).fill(0).map((_, i) => (
                <Cell key={i} index={i + 1} />
              ))
            }
          </Box>
          <Box sx={[
            {
              display: 'flex',
              alignItems: 'center',
              mt: '20px',
              px: '10px',
              py: '4px',
              gap: '10px',
              borderRadius: '5px',
            },
            {
              ':hover': {
                bgcolor: '#f9f9f9',
              },
            },
          ]}
          >
            <IconButton onClick={addCell}>
              <Add />
            </IconButton>
            <Typography>
              Create a new SQL
            </Typography>
          </Box>
        </Box>
      </main>
    </>
  )
}
