function(doc) {
  if("MicroPost" == doc.doc_type) {
    emit([doc.authorKey, doc.date], doc);
  }
}

