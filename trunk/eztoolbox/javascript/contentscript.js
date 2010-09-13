function isEZSite()
{
    // for now check only if there is a div with id debug
    if ( $('#debug').length > 0 )
    {
        return true;
    }
    return false;
}

function countErrors()
{
    var timingPointsTable = $('#timingpoints');
    var errorTable = timingPointsTable.parent().find('table:first');
    return errorTable.find("span:contains('Error')").length;
}

if ( isEZSite() ) {
  var nbErrors = countErrors();
  console.log(nbErrors);
  if ( nbErrors > 0 )
  {
      // Notify the background page.
      chrome.extension.sendRequest({"nbErrors":nbErrors}, function(response) {});
  }
}