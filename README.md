# Isomorphic Filter for nodejs

## Requirements
- node > 8

## Setup

`npm install`

## Test

Start a TDD test watcher using jest<br/>
`npm test`

## usage
```
const filters = [
  [name, 'Ms'],
  [date, [ticks1, ticks2]]
]

const data = [
  {name: 'Ms X', zipcode: 88765, date: ticks1},
  {name: 'Mr Y', zipcode: 88766, date: ticks2},
  {name: 'Ms Z', zipcode: 88766, date: ticks1}
]

const isofilt = require('isofiltjs')

const filteredData = isofiltjs(filters, data) // [{name: Ms X,...}]

// filter value kinds
// String value equals: 'abc'
// String value starts with: 'ab*'
// String value contains: '*ab'
// Number range: [1, 100]

// recursive filtering
// [key, [key, [v1, v2, ..]]]
```
