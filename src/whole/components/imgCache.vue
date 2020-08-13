<template>
  <img class="cacheImg" v-lazy="resource"/>
</template>

<script>
export default {
  props: {
    src: {
      type: String,
      default: "",
      required: true
    },
    saveDirectory: {
      type: String,
      default: "_downloads/"
    }
  },
  computed: {
    resource() {
      if (this.isCached) {
        // 读取缓存成功
				return this.localFile;
			}else{
        // 正常加载
        return this.src;
      }
    }
  },
  mounted() {
    setTimeout(() => {
      this.init();
    }, 300);
  },
  data() {
    return {
      isCached: false,
      localFile: null
    };
  },
  methods: {
    init() {
      if (window.plus) {
        this.isCache(this.src)
          .then(res => {
            if (res) {
              this.isCached = true;
              this.localFile = res
            } else {
              this.downloadFile(this.src)
                .then(ressss => {
                  this.isCached = true;
                  this.localFile = plus.io.convertLocalFileSystemURL(ressss);
                })
                .catch(err => {
                  console.log("下载失败：" + JSON.stringify(err));
                  this.isCached = false;
                });
            }
          })
          .catch(err => {
            this.isCached = false;
          });
      } else {
        this.isCached = false;
      }
    },
    downloadFile(url) {
      return new Promise((resolve, reject) => {
        let filename = "_downloads/" + this.getFileName(url);
        let task = plus.downloader.createDownload(
          url,
          {
            filename: filename
          },
          (download, status) => {
            if (status == 200) {
              resolve(filename);
            } else {
              reject();
            }
          }
        );
        task.start();
      });
    },
    isCache(url) {
      let savePath = plus.io.convertLocalFileSystemURL("_downloads/" + this.getFileName(url));
      if (plus.os.name == "iOS") {
        savePath = "file:" + savePath
      }
      return new Promise((resolve, reject) => {
        plus.io.resolveLocalFileSystemURL(
          savePath,
          entry => {
            resolve(savePath);
          },
          e => {
            resolve(null);
          }
        );
      });
    },
    getFileName(path) {
      return path.substring(path.lastIndexOf("/") + 1);
    }
  }
};
</script>