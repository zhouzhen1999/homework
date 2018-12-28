require(["./js/config.js"], function() {
    require(["bscroll", "jquery"], function(BScroll, $) {
        var pagenum = 1,
            limit = 5,
            totle = 0,
            type = "",
            key = "";

        function init() {
            ajax(type, key);
            addevent()
        }

        function ajax(type) {
            type = type || '';
            key = key || "";
            $.ajax({
                url: "/api/list",
                dataType: "json",
                type: "get",
                data: {
                    pagenum: pagenum,
                    limit: limit,
                    totle,
                    type: type,
                    key: key
                },
                success: function(res) {
                    if (res.code == 0) {
                        totle = res.totle
                        renderList(res.data);

                    }
                }
            })
        }

        function renderList(data) {
            var str = "";
            data.forEach((i) => {
                str += `<dl>
                            <dt><img src="${i.img}" alt=""></dt>
                            <dd>
                                <b>${i.title}</b>
                                <p><span>门店</span><span>中国香港片</span></p>
                                <p><i>新品</i><i>公益宝贝</i></p>
                                <p><b>${i.money}</b><b>信用:${i.credit}</b></p>
                            </dd>
                        </dl>`;
            })
            $(".section-bscroll-main").append(str);
            scroll.refresh()
        }



        var scroll = new BScroll(".wrapper-bscroll", {
            probeType: 2
        })

        scroll.on("scroll", function(position) {
            if (position.y < this.maxScrollY - 30) {
                if (pagenum < totle) {
                    $(".section-bscroll-main").attr("title", "释放加载更多")
                } else {
                    $(".section-bscroll-main").attr("title", "没有更多数据")
                }
            } else if (position.y < this.maxScrollY - 15) {
                if (pagenum < totle) {
                    $(".section-bscroll-main").attr("title", "上拉加载")
                }
            }
        })

        scroll.on("touchEnd", function() {
            if ($(".section-bscroll-main").attr("title") == "释放加载更多") {
                if (pagenum < totle) {
                    pagenum++;
                    ajax(type, key)
                }
            }
        })


        function addevent() {
            $("#tabs").on("click", function() {
                $(".section-bscroll-main").toggleClass("title")
            })

            $("#all").on("click", function() {
                $(".alert-mark").show()
            })

            $(".sort-kind-title p").on("click", function() {
                pagenum = 1;
                $(this).addClass("hue").siblings().removeClass("hue");
                type = $(this).attr("data-type");
                $(".section-bscroll-main").html("");
                ajax(type, key);
                $(".alert-mark").hide()
            })

            $("#inp").on("input", function() {
                key = $(this).val().trim();
                pagenum = 1;
                $(".section-bscroll-main").html("");
                ajax(type, key);
            })
        }
        init();
    })
})