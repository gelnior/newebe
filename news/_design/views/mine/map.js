function(doc) {
  if("MicroPost" == doc.doc_type && doc.isMine) {
    emit(doc.date, doc);
  }
}

