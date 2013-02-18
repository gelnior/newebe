function(doc) {
  if("ContactTag" == doc.doc_type) {
    emit(tag, doc);
  }
}
