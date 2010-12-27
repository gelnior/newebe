function(doc) {
  if("Contact" == doc.doc_type && "accepted" == doc.state) {
    emit(doc.slug, doc);
  }
}
