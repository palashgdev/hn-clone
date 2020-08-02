import 'chart.js'
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { LineChart } from 'react-chartkick'

import { NEWS_STORAGE_KEY } from '../../constants'

class Graph extends PureComponent {
  render() {
    const statistics = []
    const { results } = this.props

    for (let i = 0; i < results.length; i += 1) {
      const id = results[i].id.toString()

      const storageItem = localStorage.getItem(NEWS_STORAGE_KEY + id)
      const parsedItem = JSON.parse(storageItem)
      const votes = parsedItem !== null ? parsedItem.vote_count : 0

      const item = { [id]: votes }
      statistics.push(item)
    }
    const graphItems = JSON.stringify(statistics)
      .replace(/[{}]/g, '')
      .replace('[', '{')
      .replace(']', '}')

    const data = JSON.parse(graphItems)

    return (
      <>
        <div className="news-feed-line-chart-container">
          <div>
            <p className="line-chart-votes-label">Votes</p>
          </div>
          <LineChart data={data} />
        </div>
        <div className="line-chart-id-div">
          <p className="line-chart-id-label">ID</p>
        </div>
        <div className="news-feed-bottom-div"></div>
      </>
    )
  }
}

Graph.propTypes = {
  results: PropTypes.arrayOf({
    id: PropTypes.string.isRequired,
  }),
}

export default Graph
