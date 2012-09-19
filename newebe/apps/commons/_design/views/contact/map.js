function(doc) {
  if("Common" == doc.doc_type && doc.isMine == false) {
    emit([doc.authorKey, doc.date], doc);
  }
}
