 /* eslint no-console: ["error", { allow: ["warn", "error", "log", "info"] }] */
/* eslint no-undef: "error" */

var Sitecore = Sitecore || {};

Sitecore.InitBucketList = function (id, clientId, pageNumber, searchHandlerUrl, filter, databaseUrlParameter, typeToSearchString, of, enableSetStartLocation) {
    var self = {};

    self.id = id;
    self.clientId = clientId;
    self.pageNumber = pageNumber;
    self.searchHandlerUrl = searchHandlerUrl;
    self.filter = filter;
    self.databaseUrlParameter = databaseUrlParameter;
    self.typeToSearchString = typeToSearchString;
    self.of = of;
    self.enableSetStartLocation = (enableSetStartLocation.toLowerCase() === 'true');

    self.currentPage = 1;
    self.selectedId = '';

    self.doneTypingInterval = 2000; //time in ms, 2 second for example

    self.contentLanguage = $('scLanguage') && $('scLanguage').value;

    var typingTimer;

    self.format = function (template) {
        var args = arguments;
        return template.replace(/\{(\d+)\}/g, function (m, n) { return args[parseInt(n) + 1]; });
    };

    // Sends 'GET' request to url specified by parameter
    // and apply success handler to multilist element
    self.sendRequest = function (url, data, multilist) {
        console.log(data);
        new Ajax.Request(url,
            {
                method: 'POST',
                parameters: data,
                onSuccess: new self.SuccessHandler(multilist)
            });
    };

    // Cunstructor for request success handler
    self.SuccessHandler = function (multilist) {
        console.log(multilist);
        return function (request) {
            var response = eval(request.responseText);
            multilist.options.length = 0;
            multilist.removeClassName('loadingItems');

            var itemIdsHash = {};
            var reducedItems = [];
            var i;
            var item;
            for (i = 0; i < response.items.length; i++) {
                item = response.items[i];

                if (!itemIdsHash[item.ItemId]) {
                    itemIdsHash[item.ItemId] = true;
                    reducedItems[reducedItems.length] = item;
                }
            }
            var author;
            var folder;
            for (i = 0; i < reducedItems.length; i++) {
                item = reducedItems[i];
                //multilist.options[multilist.options.length] = new Option('🇫🇷 ' + (item.DisplayName || item.Name) + ' / ' + item.Path + ' (-->' + item.TemplateName + (item.Bucket && (' - ' + item.Bucket)) + ') Created by '+item.CreatedBy, item.ItemId);
                author = item.CreatedBy;
                author = author.split("\\");
                folder = item.Path
                folder = folder.split("/Home/");
                multilist.options[multilist.options.length] = new Option('👤' + author[1] + ' --> ' + folder[1] , item.ItemId);
            }

            self.pageNumber = response.PageNumbers;
            self.currentPage = response.CurrentPage;
            $('pageNumber' + self.clientId).innerHTML = self.format(self.of, self.currentPage, self.pageNumber);
        };
    };

    // Return id of selected item
    self.getSelectedItemId = function (controlSuffix) {
        var all = scForm.browser.getControl(self.id + controlSuffix);

        for (var n = 0; n < all.options.length; n++) {
            var option = all.options[n];

            if (option.selected) {
                return option.value;
            }
        }

        return null;
    };

    self.onFilterFocus = function (filterBox) {
        if (filterBox.value == self.typeToSearchString) {
            filterBox.value = '';
        }

        filterBox.addClassName('active').removeClassName('inactive');
    };

    self.onFilterBlur = function (filterBox) {
        if (!filterBox.value) {
            filterBox.value = self.typeToSearchString;
        }

        filterBox.removeClassName('active').addClassName('inactive');
    };

    self.moveToCurrentPage = function () {
        var filterBox = document.getElementById('filterBox' + self.clientId);
        var filterValue = (filterBox.value && filterBox.value != self.typeToSearchString) ? filterBox.value : '*';

        var multilist = $(self.clientId + '_unselected').addClassName('loadingItems');
        var savedStr = encodeURIComponent(filterValue);
        var filterString = self.enableSetStartLocation ? self.getOverrideString('%2Blocation=') : self.filter;
        var selectedIdsFilter = self.getSelectedIdsFilter();

        self.sendRequest(self.searchHandlerUrl, 'fromBucketListField=' + savedStr + "&" + filterString.replace(/\+/g, "%2B") + selectedIdsFilter + '&pageNumber=' + self.currentPage + self.databaseUrlParameter + '&scLanguage=' + self.contentLanguage, multilist);
    };

    // Replaces overrideKey value in filter by value from ovverrideInput
    self.getOverrideString = function (overrideKey) {
        var overrideInput = document.getElementById('locationOverride' + self.clientId);

        if (!overrideInput || !overrideInput.value.length > 0) {
            return self.filter;
        }

        var replaceStartIndex = self.filter.indexOf(overrideKey);

        if (!~replaceStartIndex) {
            return self.filter;
        }

        var replaceEndIndex = self.filter.indexOf('&', replaceStartIndex + 1);

        if (!~replaceEndIndex) {
            replaceEndIndex = self.filter.length;
        }

        var stringToReplace = self.filter.substring(replaceStartIndex, replaceEndIndex);

        return self.filter.replace(stringToReplace, overrideKey + overrideInput.value);
    };

    self.getSelectedIdsFilter = function() {
        return [].slice.call($(self.clientId + '_selected').options, 0)
            .map(function(option) { return "&-id=" + option.value })
            .join('');
    };

    self.initEventHandlers = function () {
        $('filterBox' + self.clientId).observe('focus', function () {
            self.onFilterFocus($('filterBox' + self.clientId));
        });

        $('filterBox' + self.clientId).observe('blur', function () {
            self.onFilterBlur($('filterBox' + self.clientId));
        });

        $('filterBox' + self.clientId).observe('keyup', function () {
            typingTimer = setTimeout(function () { self.currentPage = 1; self.moveToCurrentPage(); }, self.doneTypingInterval);
        });

        $('filterBox' + self.clientId).observe('keydown', function () {
            clearTimeout(typingTimer);
        });

        $('next' + self.clientId).observe('click', function () {
            if (self.currentPage + 1 <= self.pageNumber) {
                self.currentPage++;
                self.moveToCurrentPage();
            }
        });

        $('prev' + self.clientId).observe('click', function () {
            if (self.currentPage > 1) {
                self.currentPage--;
                self.moveToCurrentPage();
            }
        });

        $(self.id + '_unselected').observe('dblclick', function () {
            scContent.multilistMoveRight(self.id);
        });

        $(self.id + '_selected').observe('dblclick', function () {
            scContent.multilistMoveLeft(self.id);
        });

        $(self.id + '_unselected').observe('click', function () {
            self.selectedId = self.getSelectedItemId('_unselected');
        });

        $(self.id + '_selected').observe('click', function () {
            self.selectedId = self.getSelectedItemId('_selected');
        });

        $('btnRight' + self.id).observe('click', function () {
            scContent.multilistMoveRight(self.id);
        });

        $('btnLeft' + self.id).observe('click', function () {
            scContent.multilistMoveLeft(self.id);
        });

        $('refresh' + self.clientId).observe('click', function () {
            self.currentPage = 1;
            self.moveToCurrentPage();
        });

        $('goto' + self.clientId).observe('click', function () {
            scForm.postRequest('', '', '', 'contenteditor:launchtab(url=' + self.selectedId + ', la=' + self.contentLanguage + ')');
            return false;
        });
    };

    var pageNumberElement = $('pageNumber' + self.clientId);
    if (pageNumberElement) {
        pageNumberElement.innerHTML = self.format(self.of, self.currentPage, self.pageNumber);
        self.initEventHandlers();
        self.moveToCurrentPage();
    }
};