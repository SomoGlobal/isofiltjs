const td = require('testdouble')
const isofilt = require('.')

require('testdouble-jest')(td, jest)

describe('isfilt', () => {
  const data = [
    { _modelOfInterest: 'm1', _name: 'na1', _timestamp: 1 },
    { _modelOfInterest: 'm2', _name: 'nb2', _timestamp: 2 },
    { _modelOfInterest: 'm2', _name: 'nc4', _timestamp: 3 },
    { _modelOfInterest: 'm3', _name: 'nd3', _timestamp: 4 }
  ]

  it('should apply a single filter to results returned from the repository', async () => {
    const results = await isofilt([['_modelOfInterest', 'm2']], data)

    expect(results).toEqual([
      { _modelOfInterest: 'm2', _name: 'nb2', _timestamp: 2 },
      { _modelOfInterest: 'm2', _name: 'nc4', _timestamp: 3 }
    ])
  })

  it('should apply multiple filters (OR) to results returned from the repository', async () => {
    const results = await isofilt([['_modelOfInterest', ['m2', 'm3']]], data)

    expect(results).toEqual([
      { _modelOfInterest: 'm2', _name: 'nb2', _timestamp: 2 },
      { _modelOfInterest: 'm2', _name: 'nc4', _timestamp: 3 },
      { _modelOfInterest: 'm3', _name: 'nd3', _timestamp: 4 }
    ])
  })

  it('should apply different filters (AND) to results returned from the repository', async () => {
    const results = await isofilt([['_modelOfInterest', 'm2'], ['_name', 'nb2']], data)

    expect(results).toEqual([
      { _modelOfInterest: 'm2', _name: 'nb2', _timestamp: 2 }
    ])
  })

  it('should apply multiple AND differentfilters to results returned from the repository', async () => {
    const results = await isofilt([['_modelOfInterest', ['m2', 'm3']], ['_name', 'nb2']], data)

    expect(results).toEqual([
      { _modelOfInterest: 'm2', _name: 'nb2', _timestamp: 2 }
    ])
  })

  it('should select any filter that MATCHES', async () => {
    const results = await isofilt([['_name', 'nb2']], data)

    expect(results).toEqual([
      { _modelOfInterest: 'm2', _name: 'nb2', _timestamp: 2 }
    ])
  })

  it('should select any filter that STARTS WITH', async () => {
    const results = await isofilt([['_name', 'nb*']], data)

    expect(results).toEqual([
      { _modelOfInterest: 'm2', _name: 'nb2', _timestamp: 2 }
    ])
  })

  it('should select any filter that CONTAINS', async () => {
    const results = await isofilt([['_name', '*nb']], data)

    expect(results).toEqual([
      { _modelOfInterest: 'm2', _name: 'nb2', _timestamp: 2 }
    ])
  })

  it('should select any filter that contains UPPERCASE', async () => {
    const results = await isofilt([['_name', 'NB2']], data)

    expect(results).toEqual([
      { _modelOfInterest: 'm2', _name: 'nb2', _timestamp: 2 }
    ])
  })

  it('should select any numeric filter', async () => {
    const results = await isofilt([['_timestamp', 2]], data)

    expect(results).toEqual([
      { _modelOfInterest: 'm2', _name: 'nb2', _timestamp: 2 }
    ])
  })

  it('should select any numeric range filter', async () => {
    const results = await isofilt([['_timestamp', [2, 3]]], data)

    expect(results).toEqual([
      { _modelOfInterest: 'm2', _name: 'nb2', _timestamp: 2 },
      { _modelOfInterest: 'm2', _name: 'nc4', _timestamp: 3 }
    ])
  })

  it('should handle empty data', async () => {
    const results = await isofilt([['_modelOfInterest', 'm2']], [])

    expect(results).toEqual([])
  })
  it('should handle empty sets', async () => {
    const results = await isofilt([], data)

    expect(results).toEqual(data)
  })
  it('should handle orphaned sets', async () => {
    const results = await isofilt([['_modelOfInterest', []]], data)

    expect(results).toEqual(data)
  })
})
