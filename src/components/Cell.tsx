import { Delete, ErrorOutline } from '@mui/icons-material'
import { Box, IconButton, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow, TextField, Typography } from '@mui/material'
import { Roboto_Mono } from 'next/font/google'
import { useContext, useEffect, useMemo, useState } from 'react'

import { CellData } from '@/lib/local_save'
import { CellContext } from '@/pages'

const robotoMono = Roboto_Mono({ subsets: ['latin'] })

type CellProps = {
  index: number
  id: string
  defaultCellData: CellData
}

export default function Cell(props: CellProps) {
  const ua = window.navigator.userAgent.toLowerCase()
  const howToExecute = ua.indexOf('windows nt') !== -1 ? 'Ctrl + Enter' : 'Cmd + Enter'

  const [hovered, setHovered] = useState(false)
  const [savedSQL, setSavedSQL] = useState(props.defaultCellData.sql)
  const [inputSQL, setInputSQL] = useState(props.defaultCellData.sql)
  const [result, setResult] = useState<{ fields: string[], data: object[] } | null>(props.defaultCellData.result)
  const [errMessage, setErrMessage] = useState<string | null>(props.defaultCellData.errorMessage)

  const { updateCell, deleteCell } = useContext(CellContext)

  useEffect(() => {
    // Do not rollback the inputSQL when other cells are updated
    // setInputSQL(props.defaultCellData.sql)
    setSavedSQL(props.defaultCellData.sql)
    setResult(props.defaultCellData.result)
    setErrMessage(props.defaultCellData.errorMessage)
  }, [props])

  const executeSQL = () => {
    if (!inputSQL.trim()) {
      return
    }

    fetch('/api/exec', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sql: inputSQL }),
    })
      .then(res => res.json())
      .then((data) => {
        if (data.errorMessage) {
          updateCell(props.index, { sql: inputSQL, result: null, errorMessage: data.errorMessage })
          return
        }
        updateCell(props.index, { sql: inputSQL, result: data, errorMessage: null })
      })
      .catch((error) => {
        const errMessage = `Failed to execute the query. error: ${error}`
        updateCell(props.index, { sql: inputSQL, result: null, errorMessage: errMessage })
      })
  }

  const [tableHeader, tableBody] = useMemo(() => {
    if (!result || !result.data.length) {
      return [null, null]
    }

    return [
      (
        <TableRow key="header">
          {result.fields.map((field: string) => (
            <TableCell
              key={field}
              align="left"
              sx={{
                width: 'auto',
                maxWidth: '100px',
              }}
            >
              {field}
            </TableCell>
          ))}
        </TableRow>
      ),
      result.data.map((row: object, i: number) => (
        <TableRow key={i}>
          {Object.values(row).map((value: string, j: number) => (
            <TableCell key={j}>
              {value}
            </TableCell>
          ))}
        </TableRow>
      )),
    ]
  }, [result])

  return (
    <>
      <Box
        sx={[
          {
            px: '20px',
            py: '10px',
            borderRadius: '5px',
          },
          {
            ':hover': {
              bgcolor: '#fbfbfb',
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
          <Typography color="rgba(0, 0, 0, 0.87)">
            [
            {props.index + 1}
            ]
            {inputSQL === savedSQL ? '' : ' *'}
          </Typography>
          <IconButton
            sx={{
              visibility: hovered ? 'visible' : 'hidden',
            }}
            onClick={deleteCell(props.index)}
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
          sx={{
            '& .MuiOutlinedInput-root': {
              bgcolor: '#fff',
            },
          }}
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
          mt: '10px',
          p: '10px',
          borderRadius: '5px',
          bgcolor: '#fdebeb',
          display: errMessage ? 'flex' : 'none',
        }}
        >
          <ErrorOutline
            sx={{
              mt: '1px',
            }}
            fontSize="small"
          />
          <Typography sx={{
            ml: '10px',
          }}
          >
            {errMessage}
          </Typography>
        </Box>
        <TableContainer sx={{
          width: '100%',
          maxHeight: '402px',
          mt: '14px',
          display: result && !errMessage ? 'block' : 'none',
        }}
        >
          <Table
            stickyHeader
            size="small"
            sx={{
              overflowX: 'scroll',
            }}
          >
            <TableHead>
              {tableHeader}
            </TableHead>
            <TableBody>
              {tableBody}
            </TableBody>
            <TableFooter sx={{
              position: 'sticky',
              bottom: 0,
              bgcolor: 'rgba(255, 255, 255, 0.9)',
            }}
            >
              <TableRow>
                <TableCell
                  colSpan={result ? result.fields.length : 1}
                >
                  {result ? `${result.data.length} rows in set` : ''}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </Box>
    </>
  )
}
