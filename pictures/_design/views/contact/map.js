function(doc) {
  if("Picture" == doc.doc_type && doc.isMine == false) {
    emit([doc.authorKey, doc.date], doc);
  }
}
