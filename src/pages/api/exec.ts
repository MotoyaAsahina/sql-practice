import { RowDataPacket } from 'mysql2'

import conn from '@/lib/db'

import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<unknown>,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' })
  }

  conn.query<RowDataPacket[]>(req.body.sql, (err, rows) => {
    if (err) {
      res.status(200).json({ errorMessage: err.message })
    }
    res.status(200).json({ fields: Object.keys(rows[0] ?? []), data: rows })
  })
}
