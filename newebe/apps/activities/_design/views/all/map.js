function(doc) {
  if("Activity" == doc.doc_type && "micropost"  == doc.docType) {
    emit(doc.date, doc);
  }
}

