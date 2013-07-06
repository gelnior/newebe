function(doc) {
  if("Contact" == doc.doc_type) {
    for(i = 0; i < doc.tags.length; i++) {
        emit(doc.tags[i], doc);
    }
  }
}
