function(doc) {
  if("Activity" == doc.doc_type) {
    emit(doc.date, doc);
  }
}

