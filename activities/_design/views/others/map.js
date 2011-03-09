function(doc) {
  if("Activity" == doc.doc_type && !doc.isMine) {
    emit(doc.date, doc);
  }
}

