function(doc) {    
  if("Contact" == doc.doc_type && "Trusted" == doc.state) {
    emit(doc.key, doc);
  }
}
