export type CellData = {
  sql: string
  result: { fields: string[], data: object[] } | null
  errorMessage: string | null
}

export const saveCellData = (id: string, cellData: CellData) => {
  localStorage.setItem(`cell:${id}`, JSON.stringify(cellData))
}

export const saveCellIDs = (cellIDs: string[]) => {
  localStorage.setItem('cellIDs', JSON.stringify(cellIDs))
}

export const deleteCellData = (id: string) => {
  localStorage.removeItem(`cell:${id}`)
}
