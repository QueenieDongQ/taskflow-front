export const postData = (that, url, data, callback = undefined) => {
  that.$http.post(url, data).then(response => {
    if(response.data.code != 0) {
      // this.notify(response.data.error);
      alert(response.data.error);
      return;
    }
    let data = response.data.data;
    if(callback) {
      callback(data);
    }
  }, error => {
    // this.notify(error);
    alert(error);
  });
};
