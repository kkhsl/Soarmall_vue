
//不需要mui.js版本

window.ononline = function() {//链接上网络
  sessionStorage.setItem("if_Network",true)
}
window.onoffline = function() {//断开网络
  sessionStorage.setItem("if_Network",false)
}


String.prototype.endWith = function (endStr) {
  var d = this.length - endStr.length;
  return (d >= 0 && this.lastIndexOf(endStr) == d)
}
document.addEventListener('plusready', function () {
	// setTimeout(()=>{
	// 	var dirPath = "_downloads/";
	// 	plus.io.resolveLocalFileSystemURL(dirPath, function(entry) {
	// 		var directoryReader = entry.createReader();
	// 		directoryReader.readEntries(function(entries) {
	// 			if (entries.length > 0) {
	// 				entry.removeRecursively(function(entry) {
	// 					// alert("成功")
	// 				}, function(e) {
	// 					// alert(e.message + ' ?!');
	// 				})
	// 			}
	// 		}, function(e) {
	// 			// alert('读取文件失败：' + e.message)
	// 		})
	// 	}, function(e) {
	// 		// alert('读取目录失败：' + e.message)
	// 	})
	// 	setTimeout(()=>{
	// 		let	gif = ""
	// 		const country_i = JSON.parse(localStorage.getItem('country_i') || 1)
	// 		if(country_i == 1){
	// 		  gif = 'https://photo.soarmall.com/start/app.gif';//阿联酋
	// 		}else{
	// 		 gif = 'https://photo1.soarmall.com/start/app.gif';//沙特
	// 		}
	// 	var dtask = plus.downloader.createDownload(gif, {}, function(d, status) {
	// 		// 下载完成 下载的文件会保存在 PUBLIC_DOWNLOADS 目录下，只要不主动删除都会存在  
	// 		if (status == 200) {
	// 			// alert("Download success: ");
	// 			// checkDownload()
	// 		} else {
	// 			// alert("Download failed: " + status);
	// 		}
	// 	});;
	// 	dtask.start();
	// 	},100)
	// },6100)
	


      // plus.statistic.eventTrig("iostest", {"iostest":"iostest"});

      // plus.statistic.eventTrig("test", {"name":"test"});
      //  const start = new Date();  
      // const end = new Date();  
      // let d = end.getTime() - start.getTime();  
      // plus.statistic.eventDuration("10000", d,{"name":"10000"}); 

      // plus.statistic.eventDuration("iostest", d,{"iostest":"iostest"}); 
  // document.addEventListener("netchange", function () {
  //   var nt = plus.networkinfo.getCurrentType();
  //   switch (nt){
  //     case plus.networkinfo.CONNECTION_ETHERNET:
  //     case plus.networkinfo.CONNECTION_WIFI:
  //     alert("Switch to Wifi networks!");
  //     break; 
  //     case plus.networkinfo.CONNECTION_CELL2G:
  //     case plus.networkinfo.CONNECTION_CELL3G:
  //     case plus.networkinfo.CONNECTION_CELL4G:
  //     alert("Switch to Cellular networks!");  
  //     break; 
  //     default:
  //     alert("Not networks!"); 
  //     break;
  //   }
  // });

  // plus.key.addEventListener('backbutton', function () {

  //   if (window.history.length > 1) {
  //     if (window.location.href.endWith('index.html#/discovery') || window.location.href.endWith('index.html#/home') || window.location.href.endWith('index.html#/categories') || window.location.href.endWith('index.html#/mycont')) {

  //       var first = localStorage.getItem("first_history");
  //       if (first) {
  //         plus.nativeUI.toast("Press exit again!");
  //       }
  //       if (!first) {
  //         first = new Date().getTime();
  //         localStorage.setItem("first_history", first);
  //       } else {
  //         if (new Date().getTime() - first < 1500) {

  //           plus.runtime.quit();
  //         } else {
  //           localStorage.removeItem("first_history")
  //         }
  //       }
  //     } else if (window.location.href.endWith('/account/Account/orders?toPage=1')
  //       || window.location.href.endWith('/account/Account/orders?toPage=3')
  //       || window.location.href.endWith('/account/Account/orders?toPage=5')
  //       || window.location.href.endWith('/account/Account/orders?toPage=6')
  //       || window.location.href.endWith('/subpages/Account/returns/returns?toPage=0')
  //     ) {
  //       window.location.hash = "/mycont";
  //     } else {
  //       window.history.back(-1);
  //     }
  //   } else {
  //     window.location.hash = "/home";
  //     if (window.location.href.endWith('index.html#/home')) {
  //       var first = localStorage.getItem("first_history");
  //       if (first) {
  //         plus.nativeUI.toast("Press exit again!");
  //       }
  //       if (!first) {
  //         first = new Date().getTime();
  //         localStorage.setItem("first_history", first);
  //       } else {
  //         if (new Date().getTime() - first < 1500) {

  //           plus.runtime.quit();
  //         } else {
  //           localStorage.removeItem("first_history")
  //         }
  //       }
  //     }
  //   }
  // })

  var type = plus.os.name === "Android" ? 1 : 2;
  var url = "https://adm.soarmall.com/api/updata/check"
  let user = JSON.parse(localStorage.getItem('status') || '[]')
  let token = user.token ? user.token : ""
  plus.device.getInfo({
    success: function (e) {
      localStorage.setItem("uuid", JSON.stringify(e.uuid));
    },
    fail: function (e) {
      localStorage.setItem("uuid", JSON.stringify(0));
    }
  });

  setTimeout(() => {

    let uuid = JSON.parse(localStorage.getItem("uuid") || "[]");
    let country = JSON.parse(localStorage.getItem('country_i') || 1)

    plus.runtime.getProperty(plus.runtime.appid, function (inf) {
      hui.ajax({
        url: url,
        data: { version: inf.version, type: type, uuid: uuid, token: token, country,country},
        type: 'POST',
        success: function (res) {
          var res = JSON.parse(res);
          // var net = plus.networkinfo.getCurrentType() //判断当前网络是否在wifi环境中 返回值为3
          if (res.code == "102") {//小版本
            app_dumnloder(res.data.url)
          } else if (res.code == 103) {//大版本
            if (type == 1) {
              hui.alert('App need to upgrade？', ['Confirm'], function () {
                app_dumnloder(res.data.url)
              })
            } else {
              hui.alert('There are major updates to the App，Please go to the appstore download', 'Ok', function () {
                if (type == 1) {

                  plus.runtime.quit();
                } else if (type == 2) {
                  // https://apps.apple.com/cn/app/soarmall/id1487094859
                  var iosurl = 'itms-apps://itunes.apple.com/cn/app/soarmall/id1487094859';// HelloH5应用在appstore的地址  
                  plus.runtime.openURL(iosurl);
                }
              })
            }
          }
        }
      });
      function app_dumnloder(url) {
        var dtask = plus.downloader.createDownload(url, {}, function (d, status) {
          // 下载完成  
          if (status == 200) {
            plus.runtime.install(d.filename, {}, function () {//安装成功
              location.reload();//强制刷新页面
            }, function (e) {//安装失败
            });
          } else {
          }
        });
        dtask.start();
      }
    });

  }, 1000)

});


window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }
gtag('js', new Date());

gtag('config', 'UA-148736503-1');


//安卓键盘事件
// let u = navigator.userAgent;
// let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
// if (isiOS) {
// } else {
//   window.addEventListener('resize', function () {
//     // Document 对象的activeElement 属性返回文档中当前获得焦点的元素。
//     if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
//       window.setTimeout(function () {
//         document.activeElement.scrollIntoView(false);
//       }, 50);
//     }
//   })
// }