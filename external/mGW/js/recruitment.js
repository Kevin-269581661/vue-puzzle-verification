$(function () {
    showNav();
    $('.job-title').on('click', function () {
        let className = $(this).find('.job-title-arrow').attr('class');
        if (className == 'job-title-arrow') {
            $(this).find('.job-title-arrow').addClass('slide')
            $(this).siblings('.job-content').slideUp()
        } else {
            $(this).find('.job-title-arrow').removeClass('slide')
            $(this).siblings('.job-content').slideDown()
        }
    });
    let currAddress = '全部', currType = '全部';
    $('#addSelect').on('change', function () {
        // console.log($(this).val());
        currAddress = $(this).val();
        let i = 0;
        $('.job-content-wrapper-li').hide()
        if (currType != '全部') {
            let arr = []
            $('.type').each(function (index, key) {
                if ($(key).text() == currType) {
                    // $(key).parents('.card').show();
                    arr.push($(key).parents('.job-content-wrapper-li').find('.address'))
                }
            });
            for (let index in arr) {
                if (currAddress == '全部') {
                    i++;
                    arr[index].parents('.job-content-wrapper-li').show()
                    $('#noData').hide().text('')

                } else {
                    if (arr[index].text() == currAddress) {
                        i++
                        arr[index].parents('.job-content-wrapper-li').show()
                    }
                }

            }

        } else {
            if (currAddress == '全部') {
                i++
                $('.job-content-wrapper-li').show();
                $('#noData').hide().text('')
            } else {
                $('.address').each(function (index, key) {
                    if ($(key).text() == currAddress) {
                        i++;
                        $(key).parents('.job-content-wrapper-li').show()
                    }
                });
            }

        }
        if (i == 0) {
            $('#noData').show().text('暂无岗位信息')
        } else {
            $('#noData').hide().text('')
        }

    })
    $('#posSelect').on('change', function () {
        currType = $(this).val()
        let i = 0;
        $('.job-content-wrapper-li').hide();
        $(this).addClass('active').siblings().removeClass('active')
        if (currAddress != '全部') {
            console.log(currAddress);
            let arr = []
            $('.address').each(function (index, key) {
                if ($(key).text() == currAddress) {
                    arr.push($(key).parents('.job-content-wrapper-li').find('.type'))
                }
            });
            for (let index in arr) {
                if (currType == '全部') {
                    i++;
                    arr[index].parents('.job-content-wrapper-li').show()
                    $('#noData').hide().text('')

                } else {
                    if (arr[index].text() == currType) {
                        i++
                        arr[index].parents('.job-content-wrapper-li').show()
                    }
                }

            }
        } else {
            if (currType == '全部') {
                i++
                $('.job-content-wrapper-li').show();
                $('#noData').hide()
            } else {
                $('.type').each(function (index, key) {
                    if ($(key).text() == currType) {
                        i++;
                        $(key).parents('.job-content-wrapper-li').show()
                    }
                });
            }

        }

        if (i == 0) {
            $('#noData').show().text('暂无岗位信息')
        } else {
            $('#noData').hide().text('')
        }
    })
});