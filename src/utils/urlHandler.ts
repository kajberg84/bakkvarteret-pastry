export const createSearchString = (fields: string) => {

  let fieldsString = ''

  fields = fields.replace(/[\(\)]/g, '')
  const fieldsArray = fields.split(',')
  const trimedArray = fieldsArray.map((field) => field.trim())
  trimedArray.forEach((field) => {
    fieldsString += field + ' '
  })

  return fieldsString
}
