function(doc) {
  if("Contact" == doc.doc_type && "Wait for approval" == doc.state) {
    emit(doc.slug, doc);
  }
}
