
// 神秘线索
/*
    hint: '水池'
    boss: '鲤鱼精'
    places: ['第7章', '御魂2/3/9', null]
*/
var misteryHints = [];
$($('.table4')[0]).find('table').find('.row').each(function(i, row) {
    var hint = $($(row).find('.col1')[0]).html();
    var boss = $($(row).find('.col2')[0]).html();
    var places = [];
    $(row).find('td').not('[data-searchable]').each(function(i, place) {
        place = $(place).html();
        if (place == '-') {
            place = null;
        }
        places.push(place);
    });
    var hint = {
        'hint': hint,
        'boss': boss,
        'places': places
    }
    misteryHints.push(hint);
});
// console.log(misteryHints)

function categorizeBoss(boss, allBoss) {
    var category = $.Pinyin({value: boss})[0];
    if (!(category in allBoss)) {
        allBoss[category] = [];
    }
    allBoss[category].push(boss);
}

var allBoss = {};
function loadAllBoss() {
    $('.ss-content').each(function(i, element) {
        $(element).find('span').each(function(j, boss) {
            var bossName = $(boss).html();
            categorizeBoss(bossName, allBoss);
        });
    });
    misteryHints.forEach(function(row) {
        categorizeBoss(row.hint, allBoss);
    });
    return allBoss;
}

$('<link/>', {
   rel: 'stylesheet',
   type: 'text/css',
   href: 'https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css'
}).appendTo('head');
$('<link/>', {
   rel: 'stylesheet',
   type: 'text/css',
   href: 'https://rawgit.com/janepeng/yys/master/dialog.css'
}).appendTo('head');

$.when(
    // chinese to pinyin converter
    $.getScript("https://rawgit.com/haycco/jquery-pinyin/master/src/jquery.pinyin.js"),
    $.getScript("https://rawgit.com/janepeng/yys/master/directFilter.js"),
    $.getScript("https://code.jquery.com/ui/1.12.1/jquery-ui.js"),
    $.getScript("https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore.js"),
    $.Deferred(function(deferred){
        $(deferred.resolve);
    })
).done(function() {
    loadAllBoss();
    loadDialog();
});

// custom search
var searchTerms = [];
function addBossToSearch(value) {
    searchTerms.push(value.innerHTML);
    $('#dialog-form').dialog('option', 'title', searchTerms.join(", "));
}

function getSearchResult() {
    var processedSearchTerms = [];
    searchTerms.forEach(function(boss) {
        var result = _.findWhere(misteryHints, {hint: boss});
        if (result) {
            boss = result.boss;
        }
        processedSearchTerms.push(boss);
    });
    search(processedSearchTerms);
    $('#dialog-form').dialog('close');
}

function loadDialog() {
    // build the dialog for user input
    var dialogForm = "<div id='dialog-form'>\n";
    _.sortBy(_.keys(allBoss)).forEach(function(key) {
        dialogForm += "<label>" + key + "</label>\n";
        allBoss[key].forEach(function(boss) {
            var misteryHint = _.findWhere(misteryHints, {hint: boss});
            if (misteryHint) {
                dialogForm += "<a class='pointer' value='" + misteryHint.boss + "' onclick='addBossToSearch(this)'>" + misteryHint.hint + "</a>\n";
            } else {
                dialogForm += "<a class='pointer' value='" + boss + "' onclick='addBossToSearch(this)'>" + boss + "</a>\n";
            }
        });
    });
    dialogForm += "<label>神秘线索</label>\n";
    misteryHints.forEach(function(row) {
        dialogForm += "<a class='pointer' value='" + row.boss + "' onclick='addBossToSearch(this)'>" + row.hint + "</a>\n";
    });
    dialogForm += "</div>";

    // put dialog in dom
    $(dialogForm).insertAfter('.page');
    var viewWidth = (window.innerWidth > 0) ? window.innerWidth : screen.width;
    if (viewWidth > 450) {
        viewWidth = 450;
    }
    viewWidth -= 10;

    var dialog = $("#dialog-form").dialog({
        autoOpen: false,
        height: 450,
        width: viewWidth,
        modal: true,
        buttons: {
            "submit": getSearchResult,
            Cancel: function() {
                dialog.dialog("close");
            }
        },
        close: function() {
            dialog.dialog("close");
        }
    });

    form = dialog.find("form").on("submit", function(event) {
        event.preventDefault();
        getSearchResult();
    });

    dialog.dialog("open");
}
