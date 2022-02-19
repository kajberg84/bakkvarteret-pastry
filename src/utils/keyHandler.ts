// @ts-nocheck

import fs from 'fs'
import path from 'path'

/**
 * Read keys from file.
 *
 * @param { string } filePath - Relative urlpath.
 * @returns { string } - Secret key.
 */

export const getKey = (keyName) => {
  try {
    const keyPath = path.join(__dirname, '../../keys/' + keyName)
    const key = fs.readFileSync(keyPath, 'utf8')
    return key
  } catch (error) {
    console.log('error i getKey: ', error)
  }
}
