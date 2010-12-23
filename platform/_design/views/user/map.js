function(doc) {
  if("User" == doc.doc_type) {
    emit(doc.name, doc);
  }
}
