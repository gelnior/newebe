function(doc) {
  if("Contact" == doc.doc_type 
     && ("Pending" == doc.state || "Error" == doc.state)) {
    emit(doc.slug, doc);
  }
}
