var papermill = (function() {
  $.getJSON("/papers/papers.json", function(data) {
      const authors = data.authors;
      const conference_papers = data.conference_papers;
      const journal_papers = data.journal_papers;
      const abstracts = data.posters;
      const venues = data.venues;

      let papers = conference_papers.concat(journal_papers);
      papers.sort(sortByYear);
      papers.forEach(appendFullPaper);
      abstracts.sort(sortByYear);
      abstracts.forEach(appendAbstractPoster);

      function sortByYear(p1, p2) {
        // Sort more recent years with lower indices
        return p1['year'] > p2['year'] ? -1 : 1;
      }

      function appendFullPaper(p, id) {
        appendPaper('paper-table', p, id);
      }

      function appendAbstractPoster(p, id) {
        appendPaper('abstract-table', p, id);
      }

      function appendPaper(tableId, p, id) {
        let pHtml = "<span class='title'>"+p['title']+"</span>";
        pHtml += "<br>";
        pHtml += "<span class='pub'>"+(venues.hasOwnProperty(p['venue']) ? venues[p['venue']]['short'] : p['venue'])+"</span>";
        pHtml += ", "+p['year'];
        if (p.hasOwnProperty('award')) pHtml += ", <span class='award'>"+p['award']+"</span>";
        pHtml += "<br>";
        pHtml += getAuthorsHtml(p["authors"]);

        if (p.hasOwnProperty('pdf') || p.hasOwnProperty('link') || p.hasOwnProperty('video') || p.hasOwnProperty('slides')) {
          pHtml += "<br>";
          if (p.hasOwnProperty('pdf') && p['pdf']) pHtml += "<a href='"+p['pdf']+"'>pdf</a> ";
          if (p.hasOwnProperty('link') && p['link']) pHtml += "<a href='"+p['link']+"'>link</a> ";
          if (p.hasOwnProperty('video') && p['video']) pHtml += "<a href='"+p['video']+"'>video</a> ";
          if (p.hasOwnProperty('slides') && p['slides']) pHtml += "<a href='"+p['slides']+"'>slides</a>";
        }

        function getAuthorsHtml(arr) {
          let newAuths = arr.map(function(a) {
            let myClass = "other-author";
            if (a === "me") myClass = "self-author";
            return "<span class='" + myClass + "'>" +
              (authors.hasOwnProperty(a) ? authors[a] : a) + "</span>";
          });
          return newAuths.join(", ");
        }


        $('#'+tableId+' > tbody:last-child').append("<tr><td>"+(id+1)+"</td><td>"+pHtml+"</td></tr>");
      }

    })
    .fail(function(jqxhr, textStatus, error) {
      var err = textStatus + ", " + error;
      console.log("Request Failed: " + err);
    })
    .always(function() {
      console.log("papers.json loaded");
    });
})();
