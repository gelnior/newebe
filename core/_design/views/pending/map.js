function(doc) {
  if("Contact" == doc.doc_type 
     && ("pending" == doc.state || "error" == doc.state)) {
    emit(doc.slug, doc);
  }
}
