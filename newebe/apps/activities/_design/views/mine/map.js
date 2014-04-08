function(doc) {
  if("Activity" == doc.doc_type && "micropost" == doc.docType && doc.isMine) {
    emit(doc.date, doc);
  }
}

