export default {
    get(url) {
      return $.ajax({
        url,
        type: 'get',
        success(result) {
          return result
        }
      })
    },
    post(url,data){
      return $.ajax({
      type: 'POST',
      url,
      // post payload:
      dataType: "json",
      // data: JSON.stringify('keywordPrefix:裙子' ),
      data,
      contentType:'application/x-www-form-urlencoded',
      success(result) {
        return result
      }
    })
    }
  }