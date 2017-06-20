
// 0: SSR, 1: SR, 2: R, 3: N
var bossCategories = {};
$('.ss-content').each(function(i, element) {
    $(element).find('span').each(function(j, boss) {
        var bossName = $(boss).html();
        if (!(i in bossCategories)) {
            bossCategories[i] = [];
        }
        bossCategories[i].push(bossName);
    });
});

var searchTable = function(table, values, showRow, tableClass) {
    var showTable = false;
    table.find('.row').hide();
    table.find(tableClass).hide();
    table.find('[data-searchable="true"]').each(function() {
        var currentCell = $(this);
        var text = currentCell.text();
        values.forEach(function(value) {
            var numOfBosses = parseInt(text.replace(/^\D+/g, ''), 10);
            // 不显示只有一只N式神的关卡
            if (text.indexOf(value) > -1 && (bossCategories[3].indexOf(value) < 0 || numOfBosses > 1)) {
                showTable = true;
                currentCell.html(currentCell.html().replace(value,'<span class="kw-highlight">'+value+'</span>'));
                if (showRow) {
                    currentCell.parents('.row').show();
                }
                currentCell.parents(tableClass).show();
            }
        });
    });
    return showTable;
}
var search = function(searchTerms) {
    var table1 = $('.table1');
    if (searchTable(table1, searchTerms, true, '.table')) {
        table1.show();
    } else {
        table1.hide();
    }
    var table2 = $('.table2');
    if (searchTable(table2, searchTerms, false, 'table')) {
        table2.show();
    } else {
        table2.hide();
    }
    var table3 = $('.table3');
    if (searchTable(table3, searchTerms, false, 'table')) {
        table3.show();
    } else {
        table3.hide();
    }
    var table5 = $('.table5');
    if (searchTable(table5, searchTerms, false, 'table')) {
        table5.show();
    } else {
        table5.hide();
    }
    $('.table4').hide();
    $('.filter-header>li').removeClass('actived');
}
var searchTerms = ["提灯小僧", "天邪鬼绿"]
search(searchTerms)