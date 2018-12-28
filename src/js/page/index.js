require(["./js/config.js"], function() {
    require(["bscroll", "jquery"], function(BScroll, $) {
        var pagenum = 1,
            limit = 5,
            totle = 0;

        function init() {
            ajax();
            bscroll();
        }

        function bscroll() {
            var scroll = new BScroll(".wrapper-bscroll")
        }

        function ajax() {
            $.ajax({
                url: "/api/list",
                type: "get",
                dataType: "json",
                data: {
                    pagenum: pagenum,
                    limit: limit,
                    totle: totle
                },
                success: function(res) {
                    if (res.code == 0) {
                        totle = res.totle;
                        renderList(res.data)
                    }
                }
            })
        }

        function renderList(data) {
            data.forEach((i) => {

            })
        }

        init();
    })
})