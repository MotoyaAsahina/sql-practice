import { Add } from '@mui/icons-material'
import { Box, IconButton, Typography } from '@mui/material'
import React, { createContext, useEffect, useRef, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

import Cell from '@/components/Cell'
import { CellData, deleteCellData, saveCellData, saveCellIDs } from '@/lib/local_save'

export const CellContext = createContext<{
  updateCell: (index: number, cellData: CellData) => void
  deleteCell: (index: number) => () => void
}>({
      updateCell: () => {},
      deleteCell: () => () => {},
    })

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
  const cellDivs = useRef<Map<string, HTMLDivElement | null>>(new Map())

  const addCell = () => {
    setCells(prev => [...prev, { sql: '', result: null, errorMessage: null }])
    const newIDs = [...cellIDs, uuidv4()]
    setCellIDs(newIDs)
    saveCellIDs(newIDs)

    setTimeout(() => {
      const lastCell = cellDivs.current.get(newIDs[newIDs.length - 1])
      const textField = lastCell?.querySelector('textarea')
      textField?.focus()

      cellsListDiv.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
        inline: 'nearest',
      })
    }, 0.001)
  }

  const updateCell = (index: number, cellData: CellData) => {
    const id = cellIDs[index]
    const newCells = cells.map((cell, i) => i === index ? cellData : cell)
    setCells(newCells)
    saveCellData(id, cellData)
  }

  const deleteCell = (index: number) => () => {
    const id = cellIDs[index]
    const newIDs = cellIDs.filter((_, i) => i !== index)
    const newCells = cells.filter((_, i) => i !== index)
    setCellIDs(newIDs)
    setCells(newCells)
    saveCellIDs(newIDs)
    deleteCellData(id)
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
            gap: '18px',
          }}
          >
            <CellContext.Provider value={{ updateCell, deleteCell }}>
              {
                cells.map((cell, i) => (
                  <Box
                    key={i}
                    ref={(node: HTMLDivElement) => {
                      cellDivs.current.set(cellIDs[i], node)
                    }}
                  >
                    <Cell
                      id={cellIDs[i]}
                      index={i}
                      defaultCellData={cell}
                    />
                  </Box>
                ))
              }
            </CellContext.Provider>
          </Box>
          <Box sx={[
            {
              display: 'flex',
              alignItems: 'center',
              mt: '18px',
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
