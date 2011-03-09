function(doc) {
  if("MicroPost" == doc.doc_type) {
    emit(doc._id, doc);
  }
}

