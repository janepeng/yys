
var allBoss = {};
function loadAllBoss() {
    $('.ss-content').each(function(i, element) {
        $(element).find('span').each(function(j, boss) {
            var bossName = $(boss).html();
            var category = $.Pinyin({value: bossName})[0];
            if (!(category in allBoss)) {
                allBoss[category] = [];
            }
            allBoss[category].push(bossName);
        });
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

// custom search
var searchTerms = [];
function addBossToSearch(value) {
    searchTerms.push(value.innerHTML);
    // $("#selectedBosses").html(searchTerms.join(", "));
    $('.selectorUsedToCreateTheDialog').dialog('option', searchTerms.join(", "));
}

function getSearchResult() {
    searchTerms.forEach(function(boss) {
        var result = _.findWhere(misteryHints, {hint: boss});
        if (result) {
            boss = result.boss;
        }
    });
    search(searchTerms);
    $('#dialog-form').dialog('close');
}

function loadDialog() {
    // build the dialog for user input
    var dialogForm = "<div id='dialog-form'>\n";
    dialogForm += "<div class='col-left'>\n";
    _.sortBy(_.keys(allBoss)).forEach(function(key) {
        dialogForm += "<label>" + key + "</label>\n";
        allBoss[key].forEach(function(boss) {
            dialogForm += "<a class='pointer' value='" + boss + "' onclick='addBossToSearch(this)'>" + boss + "</a>\n";
        });
    });
    dialogForm += "</div>";
    dialogForm += "<div id='selectedBosses' class='col-right'></div>"
    dialogForm += "</div>";

    // put dialog in dom
    $(dialogForm).insertAfter('.page');
    var viewWidth = (window.innerWidth > 0) ? window.innerWidth : screen.width;
    if (viewWidth > 450) {
        viewWidth = 450;
    }
    viewWidth -= 10;
    viewWidth = 375;

    var dialog = $("#dialog-form").dialog({
        autoOpen: false,
        height: 400,
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
