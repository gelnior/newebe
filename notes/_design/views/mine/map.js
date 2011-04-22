function(doc) {
  if("Note" == doc.doc_type && doc.isMine) {
    emit(doc.key, doc);
  }
}

