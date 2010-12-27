function(doc) {
  if("Contact" == doc.doc_type && "requested" == doc.state) {
    emit(doc.slug, doc);
  }
}
