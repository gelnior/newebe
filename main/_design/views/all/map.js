function(doc) {
  if("Tweet" == doc.doc_type) {
    emit(null, doc);
  }
}

