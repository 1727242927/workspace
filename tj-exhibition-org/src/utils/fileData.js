export function urlStringify(urlList, parse) {
  if (!Array.isArray(urlList)) {
    return urlList
  }
  const result = urlList.map(item => ({
    uid: item.uid,
    name: item.name,
    status: item.status,
    url: item.response.data.url
  }))
  if (parse) {
    return result
  }
  return JSON.stringify(result)
}

export function handleFileList(urlArr) {
  const data = JSON.parse(urlArr)
  return data.map(item => {
    const obj = {
      url: item.url,
      name: item.name,
      status: item.status,
      uid: item.uid
    }
    return {
      url: item.url,
      name: item.name,
      status: item.status,
      uid: item.uid,
      response: {
        data: obj
      }
    }
  })
}
export function handleFileList1(urlArr) {
  return urlArr.map(item => {
    const obj = {
      url: item.url,
      name: item.name,
      status: item.status,
      uid: item.uid
    }
    return {
      url: item.url,
      name: item.name,
      status: item.status,
      uid: item.uid,
      response: {
        data: obj
      }
    }
  })
}