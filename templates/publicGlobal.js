window.angular.module('ngff.services.global', [])
  .factory('Global', function(){
    var current_user = window.user;
    var apps = [${--repeat1:menu:menu:'${menu.name}'${end-comma}--1}];
    var current_app = apps[0];

    return {
      currentUser: function() {
        return current_user;
      },
      isSignedIn: function() {
        return !!current_user;
      },
      introMessage: function(m) {
        if ( m ) {
          msg = m;
        }
        return msg;
      },
      currentApp: function(app) {
        if ( app ) {
          current_app = app;
        }
        return current_app;
      },
      currentAppName: function() {
${--repeat2:menu:../menu:
        if ( current_app == '${menu.name}' ) {
          return '${menu.title}';
        }
--2}     return 'No Name';
      }
${--repeat3:model:model[@dropdown='search']:
      ,${model.name}Select: {
        placeholder: "Search for a ${model.camelname}",
        minimumInputLength: ${model.min-searchlength},
        allowClear: true,
        ajax: {
            url: "/${model.name}s",
            data: function (term, page) { // page is the one-based page number tracked by Select2
			    var searchFields = [${--repeat4:field:model[@name='${model.name}']//field[@search='true' and @type!='ref']:'${field.name}'${end-comma}--4}];
		        var termArray = term.split(' ');
		        var qval = {};
		        for ( var i=0; i<termArray.length; i++ ) {
        			if ( i <= searchFields.length ) {
        				qval[searchFields[i]] = { $regex : termArray[i] + '.*', $options: 'i' };
        			}
        		}

                return {
                    q: qval,
                    page_limit: 10, // page size
                    page: page // page number
                };
            },
            results: function (responseObj, page) {
                var more = responseObj.data.length > 0; // whether or not there are more results available

                // notice we return the value of more so Select2 knows if more results can be loaded
                return {results: responseObj.data, more: more};
            }
        },
        initSelection: function(element, callback) {
            var id=$(element).val();
            if (id!=="") {
                $.ajax("/${model.name}s/"+id).done(function(data) { callback(data); });
            }
        },
        id: function (e) { return e._id; },
        formatResult: function (result) { return ${--repeat5:field:model[@name='${model.name}']//field[@search='true' and @type!='ref']:result.${field.name}${end-strpad}--5}; },
        formatSelection: function (result) { return ${--repeat6:field:model[@name='${model.name}']//field[@search='true' and @type!='ref']:result.${field.name}${end-strpad}--6}; },
        escapeMarkup: function (m) { return m; }     
      }
--3}      

${--repeat7:model:model[@dropdown='nosearch']:
      ,${model.name}Select: {
        minimumResultsForSearch: -1,
        placeholder: "Select a ${model.camelname}",
        allowClear: true,
        ajax: {
            url: "/${model.name}s",
            results: function (responseObj, page) {
                var more = (page * 10) < responseObj.data.length;
                return {results: responseObj.data, more: more};
            }
        },
        initSelection: function(element, callback) {
            var id=$(element).val();
            if (id!=="") {
                $.ajax("/${model.name}s/"+id).done(function(data) { callback(data); });
            }
        },
        id: function (e) { return e._id; },
        formatResult: function (result) { return result.name; },
        formatSelection: function (result) { return result.name; },
        escapeMarkup: function (m) { return m; }     
      }
--7}      

    };
  });