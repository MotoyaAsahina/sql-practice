import { Add } from '@mui/icons-material'
import { Box, IconButton, Typography } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

import Cell from '@/components/Cell'
import { CellData, saveCellIDs } from '@/lib/local_save'

export default function Home() {
  const [cells, setCells] = useState<CellData[]>([])
  const [cellIDs, setCellIDs] = useState<string[]>([])

  // Load saved cells from localStorage
  useEffect(() => {
    const saveDCellIDsStr = localStorage.getItem('cellIDs')
    if (!saveDCellIDsStr || !JSON.parse(saveDCellIDsStr).length) {
      setCells([{ sql: '', result: null, errorMessage: null }])
      const newID = [uuidv4()]
      setCellIDs(newID)
      saveCellIDs(newID)
      return
    }

    const savedCellIDs = JSON.parse(saveDCellIDsStr)
    setCellIDs(savedCellIDs)

    const newCells: CellData[] = []
    savedCellIDs.forEach((id: string) => {
      const savedCell = localStorage.getItem(`cell:${id}`)
      if (savedCell) {
        newCells.push(JSON.parse(savedCell))
      }
      else {
        newCells.push({ sql: '', result: null, errorMessage: null })
      }
    })
    setCells(newCells)
  }, [])

  const cellsListDiv = useRef<HTMLDivElement | null>(null)

  const addCell = () => {
    setCells(prev => [...prev, { sql: '', result: null, errorMessage: null }])
    const newCellIDs = [...cellIDs, uuidv4()]
    setCellIDs(newCellIDs)
    saveCellIDs(newCellIDs)

    setTimeout(() => {
      cellsListDiv.current?.scrollIntoView({
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
            cellsListDiv.current = node
          }}
        >
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
          }}
          >
            {
              cells.map((cell, i) => (
                <Cell
                  key={i}
                  id={cellIDs[i]}
                  index={i + 1}
                  defaultCellData={cell}
                />
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
