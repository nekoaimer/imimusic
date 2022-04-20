import nekoRequest from './index'

export function getSearchHot(){
  return nekoRequest.get('/search/hot')
}

export function getSearchSuggest(keywords){
  return nekoRequest.get('/search/suggest', {
    keywords,
    type: 'mobile'
  })
}

export function getSearchResult(keywords){
  return nekoRequest.get('/search', {
    keywords
  })
}
