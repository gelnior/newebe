function(doc) {
  if("LastSequence" == doc.doc_type) {
    emit(doc.lastSequence, doc);
  }
}
