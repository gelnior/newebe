var isCtrl = false; 
var publisher = new NewsPublisher();

function News(author, content, pubDate) {
   var author = author;
   var content = content;
   var pubDate = pubDate;

   function getHtml() {
     var deleteButtonId = 'news-delete-button-' + publisher.buttonCounter;
     var html = '<div class="news-news">\n';
     html += '<a href="#" class="news-delete" id="';
     html += deleteButtonId + '"';
     html += '">X</a>';
     html += '<p class="news-news-content">\n';
     html += '<span>' + author + '</span>\n';
     html += content;
     html += '<p>\n';
     html += '<p class="news-news-date">\n';
     var d = Date.parse(pubDate);
     html += d.toString("dd/MM - HH:mm:ss");
     html += '</p>\n';
     publisher.dateDict[deleteButtonId] = d.toString("yyyy-MM-dd-HH-mm-ss");

     publisher.incButtonCounter();
     return html;
   }   
   this.getHtml = getHtml;
}

function NewsPublisher() {
  this.lastRowDate = "";
  this.buttonCounter = 0;
  this.dateDict = {};

  function postNews() {
  var url = "/news/news-item/";
    $.post(url, '{"content": "' +  $("#id_content").val() + '"}',
      function(data){
        prependNews(new News(data.author, data.content, data.date));
        setDeleteButtons();
        $("#id_content").val(null);
        $("#id_content").focus();
      }, "json");
  }
  this.postNews = postNews;

  function publishDbRows(data) {
    total_rows = data.total_rows;
    rows = data.rows;
    for(var rowIdx in rows) {
      row = rows[rowIdx]; 
      appendNews(new News(row.author, row.content, row.date));
    } 

    lastRowDate = rows[rows.length -1].date;  
    lastRowDate = lastRowDate.replace(" ", "-");
    lastRowDate = lastRowDate.replace(":", "-");
    lastRowDate = lastRowDate.replace(":", "-");
    setDeleteButtons();
  }

  function getLatestNews() {
    publisher.resetButtonCounter();
    $.getJSON('/news/news-item/', function(data) {
      publishDbRows(data);
      $("#id_content").focus()
    });
  }
  this.getLatestNews = getLatestNews;

  function getMoreNews() {    
    $.getJSON('/news/news-item/' + lastRowDate + "/", function(data) {
      publishDbRows(data);
      if(rows.length < 10) {
        $("#more-news").hide();
      }
    });
  }
  this.getMoreNews = getMoreNews;

  function getNews(dateFrom) {    
    publisher.resetButtonCounter();
    $.getJSON('/news/news-item/' + dateFrom + "/", function(data) {
      publishDbRows(data);
      if(rows.length < 10) {
        $("#more-news").hide();
      }
      $("#id_content").focus()
    });
  }
  this.getNews = getNews;

  function prependNews(news) {
    $("#newss").prepend(news.getHtml());
  }

  function appendNews(news) {
    $("#newss").append(news.getHtml());
  }

  function setDeleteButtons() {
    $("a.news-delete").hide();
    $(".news-news").hover(function() {
      $(".news-delete", this).show();
    }, function() {
      $(".news-delete", this).hide();
    });
    $("a.news-delete").button();
    $("a.news-delete").click(function(e) {
        var datekey = publisher.dateDict[$(this).attr('id')];
        var id = $(this).attr('id');
        url = '/news/news-item/' + publisher.dateDict[$(this).attr('id')] + '/';
        $.ajax({
          url: url,
          type: 'DELETE',
          success: function(data) {
            $("#" + id).parent().remove();
          }
        });
    });
  }

  function resetButtonCounter() {
    this.buttonCounter = 0;
  } 
  this.resetButtonCounter = resetButtonCounter;

  function incButtonCounter() {
    this.buttonCounter++;
  }
  this.incButtonCounter = incButtonCounter;
}


$(document).ready(function() {
  $("#id_content").focus()
  $("#id_content").keyup(function(event) {
    if(event.keyCode == '17') isCtrl=false; 
  });
  $("#id_content").keydown(function(event) { 
    if(event.keyCode == '17') isCtrl=true; 
    if(event.keyCode == '13' && isCtrl == true) {
       isCtrl = false;
       publisher.postNews();
    } 
  });
  $("input#news-post-button").click(function(e){
    e.preventDefault();
    publisher.postNews();
    return false;
  });
  publisher.getLatestNews();
  $("button, input:submit").button();
//#  $("a", "news-my-button").button();
  $("a#news-my-button").button();
  $("a#news-all-button").button();
  $("a#news-all-button").button("disable");
  $("a#news-more").button();
  $("#news-my-button").click(function(e){
      $("#newss").empty();
      $("#news-from-datepicker").val(null);
      publisher.getLatestNews();
  });
  $("#news-more").click(function(e){
     publisher.getMoreNews();
  });
  $("#news-from-datepicker").datepicker({
    onSelect : function(dateText, inst) {
      $("#newss").empty();
      d = Date.parse(dateText);
      s = d.toString("yyyy-MM-dd");
      publisher.getNews(s + "-23-59-00");
    }
  });
});


