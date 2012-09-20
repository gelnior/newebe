function(doc) {
  if("Contact" == doc.doc_type) {
    emit(doc.slug, doc);
  }
}
