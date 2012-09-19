function(doc) {
  if("Common" == doc.doc_type && true == doc.isMine) {
    if(doc.tags === undefined || doc.tags === null) 
      doc.tags = ["all"]
    doc.tags.forEach(function(tag) {
      emit([tag, doc.date], doc);
    });
  }
}

