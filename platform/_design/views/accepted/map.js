function(doc) {    
  if("Contact" == doc.doc_type && "trusted" == doc.state) {
    emit(doc.slug, doc);
  }
}
