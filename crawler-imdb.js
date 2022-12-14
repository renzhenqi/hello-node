let Crawler = require('crawler');

const c = new Crawler({
  maxConnections: 1,
  callback: (error, res, done) => {
    if (error) {
      console.log(error)
    } else {
      const $ = res.$;
      console.log($('title').text());
    }
    done();
  }
});

// c.queue('http://www.amazon.com');

// c.queue([{
//   uri: 'https://www.imdb.com/calendar/?ref_=nv_mv_cal',
//   jquery: true,
//   callback: (error, res, done) => {
//     if (error) {
//       console.log(error)
//     } else {
//       const $ = res.$;
//       console.log($('article').text())
//       console.log('Grabbed', res.body.length, 'bytes')
//     }
//     done();
//   }
// }])
function strHandle(str) {
  return str.replaceAll(/(^\s*)|(\s*$)|(\n|\r|(\r\n)|(\u0085)|(\u2028)|(\u2029))/ig, '')
}

c.queue([{
  uri: 'https://movie.douban.com/cinema/later/chengdu/',
  jquery: true,
  callback: (error, res, done) => {
    if (error) {
      console.log(error)
    } else {
      const $ = res.$;
      let infoHtml = $;
      let infos = []
      const arr = infoHtml.data('#showing-soon .item .intro').each((i, el) => {
        let result = {}
        result['name'] = strHandle(infoHtml.data(el).children('a').text())
        infos.push(result)
      })

      console.log(infos)
    }
    done();
  }
}])


// else {
//   const $ = res.$;
//   let infoHtml = $;
//   console.log(infoHtml)
//   // console.log($('.item').text())
//   // console.log('Grabbed', res.body.length, 'bytes')
//   // const arr = $('#showing-soon .item').each((i, el) => {
//   //
//   // })
//   const arr = infoHtml.data('#showing-soon .item .intro').each((i, el) => {
//     let result = {}
//     result['id'] = strHandle(infoHtml.data(el).children('.value').text())
//
//     // console.log(arr)
//   }
//
//   done();
//
// }])