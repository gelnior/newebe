function(doc) {
  if("News" == doc.doc_type) {
    emit(doc.date, doc);
  }
}

