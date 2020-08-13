<template>
  <div class="full_page">
    <publicHead>
      <template #headCenter><h6>{{$t("title.My Cart")}}</h6></template>
      <template #headRight>
        <img
          @click="goods_del"
          class="header_img"
          src="@/assets/img/other/shangchu1.png"
        />
      </template>
    </publicHead>

    <mescroll-vue
      class="centerWrap"
      ref="mescroll"
      :down="mescrollDown"
      :up="mescrollUp"
      @init="mescrollInit"
    >
      <div class="cart_box">
        <div class="article_box" id="dataList">
          <div class="content" v-for="(goods,index) in goodsl" :key="index">
            <!-- 店铺 -->
            <div class="conter_lf">
              <!-- 店铺选择按钮 -->
              <div class="check_box" @click="selectedProductStore(goods,index)">
                <p class="checkb" :class="{'check': goods.checked}"></p>
              </div>
              <!-- 店铺信息 -->
              <div class="lr_top">
                <div class="lr_cnt" @click="todianpu(goods)">
                  <div class="logger"></div>
                  <div style="width:96%;height:100%">
                    <div class="log_name" style="width
                    :100%">
                      <div style="display:flex">
                        <!-- <p class="lo_b" :class="GLOBA.gc1"></p> -->
                        <p class="img">
                          <img v-lazy="goods.store_logo" alt />
                        </p>
                        <p class="dpname">{{goods.store_name}}</p>
                      </div>
                      <!-- x -->
                      <div class="store_r" style="width:80%">
                        <p class="enoughreduce line-clamp" v-if="goods.ertagmap">
                          <!-- v-for="(item,key,index) of goods.store_enoughreduce" -->
                          <span>
                            <span style="padding-right:0.1rem">
                              Full {{GLOBA.money_tag}} {{
                              Object.keys(goods.store_enoughreduce)[0] | percentageNum}} minus {{Object.values(goods.store_enoughreduce)[0]}}
                            </span>
                          </span>
                          <span
                            class="er"
                            v-if=" Object.keys(goods.store_enoughreduce).length>1"
                          >Full {{GLOBA.money_tag}} {{ Object.keys(goods.store_enoughreduce)[1] | integerNum}} minus {{Object.values(goods.store_enoughreduce)[1]}}</span>
                          <span class="er" v-if="Object.keys(goods.store_enoughreduce).length>2">...</span>
                        </p>
                        <p :class="{'isRotate': GLOBA.isRotate}" class="to_store">
                          <img src="@/assets/img/other/xiangyou3.png" alt />
                        </p>
                      </div>
                    </div>
                    <!-- <div
                      class="store_r"
                      style="width:10%"
                    >
                      <p
                        class="enoughreduce line-clamp"
                        v-if="goods.ertagmap"
                      >Full {{GLOBA.money_tag}} {{goods.ertagmap[0] | percentageNum}} minus {{goods.ertagmap[1]}}</p>
                      <p
                        :class="{'gwbb':if_a=='sa'}"
                        class="to_store"
                      >
                        <img
                          src="@/assets/img/other/xiangyou3.png"
                          alt
                        />
                      </p>
                    </div>-->
                  </div>
                </div>
              </div>
                <p class="lower" v-if="goods.store_status !=15"></p>
            </div>
            <!-- 商品 -->
            <div class="conter_rt">
              <div class="lr_zhu" v-for="(good,n) in goods.goods" :key="n">
                <!-- && !goods.exhausted -->
                <div
                  class="inventory"
                  v-if="good.goods_goods_inventory === 0"
                >{{$t("common.Out of stock")}}</div>
                <!-- 单选商品按钮 -->
                <div class="check_box" @click="selectedProduct(good,n,goods,index)">
                  <p class="checkb" :class="{'check': good.checked}"></p>
                </div>
                <!-- 商品信息 -->
                <div class="lr_img">
                  <!-- @click="cr_xq(good.goods_id)" -->
                  <img v-lazy="good.goods_main_photo" @click="cr_xq(good.goods_id)" />
                </div>
                <div class="lr_xx">
                  <p
                    class="good_name line-clamp"
                    :class="{'ltr':good.goods_name.substr(0, 1) !== '^'}"
                    @click="cr_xq(good.goods_id)"
                  >{{good.goods_name.substr(0, 1) === '^'?good.goods_name.substr(1):good.goods_name}}</p>
                  <p class="good_spec line-blok-clamp" @click="gu_aaa(good,n,goods,index)">
                    <!-- <span>{{good}}</span> -->
                    <span v-for="specs in good.goods_specs" :key="specs">{{specs}}&nbsp;</span>
                    <!-- <span v-if="good.goods_spec_color !=='' ">Color:{{good.goods_spec_color}}</span>
                    <span>{{good.goods_spec}}</span>-->
                  </p>
                  <div class="good_pric">
                    <div class="jiage">
                      <p :class="{'tec1':if_a=='sa','ltr':GLOBA.isRotate}" class="jiage1">
                        <span>{{GLOBA.money_tag}} {{good.goods_current_price | integerNum}}</span>
                        <span>.{{good.goods_current_price | decimalNum}}</span>
                      </p>

                      <p
                        class="jiage2"
                        v-if="good.goods_price > good.goods_current_price"
                        :class="{'ltr':GLOBA.isRotate}"
                      >
                        <span>{{GLOBA.money_tag}} {{good.goods_price| integerNum}}</span>
                        <span>.{{good.goods_price | decimalNum}}</span>

                        <!-- <span>.{{good.goods_price | decimalNum}}</span> -->
                        <span
                          class="marg001"
                          v-if="good.goods_price > good.goods_current_price"
                        >{{((good.goods_price-good.goods_current_price)/good.goods_price*100) | percentageNum}}% off</span>
                      </p>
                    </div>
                    <Xnumber
                      v-model="good.cart_count"
                      :min="1"
                      :max="good.goods_goods_inventory"
                      @change="Settlement_price(good,n,goods,index)"
                      :class="{'btnBar':if_a=='sa'}"
                    ></Xnumber>
                  </div>
                </div>
                <!-- 是否下架 -->
                <div class="lower" v-if="good.status">
                  <p>{{$t("common.Off shelf")}}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <maylike ref="like"></maylike>
      </div>
    </mescroll-vue>

    <!-- 全选结算按钮 -->
    <div class="fiexd bottomWrap">
      <div class="quanxuan check_box" @click="checkall(-1)">
        <p
          :style="if_a=='en'?'margin: 0.3rem 0.3rem 0.3rem 0rem;':'margin: 0.3rem 0rem 0.3rem 0.2rem;'"
          class="checkb"
          :class="{'check':checkallflag}"
        ></p>
        <span>{{$t("common.All")}}</span>
      </div>
      <p class="item">
        <!-- <span>Seleted</span> -->
        <span class="prcid">{{GLOBA.money_tag}} {{pricelis.total_price | integerNum}}</span>
        <span class="smallPrcid">.{{pricelis.total_price | decimalNum}}</span>
      </p>
      <!-- <input type="button" class="btn" value="Buy Now" @click="tocheckall()" /> -->
      <div
        class="btn btn_buy"
        v-if="!islow"
        v-DataClick="{func:tocheckall,data:goodsl}"
      >{{$t("common.Buy Now")}}</div>
      <div class="btn btn_low" v-if="islow">{{$t("common.Buy Now")}}</div>
    </div>

    <Popout
      @popout_btn="popout_btn"
      :cue_words="if_a=='en'?'Are you sure to delete':'تأكد من حذف'"
      v-if="if_pop"
    ></Popout>
    <keep-alive>
      <Specs
        v-if="isspec"
        :id="goodsid"
        :to_clear="to_clear"
        :items="specs"
        :to_guc="to_guc"
        :qued_to="qued_to"
        :specs_word="1"
        :good_spec="good_spec"
        @lists_pec="lists_pec"
        @price_number="price_number"
      ></Specs>
    </keep-alive>
  </div>
</template> 

<script>
import Toast from "@/assets/js/pop_up";
import MescrollVue from "@/plugins/scroll/mescroll";
export default {
  components: {
    MescrollVue,
    maylike: () => import("@/whole/components/global/may_like"),
    Specs: () => import("@/whole/components/global/spec_info"),
    Popout: () => import("@/whole/components/elastic/popout"),
    publicHead: () => import("@/whole/components/header/publicHead"),
    Xnumber: () => import("@/whole/components/global/x_number")
  },
  data() {
    return {
      mescroll: null, // mescroll实例对象
      mescrollDown: {
        use: false,
        callback: this.downCallback
      },
      mescrollUp: {
        callback: this.upCallback,
        page: {
          num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
          size: 20 // 每页数据的数量
        },
        toTop: {},
        empty: {
          // 列表第一页无任何数据时,显示的空提示布局; 需配置warpId才生效;
          warpId: "dataList", // 父布局的id;
          tip: this.$t("tips.The cart is empty"),
          btntext: this.$t("common.Buy now")
        },
        lazyLoad: {}
      },
      if_a: "",
      goodsl: [],
      pricelis: {
        total_price: 0
      },
      gcs: [],
      // store_index: [],
      checkallflag: false,
      remove: "",
      isspec: false,
      prompt: false,
      specs: [],
      to_guc: "",
      goodsid: "",
      cart_id: "",
      specs_word: [],
      spec_map: {}, //调整规格后商品信息
      del: {
        index_d: [],
        goods_d: []
      },
      if_pop: false,
      goodsCarList: [],
      checkedCar: [],
      good_spec: "",
      islow: false
    };
  },
  beforeDestroy() {
    window.removeEventListener(
      "popstate",
      e => {
        if (this.isspec) {
          this.isspec = !this.isspec;
        } else {
          //  this.$router.go(-1)
        }
      },
      false
    );
  },
  created() {
    this.if_a = this.$route.query.lang;
  },
  activated() {
    this.pricelis.total_price = 0;
    this.mescroll.resetUpScroll();
  },
  mounted() {
    window.addEventListener(
      "popstate",
      e => {
        if (this.isspec) {
          this.isspec = !this.isspec;
        } else {
          //  this.$router.go(-1)
        }
      },
      false
    );
  },
  //  beforeRouteEnter(to, from, next) {
  //   next(vm => {
  //     vm.$refs.mescroll && vm.$refs.mescroll.beforeRouteEnter(); // 进入路由时,滚动到原来的列表位置,恢复回到顶部按钮和isBounce的配置
  //   });
  // },
  // beforeRouteLeave(to, from, next) {
  //   this.$refs.mescroll && this.$refs.mescroll.beforeRouteLeave(); // 退出路由时,记录列表滚动的位置,隐藏回到顶部按钮和isBounce的配置
  //   next();
  // },
  methods: {
    mescrollInit(mescroll) {
      this.mescroll = mescroll;
    },
    // 下拉刷新
    downCallback(mescroll) {
      mescroll.resetUpScroll();
      setTimeout(() => {
        mescroll.endSuccess();
        mescroll.endErr();
      }, 1000);
    },
    upCallback(page, mescroll) {
      this.getListDataFromNet(
        page.num,
        page.size,
        arr => {
          // 数据渲染成功后,隐藏下拉刷新的状态
          this.$nextTick(() => {
            mescroll.endSuccess(arr.length);
            setTimeout(() => {
              if (this.goodsl.length < 1) {
                this.mescroll.showEmpty();
              }
            }, 500);
          });
        },
        () => {
          // 联网异常,隐藏上拉和下拉的加载进度
          mescroll.endErr();
        }
      );
    },
    getListDataFromNet(pageNum, pageSize, successCallback, errorCallback) {
      setTimeout(() => {
        this.goodcart();
        this.$refs.like.like_goods({currentPage:pageNum}, res => {
          successCallback(res);
        });
      }, 300);
    },
    cr_xq(id) {
      this.$router.push({ path: "/home/details", query: { id: id } });
    },
    cancel() {
      this.prompt = false;
    },
    tangchu() {
      this.prompt = true;
    },
    to_clear() {
      this.isspec = false;
      this.$router.go(-1);
    },
    async gu_aaa(good, n, goods, index) {
      this.goodsid = good.goods_id;
      this.cart_id = good.goods_cart_id;
      this.Settlement_price(good, n, goods, index);
      this.to_guc = 2;
      const data = {
        cart_id: good.goods_cart_id
      };
      let res = await this.$HTTP.goods_cart1_spec(data);
      if (res.code == 0) {
        this.specs = res.data[0]; //商品规格
        if (this.specs.spec_info.length > 0 || this.specs.color.length > 0) {
          this.isspec = true;
          window.history.pushState(null, null, "#");
        }
      }
      let goods_specs = good.goods_specs;
      let good_sp = [];
      good.goods_specs.forEach(e => {
        good_sp.push(e.split(":"));
      });
      this.good_spec = good_sp;
    },
    lists_pec(spec) {
      this.specs_word = spec._value.concat(spec.result);
      this.spec_map = spec.price;
    },
    price_number(count) {
      this.goodsl.forEach(good => {
        good.goods.forEach(item => {
          if (item.goods_cart_id == this.cart_id) {
            item.cart_count = count;
          }
        });
      });
    },
    async qued_to() {
      let gsp = [];
      this.specs_word.forEach(item => {
        if (item !== "") {
          if (item.gsp_id !== undefined) {
            gsp.push(item.gsp_id);
          }
        }
      });
      if (gsp.length === 0) {
        gsp = "";
      }
      let color = "";
      if (this.specs_word[0].spec_name == "Color") {
        color = this.specs_word[0].gsp_value;
      }
      let goods_specs = [];
      this.specs_word.forEach(specs_v => {
        let specs_ = specs_v.spec_name + ":" + specs_v.gsp_value;
        goods_specs.push(specs_);
      });

      let data = {
        id: this.cart_id,
        gsp: gsp.toString(),
        color: color
      };
      let res = await this.$HTTP.goods_cart1_spec_s(data);
      if (res.code == 0) {
        // console.log(this.goodsl, this.specs_word, this.spec_map, "01");
        this.goodsl.forEach(item => {
          item.goods.some((good, a) => {
            if (good.goods_cart_id == this.cart_id) {
              good.goods_current_price = this.spec_map.goods_current_price;
              good.goods_goods_inventory = this.spec_map.goods_inventory;
              good.goods_specs = goods_specs;
              return true;
            }
          });
        });

        this.isspec = false;
        this.$router.go(-1);
      } else if (res.code == -2) {
        Toast({
          message: this.$t("common.Out of stock"),
          time: 2000,
          i: 2
        });
      }
    },
    toCardDetail(id) {
      this.$router.push({ path: "/home/details", query: { id: id } });
    },
    // 店铺链接
    todianpu(good) {
      let to_data = {
        dianpu: good,
        id: 1
      };
      this.$router.push({
        path: "/subpages/cate_goods02",
        query: { to_data: to_data }
      });
    },
    async goodcart(id) {
      // this.goodsl = [];
      let goodsl1 = [];
      let goodsl2 = [];
      this.gcs = [];
      this.del.index_d = [];
      this.del.goods_d = [];
      this.checkallflag = false;

      let postData = { language: this.$route.query.lang === "sa" ? 1 : 0 };
      let res = await this.$HTTP.goods_cart1(postData, { showLoading: false });
      if (res.code == 0) {
        if (res.data.cart_num == 0) {
          this.mescroll.showEmpty();
          this.goodsl = [];
        } else {
          if (res.data.normalmap.length !== 0) {
            res.data.normalmap.forEach(item => {
              item.goods.forEach(spec => {
                let goods_specs = spec.goods_spec
                  .replace(/\?/gi, ":")
                  .replace(/\：/gi, ":")
                  .split("<br>");
                spec.goods_specs = goods_specs;
                if (spec.goods_spec_color !== "") {
                  let goods_color = "Color:" + spec.goods_spec_color;
                  spec.goods_specs.unshift(goods_color);
                }
              });
              goodsl1.unshift(item);
            });
          }
          if (res.data.ermaps.length !== 0) {
            res.data.ermaps.forEach(item => {
              item.forEach(good => {
                good.goods.forEach(spec => {
                  let goods_specs = spec.goods_spec
                    .replace(/\?/gi, ":")
                    .replace(/\：/gi, ":")
                    .split("<br>");
                  spec.goods_specs = goods_specs;
                });
                let er_json = Object.entries(good.store_enoughreduce); //商品满减
                good.ertagmap = er_json[0];
                goodsl2.unshift(good);
              });
            });
          }
          let goodsl12 = goodsl2.concat(goodsl1);
          goodsl12.forEach(item => {
            item.ins = [];
            let goods_exhausted = true;
            if (item.store_status != 15) {
              item.goods.forEach(e => {
                e.status = true;
              });
            } else {
              item.goods.forEach(e => {
                if (e.goods_status != 0) {
                  e.status = true;
                } else {
                  e.status = false;
                }
              });
            }
            item.goods.forEach(items => {
              if (items.goods_goods_inventory != 0) {
                goods_exhausted = false;
              } else {
                items.cart_count = 0;
              }
            });
            if (goods_exhausted) {
              item.exhausted = true;
            } else {
              item.exhausted = false;
            }
          });
          this.goodsl = goodsl12;
          console.log(this.goodsl, 122222222222222222222222);
          //调整规格后自动选中当前商品
          // console.log(goodsl12,id,"01")
          // goodsl12.some((goods_ids, gs_id) => {
          //   goods_ids.goods.some((ids,a)=>{
          //     if (ids.goods_cart_id == id) {
          //       this.selectedProduct(ids, a, goods_ids,gs_id)
          //       return true;
          //     }
          //   })
          // });
        }
      }
    },
    // 删除
    goods_del() {
      if (this.gcs.length !== 0) {
        this.if_pop = true;
      } else {
        Toast({
          message:
            this.if_a == "en" ? "No product selected" : "لا اختيار المنتج",
          time: 2000,
          i: 1
        });
      }
    },
    async popout_btn(i) {
      if (i == 1) {
        this.prompt = false;
        const data = {
          ids: this.gcs.toString()
        };
        let res = await this.$HTTP.remove_goods_cart(data);
        if (res.code == 0) {
          this.if_pop = false;
          this.pricelis.total_price = 0;
          // this.goodsl = []
          this.goodcart();
        }
      } else {
        this.if_pop = false;
      }
    },

    // 单选商品
    selectedProduct(good, i, goods, n) {
      console.log(good, i, goods, n, "00");
      this.checkallflag = false;
      if (typeof good.checked == "undefined") {
        this.$set(good, "checked", true);
      } else {
        good.checked = !good.checked;
      }
      console.log(this.gcs);
      if (good.checked) {
        // 结算的数据
        this.gcs.push(good.goods_cart_id);
        // 判断是否全选
        let good_selecte = true;
        goods.goods.forEach(it => {
          if (!it.checked) {
            good_selecte = false;
          }
        });
        if (good_selecte) {
          this.selectedProductStore(goods, n);
        } else {
          const data = {
            gc_id: good.goods_cart_id,
            count: good.cart_count
          };
          this.count_adjust(data);
        }
      }
      if (!good.checked) {
        // 结算的数据
        this.gcs.some((item, a) => {
          if (item == good.goods_cart_id) {
            this.gcs.splice(a, 1);
            return true;
          }
        });
        goods.checked = false;
        const data = {
          gc_id: "",
          count: ""
        };
        this.count_adjust(data);
      }
      this.lower_st();
    },
    //全选一个店铺商品
    selectedProductStore(goods, i) {
      this.checkallflag = false;
      if (typeof goods.checked == "undefined") {
        this.$set(goods, "checked", true);
      } else {
        goods.checked = !goods.checked;
      }
      if (goods.checked) {
        goods.goods.forEach(item => {
          this.gcs.push(item.goods_cart_id);
          if (typeof item.checked == "undefined" || !item.checked) {
            this.$set(item, "checked", true);
          }
        });
        let good_checkall = true;
        this.goodsl.forEach(n => {
          if (!n.checked) {
            good_checkall = false;
          }
        });
        if (good_checkall) {
          this.checkall();
        }
        let gcs_i = [];
        for (let s = 0; s < this.gcs.length; s++) {
          if (gcs_i.indexOf(this.gcs[s]) === -1) {
            gcs_i.push(this.gcs[s]);
          }
        }
        this.gcs = gcs_i;
        const data = {
          gc_id: "",
          count: ""
        };
        this.count_adjust(data);
      }
      if (!goods.checked) {
        console.log(goods);
        let good_ids = [];
        goods.goods.forEach(item => {
          good_ids.push(item.goods_cart_id);
          if (item.checked) {
            item.checked = !item.checked;
          }
        });
        const _arr2Set = new Set(good_ids);
        this.gcs = this.gcs.filter(item => !_arr2Set.has(item));
        const data = {
          gc_id: "",
          count: ""
        };
        this.count_adjust(data);
      }
      this.lower_st();
    },
    // 全选
    checkall(gcss) {
      this.gcs = [];
      this.checkallflag = !this.checkallflag;
      this.goodsl.forEach(item => {
        let good_checked = false;

        item.goods.forEach(e => {
          good_checked = true;
          if (typeof e.checked == undefined) {
            this.$set(e, "checked", this.checkallflag);
          } else {
            e.checked = this.checkallflag;
          }
          if (e.checked) {
            this.gcs.push(e.goods_cart_id);
            // item.ins.push(e.goods_cart_id);
            this.del.goods_d.push(e);
          }
          if (!e.checked) {
            this.gcs = [];
          }
        });

        if (good_checked) {
          if (typeof item.checked == undefined) {
            this.$set(item, "checked", this.checkallflag);
          } else {
            item.checked = this.checkallflag;
          }
        }
        if (!item.checked) {
          // item.ins = []
        }
      });
      // 全选价格
      const data = {
        gc_id: "",
        count: ""
      };
      this.count_adjust(data);
      this.lower_st();
    },
    // 结算价格
    async count_adjust(data) {
      if (data.count !== 0) {
        let gcsString;
        if (this.gcs.length === 0) {
          gcsString = -1;
        } else {
          gcsString = this.gcs.toString();
        }
        data.gcs = gcsString;
        data.gift_id = "";
        let res = await this.$HTTP.goods_count_adjust(data);
        if (res.code == 0) {
          this.pricelis = res.data;
        }
      } else {
        Toast({
          message: this.if_a == "en" ? "Sell out" : "بيع",
          time: 2000,
          i: 2
        });
      }
    },
    // 多个商品结算
    tocheckall(goodsl) {
      console.log(goodsl);
      let good_exhausted = false;
      goodsl.forEach(item => {
        item.goods.forEach(it => {
          this.gcs.forEach(e => {
            if (it.goods_cart_id == e) {
              if (it.cart_count == 0) {
                good_exhausted = true;
              }
            }
          });
        });
      });
      if (this.gcs.length == 0) {
        Toast({
          message:
            this.if_a == "en"
              ? "Please select a product"
              : "الرجاء اختيار المنتج",
          time: 2000,
          i: 2
        });
      } else if (good_exhausted) {
        Toast({
          message: this.if_a == "en" ? "Sell out" : "بيع",
          time: 2000,
          i: 2
        });
      } else {
        this.$router.push({
          path: "/mycart/payment",
          query: {
            productId: this.gcs.toString()
          }
        })
        this.gcs = [];
        this.checkallflag = false;
      }
    },
    // 点击出现结算总价 //数量调整按钮
    Settlement_price(good, i, goods, n) {
      console.log(good, i, goods, n);
      // this.selectedProduct(good, i, goods, n)
      if (typeof good.checked == "undefined") {
        this.$set(good, "checked", true);
      } else {
        good.checked = true;
      }
      if (good.checked) {
        // 结算的数据
        this.gcs.push(good.goods_cart_id);
        // 判断是否一个店铺全选
        let good_selecte = true;
        goods.goods.forEach(it => {
          if (!it.checked) {
            good_selecte = false;
          }
        });
        if (good_selecte) {
          if (typeof goods.checked == "undefined") {
            this.$set(goods, "checked", true);
          } else {
            goods.checked = true;
          }
          // 全选一个店铺商品
          if (goods.checked) {
            // goods.goods.forEach(item => {
            //   this.gcs.push(item.goods_cart_id);
            //   if (typeof item.checked == "undefined" || !item.checked) {
            //     this.$set(item, "checked", true);
            //   }
            // });
            let good_checkall = true;
            this.goodsl.forEach(n => {
              if (!n.checked) {
                good_checkall = false;
              }
            });
            // 全选商品
            if (good_checkall) {
              this.gcs = [];
              this.checkallflag = true;
              this.goodsl.forEach(item => {
                let good_checked = false;
                item.goods.forEach(e => {
                  good_checked = true;
                  if (typeof e.checked == undefined) {
                    this.$set(e, "checked", this.checkallflag);
                  } else {
                    e.checked = this.checkallflag;
                  }
                  if (e.checked) {
                    this.gcs.push(e.goods_cart_id);
                    this.del.goods_d.push(e);
                  }
                });

                if (good_checked) {
                  if (typeof item.checked == undefined) {
                    this.$set(item, "checked", this.checkallflag);
                  } else {
                    item.checked = this.checkallflag;
                  }
                }
              });
            }
            let gcs_i = [];
            for (let s = 0; s < this.gcs.length; s++) {
              if (gcs_i.indexOf(this.gcs[s]) === -1) {
                gcs_i.push(this.gcs[s]);
              }
            }
            this.gcs = gcs_i;
            console.log(this.gcs);
            const data = {
              gc_id: "",
              count: ""
            };
            this.count_adjust(data);
          }
        }
        // else{
        //   const data = {
        //     gc_id: good.goods_cart_id,
        //     count: good.cart_count
        //   };
        //   this.count_adjust(data);
        // }
        let gcs_is = [];
        for (let s = 0; s < this.gcs.length; s++) {
          if (gcs_is.indexOf(this.gcs[s]) === -1) {
            gcs_is.push(this.gcs[s]);
          }
        }
        this.gcs = gcs_is;
        const data = {
          gc_id: good.goods_cart_id,
          count: good.cart_count
        };
        this.count_adjust(data);
      }
    },
    lower_st() {
      this.islow = false;
      this.goodsl.forEach(item => {
        item.goods.forEach(it => {
          if (it.checked && it.status) {
            this.islow = true;
            return true;
          }
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
h4,
p {
  margin: 0;
}
.cart_box {
  overflow: hidden;
  overflow-x: hidden;
  overflow-y: scroll;
  background-color: #f7f7f7;
}
.article_box {
  width: 100%;
  // min-height: 4rem;
  display: flex;
  flex-direction: column-reverse;
}
.fiexd {
  height: 1rem;
  width: 100%;
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  // .prcid {
  //   font-weight: 600;
  // }
  // .smallPrcid {
  //   color: #999999;
  //   font-size: 0.2rem;
  //   line-height: 0.2rem;
  //   height: 0.2rem;
  // }
  p {
    font-size: 0.3rem;
    line-height: 1rem;
    height: 1rem;

    span:nth-child(1) {
      font-size: 0.3rem;
      font-family: "Calibri-Bold";
      font-weight: Bold;
      color: #333;
    }
    span:nth-child(2) {
      font-size: 0.2rem;
      font-family: "Calibri-Bold";
      font-weight: Bold;
      color: #333;
      line-height: 0.4rem;
      vertical-align: 0.1rem;
    }
    // .prcid {
    //   font-weight: 600;
    // }
    // .smallPrcid {
    //   color: #999999;
    //   font-size: 0.2rem;
    //   line-height: 0.2rem;
    //   height: 0.2rem;
    // }
  }
  .btn {
    width: 2.4rem;
    text-align: center;
    line-height: 1rem;
    height: 1rem;
    font-weight: Bold;
    font-family: "Calibri-Bold";
    font-size: 0.3rem;
  }
  .btn_buy {
    color: #fff;
    background: -webkit-linear-gradient(left, #33b6ff, #017ec2);
    background: -o-linear-gradient(right, #33b6ff, #017ec2);
    background: -moz-linear-gradient(right, #33b6ff, #017ec2);
    background: linear-gradient(to right, #33b6ff, #017ec2);
  }
  .btn_low {
    color: #999;
    background-color: #f7f7f7;
  }
}

.quanxuan {
  width: 20%;
  display: flex;
  justify-content: flex-start;
  span {
    font-size: 0.3rem;
    line-height: 1rem;
    font-weight: Bold;
    font-family: "Calibri-Bold";
    color: #000;
  }
}
.check_box {
  display: flex;
  align-items: center;
  padding: 0 0.2rem;
  .checkb {
    width: 0.4rem;
    height: 0.4rem;
    border-radius: 50%;
    border: 1px solid #999999;
    box-sizing: border-box;
  }
  .check {
    background-color: #33b6ff;
    border: none;
  }
  .check::after {
    display: block;
    /* content: "\2714"; */
    font-size: 0.28rem;
    color: #fff;
    font-weight: 600;
    text-align: center;
    line-height: 0.4rem;
  }
}
.content {
  position: relative;
  margin-bottom: 0.24rem;
  // height: 3.02rem;
  // padding-right: 0.2rem;
  width: 100%;
  box-sizing: border-box;
  .exhausted {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 100;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.3);
  }
  .conter_lf {
    display: flex;
    justify-content: space-between;
    .lr_top {
      background-color: #e9e9e9;
      height: 0.72rem;
      line-height: 0.72rem;
      width: calc(100vw - 0.8rem);
      box-sizing: border-box;
      position: relative;
      font-weight: 400;
      font-family: "Calibri";
      .lr_cnt {
        font-size: 0.32rem;
        // padding: 0 0.2rem;
        display: flex;
        justify-content: space-between;
        position: relative;
        .log_name {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 100%;
          font-size: 0.24rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          // max-width: 5rem;
          min-width: 1rem;
          .img {
            width: 0.32rem;
            display: flex;
            align-items: center;
            img {
              width: 100%;
            }
          }

          .dpname {
            padding: 0 0.2rem;
            font-size: 0.24rem;
            color: #333;
          }
        }
        .store_r {
          display: flex;
          justify-content: flex-end;
          .enoughreduce {
            max-width: 6rem;
            font-size: 0.2rem;
            color: #017ec2;
            box-sizing: border-box;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .to_store {
            width: 0.06rem;
            height: 100%;
            line-height: 0.64rem;
            padding: 0 0.1rem;
            img {
              width: 100%;
              height: 0.12rem;
            }
          }
        }
      }
      // 标识
      .lr_cnt .logger {
        background: #008edd;
        width: 0.08rem;
        height: 0.26rem;
        margin-top: 0.21rem;
        // position: absolute;
        // top: 0.2rem;
        // left: 0;
      }
    }
  }
  .conter_rt {
    background: #fff;

    .lr_zhu {
      height: 2.5rem;
      // height: 3.02rem;
      width: 100%;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      border-bottom: 2px solid #ccc;
      box-sizing: border-box;
      position: relative;
      .inventory {
        position: absolute;
        top: 30%;
        left: 30%;
        transform: translate(-50%, -50%);
        width: 2.5rem;
        height: 1rem;
        border: 2px solid #017ec2;
        border-radius: 50%;
        z-index: 100;
        font-size: 0.4rem;
        font-weight: Bold;
        color: #017ec2;
        text-align: center;
        line-height: 1rem;
        transform: rotate(-15deg);
      }
      .check_box {
      }
      .lr_img {
        width: 2.06rem;
        height: 2rem;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .lr_xx {
        width: 4rem;
        padding: 0 0.2rem;
        font-size: 0.32rem;
        padding: 0rem 0.2rem;
        .good_name {
          height: 0.6rem;
          line-height: 0.3rem;
          color: #333333;
          font-size: 0.26rem;
          font-weight: 400;
          font-family: "Calibri";
        }
        .good_spec {
          font-size: 0.24rem;
          color: #b3b3b3;
          height: 0.6rem;
          line-height: 0.6rem;
          font-weight: 400;
          font-family: "Calibri";
          // padding: ;
          // margin-top: 0.24rem;
        }
        .good_pric {
          display: flex;
          justify-content: space-between;
          // margin-top: 0.3rem;
          .jiage {
            width: 66%;
            .jiage1 {
              height: 0.4rem;
              line-height: 0.4rem;
              color: #333;
              font-weight: bold;
              font-family: "Calibri-Bold";
              display: flex;
              span:nth-child(1) {
                font-size: 0.3rem;
              }
              span:nth-child(2) {
                font-size: 0.2rem;
                line-height: 0.3rem;
              }
            }
            .jiage2 {
              display: flex;
              font-family: "Calibri";
              font-weight: 400;
              white-space: nowrap;
              line-height: 0.3rem;
              height: 0.3rem;
              span:nth-child(1) {
                font-size: 0.2rem;
                text-decoration: line-through;
                color: #999999;
              }
              span:nth-child(2) {
                font-size: 0.1rem;
                line-height: 0.1rem;
                text-decoration: line-through;
                color: #999999;
              }
              span:nth-child(3) {
                color: red;
                font-size: 0.22rem;
              }
            }
          }
          .xuanze {
            width: 1.16rem;
            margin-top: 0.16rem;
          }
        }
      }
    }
  }
}

//
.gu_mask {
  position: fixed;
  bottom: 0px;
  left: 0px;
  height: calc(100vh - 0px);
  width: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 99999;

  .gu_piece {
    height: 17%;
    width: 100%;
  }

  .gu_content {
    width: 100%;
    height: 100%;
    background: #fff;
    border-radius: 7px;

    .gu_ge {
      width: 100%;
      height: 20%;

      padding-top: 0.3rem;
      padding-left: 0.3rem;

      .gu_img {
        height: 90%;
        width: 30%;
        background: #ccc;
        float: left;
        border-radius: 0.1rem;
      }

      .gu_parameter {
        width: 60%;
        margin-left: 0.2rem;
        height: 90%;
        float: left;

        h4 {
          height: 50%;
          width: 100%;
        }
        p {
          font-weight: 600;
          color: red;
          padding-bottom: 0.2rem;
        }
        span {
          font-size: 0.2rem;
        }
      }
    }
    .gu_xz {
      width: 100%;
      height: 25%;

      ul {
        list-style: none;
        margin: 0px;

        li {
          width: 90%;
          border-radius: 0.4rem;
          height: 0.6rem;
          background: #ccc;
          text-align: center;
          line-height: 0.6rem;
          margin-top: 0.1rem;
        }
      }
    }
    .gu_chima {
      height: 18%;
      width: 100%;

      p {
        width: 1rem;
        height: 0.8rem;
        line-height: 0.8rem;
        text-align: center;
        font-weight: 600;
      }
      .gu_size {
        height: 65%;
        width: 100%;

        ul {
          list-style: none;
          margin: 0px;
          height: 100%;

          li {
            width: 1rem;
            height: 0.4rem;
            background: #ccc;
            float: left;
            text-align: center;
            line-height: 0.4rem;
            margin-right: 0.2rem;
            border-radius: 0.2rem;
            margin-bottom: 0.2rem;
          }
        }
      }
    }
    .gu_shu {
      width: 100%;
      height: 10%;

      span {
        display: black;
        width: 10%;
        height: 1.28rem;
        float: left;
        text-align: center;
        line-height: 1.28rem;
      }
    }
    .hhh {
      width: 100%;
      height: 100%;
      background: #f90;
    }
  }
}
.content_wrapper {
  width: 100%;
  height: 89%;
  // background-color: #f2f;
  overflow: hidden;
  background: #fff;
}
.prompt_box {
  position: fixed;
  top: 40%;
  left: 10%;
  width: 80%;
  height: 2.2rem;
  background-color: #eec900;
  border-radius: 0.16rem;
  padding: 0.2rem;
  box-sizing: border-box;
  text-align: center;
  p {
    margin: 0;
    height: 1rem;
    line-height: 0.8rem;
  }
  .btn {
    padding: 0 0.4rem;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    p {
      width: 1.4rem;
      height: 0.8rem;
      border-radius: 0.1rem;
      background-color: blue;
      color: #fff;
    }
  }
}
.header_img {
  width: 0.3rem;
  height: 0.4rem;
}

.lower {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
  background-color: rgba(51, 51, 51, 0.6);
  p {
    font-family: "Calibri-Bold";
    font-weight: Bold;
    font-size: 0.3rem;
    border: 1px solid #fff;
    width: 2rem;
    height: 1rem;
    border-radius: 50%;
    text-align: center;
    line-height: 1rem;
    color: #fff;
    margin-top: 0.8rem;
    margin-left: 2.2rem;
  }
}
.gwbb {
  transform: rotate(180deg);
}
.btnBar {
  padding-left: 0rem;
  padding-right: 0.2rem;
}
</style>
