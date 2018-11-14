const filterBySet = (set, data) => {
  let results = data
  const [head, ...tail] = set
  const [key, value] = head || []
  if (value) {
    const type = Array.isArray(value) ? 'array' : typeof value
    switch (type) {
      case 'string': {
        const lcValue = value.toLowerCase()
        if (value.endsWith('*')) {
          const eValue = lcValue.split('').slice(0, -1).join('')
          results = data.filter(item => item[key].toLowerCase().startsWith(eValue))
        }
        else if (value.startsWith('*')) {
          const sValue = lcValue.substr(1)
          results = data.filter(item => item[key].toLowerCase().includes(sValue))
        }
        else results = data.filter(item => item[key].toLowerCase() === lcValue)
        break
      }
      case 'number':
      // eslint-disable-next-line
        results = data.filter(item => item[key] == value)
        break
      case 'array': {
        if (value.length) {
          // duck type test - looking for recusion into multi sets
          if (value[0][0] === key) {
            results = value.reduce((acc, value) => ([...acc, ...filterBySet([[key, value[1]]], data)]), [])
          }
          else {
            results = data.filter(item => item[key] >= value[0] && item[key] <= value[1])
          }
        }
        break
      }
      default:
        // ignore unrecognised value type
        results = data
    }
  }

  if (tail.length) return filterBySet(tail, results)
  return results
}

module.exports = filterBySet
