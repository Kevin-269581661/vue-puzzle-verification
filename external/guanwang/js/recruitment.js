$(document).ready(function () {
    let currAddress = '全部', currType = '全部';
    $('.addressList').find('li').click(function () {
        $(this).addClass('active').siblings().removeClass('active')
        currAddress = $(this).text();
        let i = 0;
        $('.card').hide();
        if (currType != '全部') {
            let arr = []
            $('.type').each(function (index, key) {
                if ($(key).text() == currType) {
                    // $(key).parents('.card').show();
                    arr.push($(key).parents('.card').find('.address'))
                }
            });
            for (let index in arr) {
                if (currAddress == '全部') {
                    i++;
                    arr[index].parents('.card').show()
                    $('#noData').hide().text('')

                } else {
                    if (arr[index].text() == currAddress) {
                        i++
                        arr[index].parents('.card').show()
                    }
                }

            }

        } else {
            if (currAddress == '全部') {
                i++
                $('.card').show();
                $('#noData').hide().text('')
            } else {
                $('.address').each(function (index, key) {
                    if ($(key).text() == currAddress) {
                        i++;
                        $(key).parents('.card').show()
                    }
                });
            }

        }
        if (i == 0) {
            $('#noData').show().text('暂无岗位信息')
        } else {
            $('#noData').hide().text('')
        }

    });
    $('.positionList').find('li').click(function () {
        currType = $(this).text()
        let i = 0;
        $('.card').hide();
        $(this).addClass('active').siblings().removeClass('active')
        if (currAddress != '全部') {
            console.log(currAddress);
            let arr = []
            $('.address').each(function (index, key) {
                if ($(key).text() == currAddress) {
                    arr.push($(key).parents('.card').find('.type'))
                }
            });
            for (let index in arr) {
                if (currType == '全部') {
                    i++;
                    arr[index].parents('.card').show()
                    $('#noData').hide().text('')

                } else {
                    if (arr[index].text() == currType) {
                        i++
                        arr[index].parents('.card').show()
                    }
                }

            }
        } else {
            if (currType == '全部') {
                i++
                $('.card').show();
                $('#noData').hide()
            } else {
                $('.type').each(function (index, key) {
                    if ($(key).text() == currType) {
                        i++;
                        $(key).parents('.card').show()
                    }
                });
            }

        }

        if (i == 0) {
            $('#noData').show().text('暂无岗位信息')
        } else {
            $('#noData').hide().text('')
        }

    });
    //展开
    $('.card-link').click(function () {
        let className = $(this).parents('.card-header').next().attr('class');
        console.log(className);
        if (className == 'collapse') {
            $(this).html(' 收起 <em>-</em>')
            $(this).parents('.card-header').next().addClass('test').slideDown()
        } else {
            $(this).html(' 展开 <em>+</em>')
            $(this).parents('.card-header').next().removeClass('test').slideUp()
        }

    });

})