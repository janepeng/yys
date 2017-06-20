
// chinese to pinyin converter
$.getScript("https://rawgit.com/haycco/jquery-pinyin/master/src/jquery.pinyin.js");
$.getScript("https://code.jquery.com/ui/1.12.1/jquery-ui.js");
$.getScript("https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore.js");
$('<link/>', {
   rel: 'stylesheet',
   type: 'text/css',
   href: 'https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css'
}).appendTo('head');
$('<link/>', {
   rel: 'stylesheet',
   type: 'text/css',
   href: 'https://rawgit.com/ui/1.12.1/themes/base/jquery-ui.css'
}).appendTo('head');


var allBoss = {};
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
console.log(allBoss)

// 探索副本
/*
	name: '第一章 雀食奇谭'
	bosses: {
		'天邪鬼绿1': ['提灯小僧×2, 提灯小僧×2, 提灯小僧×2']
	},
*/
var tansuoChapters = [];

$($('.table1')[0]).find('.table').each(function(i, table) {
	var name = $(table).find('.first-row').first().children(':first').html();
	var bosses = {};
	$(table).find('.row').each(function(i, row) {
		var mainBoss = $(row).find('.col1').first().html();
		if (!(mainBoss in bosses)) {
			bosses[mainBoss] = [];
		}
		$(row).find('tr').find('td').not('.col1').each(function(i, fellowBoss) {
			var fellowBoss = $(fellowBoss).html();
			if (fellowBoss != '&nbsp;') {
				bosses[mainBoss].push(fellowBoss);
			}
		});
	});

	var chapter = {
		'name': name,
		'bosses': bosses
	}
	tansuoChapters.push(chapter);
});
console.log(tansuoChapters)

// 御魂副本
/*
	name: '第一层'
	bosses: ['提灯小僧×2, 提灯小僧×2, 提灯小僧×2']
*/
var yuhunChapters = [];
$($('.table2')[0]).find('table').each(function(i, table) {
	var name = $(table).find('.first-row').first().children(':first').html();
	var bosses = [];
	$(table).find('td').not('.col1').each(function(i, fellowBoss) {
		var fellowBoss = $(fellowBoss).html();
		if (fellowBoss != '&nbsp;') {
			bosses.push(fellowBoss);
		}
	});

	var chapter = {
		'name': name,
		'bosses': bosses
	}
	yuhunChapters.push(chapter);
});
console.log(yuhunChapters)

// 妖气封印
/*
	name: '跳跳哥哥'
	bosses: ['提灯小僧×2, 提灯小僧×2, 提灯小僧×2']
*/
var yaoqifengyin = [];
$($('.table3')[0]).find('table').each(function(i, table) {
	var name = $(table).find('.first-row').first().children(':first').html();
	var bosses = [];
	$(table).find('td').not('.col1').each(function(i, fellowBoss) {
		var fellowBoss = $(fellowBoss).html();
		if (fellowBoss != '&nbsp;') {
			bosses.push(fellowBoss);
		}
	});

	var chapter = {
		'name': name,
		'bosses': bosses
	}
	yaoqifengyin.push(chapter);
});
console.log(yaoqifengyin)

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
console.log(misteryHints)

// 秘闻副本
/*
	name: '红叶一层'
	bosses: ['提灯小僧×2, 提灯小僧×2, 提灯小僧×2']
*/
var secretDungeon = [];
$($('.table5')[0]).find('table').each(function(i, table) {
	var name = $(table).find('.first-row').first().children(':first').html();
	var bosses = [];
	$(table).find('td').not('.col1').each(function(i, fellowBoss) {
		var fellowBoss = $(fellowBoss).html();
		if (fellowBoss != '&nbsp;') {
			bosses.push(fellowBoss);
		}
	});

	var chapter = {
		'name': name,
		'bosses': bosses
	}
	secretDungeon.push(chapter);
});
console.log(secretDungeon)


// custom search
var searchTerms = [];
function addBossToSearch(value) {
	searchTerms.push(value.innerHTML);
	console.log(searchTerms)
}

// build the dialog for user input
var dialogForm = "<div id='dialog-form'>\n";
for (key in allBoss) {
	dialogForm += "<label>" + key + "</label>\n";
	allBoss[key].forEach(function(boss) {
		dialogForm += "<a class='clickable' value='" + boss + "' onclick='addBossToSearch(this)'>" + boss + "</a>\n";
	});
};
dialogForm += "<div id='selectedBosses'></div>"
dialogForm += "</div>";

// put dialog in dom
$(dialogForm).insertAfter('.page');

function getSearchResult() {
	searchTerms.forEach(function(boss) {
		var result = _.findWhere(misteryHints, {hint: boss});
		if (result) {
			boss = result.boss;
		}
		// search in 探索副本
		/*
			chapterName: xx,
			mainBosses: {
				bossName: count
			},
			chapterCount: count
		*/
		var searchResult = [];
		tansuoChapters.forEach(function(chapter) {
			var chapterSearch = {name: chapter.name, mainBosses: [], count: 0};
			for (var mainBoss in chapter.bosses) {
				var count = 0;
				chapter.bosses[mainBoss].forEach(function(fellowBoss) {
					if (fellowBoss.indexOf(boss) > -1) {
						count += parseInt(fellowBoss.split('×')[1], 10);
					}
				});
				if (count) {
					chapterSearch.mainBosses[mainBoss] = count;
					chapterSearch.count += count;
				}
			}
			if (chapterSearch.count) {
				searchResult.push(chapterSearch);
			}
		});
		console.log(searchResult)
	});
}

var dialog = $("#dialog-form").dialog({
	autoOpen: false,
	height: 400,
	width: 450,
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













