$(document).ready(function () {
	var pageOffset = 0;
	var history = new Array();

	// load history in autocomplete
	history = historyToArray(history);
	
	$("#searchText").autocompleteArray( history );

	// Deal with search
	$('form#searchForm').bind('submit', function() {
		// start loading and hide previous results
		$('#loading').toggleClass("hide");
		$('div.navigation').addClass('hide');
		$('div#results').html('');
  	    $('#noResult').addClass("hide");
  	    
  	    //launch search
	  	var searchText = $(this).find('#searchText').attr('value');
  	    searcheZDoc( searchText );

    	// store data in history  	    
  	    storeSearch( searchText, history );

  	    
		return false;
	});
	
	// Deal with load more
	$('div.navigation a#next').bind('click', function() {
		$('#loading').toggleClass("hide");
		loadMoreeZDoc(pageOffset);
		return false;
	});
	
});

function searcheZDoc( searchText )
{
	params = {
			SearchText: searchText,
			SearchSectionID: 22,
			isOnDocumentation: true,
			SearchPageLimit: 2,
	}
	$.get("http://ez.no/doc/content/advancedsearch", params,
	function(data){
      // process data when Xhr is done
      if ($(data).find('form table').html())
      {
		  $('div#results').html("<table>"+$(data).find('form table').html()+"</table>");
		  $('div#results').find('a').each(function() {
			  $(this).attr('href','http://ez.no'+$(this).attr('href'));
			  $(this).attr('target','_blank');
		  });
	      $('#loading').toggleClass("hide");
	      $('div.navigation').removeClass('hide');
      }
      else
      {
          $('#loading').toggleClass("hide");
    	  $('#noResult').toggleClass("hide");
      }
	});
}

function loadMoreeZDoc( pageOffset )
{
	params = { 
			SearchText: $('form#searchForm').find('#searchText').attr('value'), 
			SearchSectionID: 22, 
			isOnDocumentation: true,
			SearchPageLimit: 2,
	}
	pageOffset = parseInt(pageOffset) + 10;
	$.get("http://ez.no/doc/content/advancedsearch/(offset)/"+pageOffset, params,
	function(data){
		if ( $(data).find('form table tbody tr').html() )
		{
			$(data).find('form table tbody tr').each(function(index){
				if ( index != 0 )
				{
					$(this).find('a').attr('href','http://ez.no'+$(this).find('a').attr('href')).attr('target','_blank');
					$('div#results table tbody').append("<tr class="+$('div#results table tbody tr:last').prev().attr('class')+">"+$(this).html()+"</tr>");
				}
			});
		}
		else
		{
			$('div.navigation').addClass('hide');
		}
        $('#loading').toggleClass("hide");
	});
}

function in_array(arrayObject, p_val) {
    for(var i = 0, l = arrayObject.length; i < l; i++) {
    	console.log(arrayObject[i]+":"+p_val);
        if(arrayObject[i] == p_val) {
            rowid = i;
            return true;
        }
    }
    return false;
}

function storeSearch( searchText, history )
{	
    if ( localStorage.getItem('searchItems') )
    {
        var searchJson = JSON.parse(localStorage.getItem('searchItems'));
    }
    
    if ( !in_array(history,searchText) )
    {
	    if (searchJson)
	    {
	    	searchJson[localStorage.getItem('searchItemsCount')] = searchText;
	    	var itemsCount = localStorage.getItem('searchItemsCount');
	    	localStorage.setItem('searchItemsCount',eval(parseInt(itemsCount)+1));
	    }
	    else
	    {
	    	searchJson = { 0: searchText  };
	    	localStorage.setItem('searchItemsCount',1);
	    }
	    localStorage.setItem('searchItems', JSON.stringify(searchJson) );
	    
	    //refresh autocomplete
	    history = historyToArray(history);
  	    $("#searchText").autocompleteArray( history );
    }
}

function historyToArray(history)
{
	var searchItemsCount = localStorage.getItem('searchItemsCount');
        if ( localStorage.getItem('searchItems') )
        {
            var searchJson = JSON.parse(localStorage.getItem('searchItems'));
        }
        
	for ( var i=0; i<searchItemsCount; i++ )
	{
		history[i] = searchJson[i];
	}
	
	return history;
}