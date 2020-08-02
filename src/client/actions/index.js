/* eslint-disable no-await-in-loop */
/* eslint-disable no-loop-func */
/* eslint-disable prettier/prettier */
import {
    BASE_URL,
    ITMES,
    FETCH_NEWS_FEED,
    SET_UPVOTE_COUNT,
    NEWS_STORAGE_KEY,
    NEWS_FEED_SHOW,
    NEWS_FEED_HIDE,
} from '../constants'

import 'regenerator-runtime/runtime';

export const dispatchNewsFeeds = (data) => ({
    type: FETCH_NEWS_FEED,
    payload: data,
})

export const fetchNewsFeed = (start, end) => async (dispatch) => {
    console.log(`fetchNewsFeed....${start} == ${end}`)

    const feeds = []
    for (var i = start; i < end; i++) {
        await fetch(BASE_URL + ITMES + parseInt(i))
            .then((response) => response.json())
            .then((data) => {
                const results = JSON.parse(JSON.stringify(data))

                const { title } = results
                if (title != null) {
                    const { id } = results
                    const { author } = results
                    const { url } = results
                    const timeStamp = results.created_at_i
                    const vote_count = results.points
                    const commentCount = results.children.length

                    const date = new Date(timeStamp * 1000)
                    const posted_time = `${date.getMonth()}/${date.getDay()}/${date.getFullYear()}`

                    const storage_item = localStorage.getItem(NEWS_STORAGE_KEY + id)
                    const parse_storage_item = JSON.parse(storage_item)

                    const vote_storage_count =
                        parse_storage_item != null ? parse_storage_item.vote_count : 0
                    const show_hide_status =
                        parse_storage_item != null &&
                            parse_storage_item.hide &&
                            parse_storage_item.hide === NEWS_FEED_HIDE
                            ? NEWS_FEED_HIDE
                            : NEWS_FEED_SHOW

                    if (show_hide_status === NEWS_FEED_SHOW) {
                        const news_results = {
                            id,
                            title,
                            author,
                            time: posted_time,
                            url,
                            vote_count:
                                vote_storage_count > vote_count
                                    ? vote_storage_count
                                    : vote_count,
                            comments: commentCount,
                            hide: show_hide_status,
                        }
                        feeds.push(news_results)
                        localStorage.setItem(
                            NEWS_STORAGE_KEY + id,
                            JSON.stringify(news_results),
                        )
                        dispatch(dispatchNewsFeeds(feeds))
                    }
                }
            })
            .catch((error) => {
                console.log(`Error Feed -- ${i} == ${JSON.stringify(error)}`)
            })
    }
}

export const dispatchVoteCount = (count) => ({
    type: SET_UPVOTE_COUNT,
    payload: count,
})

export const setUpVoteCount = (vote) => (dispatch) => {
    console.log(`Vote : setUpVoteCount Redux = ${JSON.stringify(vote)}`)
    dispatch(dispatchVoteCount(vote))
}

export const hideNewsFeed = (feeds, id) => (dispatch) => {
    if (feeds != null) {
        const parseHide = JSON.parse(JSON.stringify(feeds))
        if (parseHide !== undefined) {
            const { news } = parseHide
            const index = news.findIndex((el) => el.id === id)
            const item = news[index]
            news.splice(index, 1)

            const hide_results = {
                id: item.id,
                title: item.title,
                author: item.author,
                time: item.posted_time,
                url: item.url,
                vote_count: item.vote_count,
                comments: item.comments,
                hide: NEWS_FEED_HIDE,
            }
            localStorage.setItem(NEWS_STORAGE_KEY + id, hide_results)
            dispatch(dispatchNewsFeeds(news))
        }
    }
}
